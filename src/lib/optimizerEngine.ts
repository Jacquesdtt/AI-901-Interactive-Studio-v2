export type SurfaceType = 'convex' | 'nonconvex' | 'saddle' | 'ravine' | 'plateau';
export type OptimizerType = 'sgd' | 'momentum' | 'rmsprop' | 'adam';

export interface Point3D {
  x: number;
  y: number;
  z: number; // Represents f(x, y)
}

export interface OptimizerState {
  t: number;
  x: number;
  y: number;
  z: number;
  history: Point3D[];
  v_x: number;
  v_y: number;
  m_x: number;
  m_y: number;
}

export class LossSurface {
  constructor(public type: SurfaceType) {}

  f(x: number, y: number): number {
    switch (this.type) {
      case 'convex':
        return 0.15 * (x * x + y * y);
      case 'nonconvex':
        // nonconvex matches the 'rugged' Rastrigin-inspired landscape
        return 0.15 * (x * x + y * y) - 0.4 * (Math.cos(2.2 * x) + Math.cos(2.2 * y)) + 0.8;
      case 'saddle':
        return 0.12 * (x * x - 1.5 * y * y) + 0.45 * Math.cos(x) * Math.sin(y) + 0.8;
      case 'ravine':
        return 0.05 * x * x + 0.8 * Math.pow(y - 0.3 * x * x, 2);
      case 'plateau':
        return 1.2 - 0.005 * x - 0.005 * y;
      default:
        return 0;
    }
  }

  grad(x: number, y: number): [number, number] {
    switch (this.type) {
      case 'convex':
        return [0.3 * x, 0.3 * y];
      case 'nonconvex':
        return [
          0.3 * x + 0.88 * Math.sin(2.2 * x),
          0.3 * y + 0.88 * Math.sin(2.2 * y)
        ];
      case 'saddle':
        return [
          0.24 * x - 0.45 * Math.sin(x) * Math.sin(y),
          -0.36 * y + 0.45 * Math.cos(x) * Math.cos(y)
        ];
      case 'ravine':
        const term = y - 0.3 * x * x;
        return [
          0.1 * x - 1.6 * term * (0.6 * x),
          1.6 * term
        ];
      case 'plateau':
        return [-0.005, -0.005];
      default:
        return [0, 0];
    }
  }
}

export class OptimizerEngine {
  surface: LossSurface;
  state: OptimizerState;
  lr: number = 0.1;
  momentum: number = 0.9;
  beta: number = 0.999;
  epsilon: number = 1e-8;

  constructor(public type: OptimizerType, surfaceType: SurfaceType, startX: number, startY: number) {
    this.surface = new LossSurface(surfaceType);
    this.state = {
      t: 0,
      x: startX,
      y: startY,
      z: this.surface.f(startX, startY),
      history: [{ x: startX, y: startY, z: this.surface.f(startX, startY) }],
      v_x: 0, v_y: 0,
      m_x: 0, m_y: 0
    };
  }

  step(): OptimizerState {
    const { x, y, v_x, v_y, m_x, m_y, t } = this.state;
    const [gx, gy] = this.surface.grad(x, y);
    
    let nx = x, ny = y;
    let n_vx = v_x, n_vy = v_y;
    let n_mx = m_x, n_my = m_y;
    const nt = t + 1;

    if (this.type === 'sgd') {
      nx = x - this.lr * gx;
      ny = y - this.lr * gy;
    } else if (this.type === 'momentum') {
      n_vx = this.momentum * v_x - this.lr * gx;
      n_vy = this.momentum * v_y - this.lr * gy;
      nx = x + n_vx;
      ny = y + n_vy;
    } else if (this.type === 'rmsprop') {
      n_vx = this.beta * v_x + (1 - this.beta) * gx * gx; // using v as squared grad here
      n_vy = this.beta * v_y + (1 - this.beta) * gy * gy;
      nx = x - (this.lr / (Math.sqrt(n_vx) + this.epsilon)) * gx;
      ny = y - (this.lr / (Math.sqrt(n_vy) + this.epsilon)) * gy;
    } else if (this.type === 'adam') {
      n_vx = this.momentum * v_x + (1 - this.momentum) * gx; // first moment
      n_vy = this.momentum * v_y + (1 - this.momentum) * gy;
      n_mx = this.beta * m_x + (1 - this.beta) * gx * gx; // second moment
      n_my = this.beta * m_y + (1 - this.beta) * gy * gy;
      
      const m_hat_x = n_vx / (1 - Math.pow(this.momentum, nt));
      const m_hat_y = n_vy / (1 - Math.pow(this.momentum, nt));
      const v_hat_x = n_mx / (1 - Math.pow(this.beta, nt));
      const v_hat_y = n_my / (1 - Math.pow(this.beta, nt));

      nx = x - (this.lr / (Math.sqrt(v_hat_x) + this.epsilon)) * m_hat_x;
      ny = y - (this.lr / (Math.sqrt(v_hat_y) + this.epsilon)) * m_hat_y;
    }

    const nz = this.surface.f(nx, ny);
    
    this.state = {
      t: nt,
      x: nx,
      y: ny,
      z: nz,
      v_x: n_vx, v_y: n_vy,
      m_x: n_mx, m_y: n_my,
      history: [...this.state.history, { x: nx, y: ny, z: nz }]
    };

    return this.state;
  }
}
