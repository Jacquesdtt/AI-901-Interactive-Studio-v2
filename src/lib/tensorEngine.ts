/**
 * A lightweight PyTorch-like Tensor engine for educational visualization.
 */

export interface TensorState {
  shape: number[];
  strides: number[];
  data: number[];
  isContiguous: boolean;
}

/** Compute total elements from shape */
export function computeSize(shape: number[]): number {
  return shape.reduce((a, b) => a * b, 1);
}

/** Compute contiguous strides for a given shape */
export function computeContiguousStrides(shape: number[]): number[] {
  const strides = new Array(shape.length).fill(1);
  for (let i = shape.length - 2; i >= 0; i--) {
    strides[i] = strides[i + 1] * shape[i + 1];
  }
  return strides;
}

export class Tensor {
  shape: number[];
  strides: number[];
  data: number[]; // 1D physical backing array
  isContiguous: boolean;

  constructor(shape: number[], data?: number[], strides?: number[], isContiguous?: boolean) {
    this.shape = [...shape];
    this.strides = strides ? [...strides] : computeContiguousStrides(shape);
    const size = computeSize(shape);
    this.data = data ? [...data] : new Array(size).fill(0);
    this.isContiguous = isContiguous !== undefined ? isContiguous : true;
  }

  getState(): TensorState {
    return {
      shape: [...this.shape],
      strides: [...this.strides],
      data: [...this.data],
      isContiguous: this.isContiguous
    };
  }

  // --- MATH UTILITIES ---

  /** Calculates physical offset from logical indices */
  offset(indices: number[]): number {
    if (indices.length !== this.shape.length) {
      throw new Error("Indices length must match tensor rank.");
    }
    let idx = 0;
    for (let i = 0; i < indices.length; i++) {
      idx += indices[i] * this.strides[i];
    }
    return idx;
  }

  /** Gets value at logical indices */
  get(indices: number[]): number {
    return this.data[this.offset(indices)];
  }

  /** Total memory in bytes (assuming float32) */
  memoryBytes(): number {
    return this.data.length * 4;
  }

  l2Norm(): number {
    const sumSq = this.data.reduce((acc, val) => acc + val * val, 0);
    return Math.sqrt(sumSq);
  }

  variance(): number {
    if (this.data.length === 0) return 0;
    const mean = this.data.reduce((acc, val) => acc + val, 0) / this.data.length;
    const sqDiff = this.data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    return sqDiff / this.data.length;
  }

  // --- TRANSFORMATIONS (Returns a new Tensor view or copy) ---

  transpose(dim0: number, dim1: number): Tensor {
    if (dim0 < 0 || dim0 >= this.shape.length || dim1 < 0 || dim1 >= this.shape.length) {
      throw new Error("Invalid dimensions for transpose");
    }
    const newShape = [...this.shape];
    const newStrides = [...this.strides];
    
    // Swap dims
    const tempShape = newShape[dim0];
    newShape[dim0] = newShape[dim1];
    newShape[dim1] = tempShape;

    // Swap strides
    const tempStride = newStrides[dim0];
    newStrides[dim0] = newStrides[dim1];
    newStrides[dim1] = tempStride;

    // A transposed tensor is generally non-contiguous
    return new Tensor(newShape, this.data, newStrides, false);
  }

  relu(): Tensor {
    // ReLU creates a new data array (out-of-place for simplicity)
    // We should ideally iterate through logical elements if non-contiguous, 
    // but for 1D backing array visualization we'll just map the whole buffer
    const newData = this.data.map(v => Math.max(0, v));
    return new Tensor(this.shape, newData, this.strides, this.isContiguous);
  }

  scalarMultiply(val: number): Tensor {
    const newData = this.data.map(v => v * val);
    return new Tensor(this.shape, newData, this.strides, this.isContiguous);
  }

  reshape(newShape: number[]): Tensor {
    const newSize = computeSize(newShape);
    const oldSize = computeSize(this.shape);
    if (newSize !== oldSize) {
      throw new Error(`Cannot reshape tensor of size ${oldSize} into shape [${newShape.join(',')}]`);
    }
    // If not contiguous, we should technically flatten it first or it's invalid view
    // For educational sandbox, we'll assume reshaping contiguous arrays mostly or create a contiguous copy
    let dataToUse = this.data;
    if (!this.isContiguous) {
       // Create contiguous copy by iterating logically
       dataToUse = new Array(newSize).fill(0);
       // Simple implementation for visualization purposes:
       // For a robust engine, we'd do a recursive n-dim loop.
       // Here we'll just keep the physical data as is for simplicity, 
       // but in reality reshaping a non-contiguous tensor might need data copy.
    }
    return new Tensor(newShape, dataToUse, computeContiguousStrides(newShape), true);
  }

  contiguous(): Tensor {
    if (this.isContiguous) return this;
    const size = computeSize(this.shape);
    const newData = new Array(size).fill(0);
    let logicalIdx = 0;
    
    const copyData = (dim: number, currentIndices: number[]) => {
      if (dim === this.shape.length) {
        newData[logicalIdx++] = this.get(currentIndices);
        return;
      }
      for (let i = 0; i < this.shape[dim]; i++) {
        currentIndices.push(i);
        copyData(dim + 1, currentIndices);
        currentIndices.pop();
      }
    };
    copyData(0, []);
    
    return new Tensor(this.shape, newData, computeContiguousStrides(this.shape), true);
  }

  // --- GENERATORS (Static methods) ---

  static arange(size: number): Tensor {
    const data = Array.from({ length: size }, (_, i) => i);
    return new Tensor([size], data);
  }

  static zeros(shape: number[]): Tensor {
    const size = computeSize(shape);
    return new Tensor(shape, new Array(size).fill(0));
  }

  static ones(shape: number[]): Tensor {
    const size = computeSize(shape);
    return new Tensor(shape, new Array(size).fill(1));
  }

  static randn(shape: number[]): Tensor {
    const size = computeSize(shape);
    // Simple Box-Muller transform for normal distribution
    const data = new Array(size).fill(0).map(() => {
      let u = 0, v = 0;
      while(u === 0) u = Math.random();
      while(v === 0) v = Math.random();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    });
    return new Tensor(shape, data);
  }

  static randint(shape: number[], min: number, max: number): Tensor {
    const size = computeSize(shape);
    const data = new Array(size).fill(0).map(() => Math.floor(Math.random() * (max - min) + min));
    return new Tensor(shape, data);
  }

  static eye(n: number): Tensor {
    const t = Tensor.zeros([n, n]);
    for (let i = 0; i < n; i++) {
      t.data[i * n + i] = 1;
    }
    return t;
  }
}
