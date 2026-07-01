export interface MCTSNodeData {
  id: string;
  label: string;
  desc: string;
  title: string;
  qBase: number;
  visits: number;
  parentId: string | null;
  tokens: string[];
  x: number;
  y: number;
}

export interface Scenario {
  id: string;
  name: string;
  nodes: MCTSNodeData[];
}

export const SCENARIOS: Record<string, Scenario> = {
  agi_roles: {
    id: 'agi_roles',
    name: 'Corporate AGI Roles',
    nodes: [
      { id: 'root', label: 'ROOT (S0 INITIALIZATION)', title: '"Will AGI eliminate enterprise software roles?"', desc: 'Initial prompt parsed. Action space formulated.', qBase: 0.45, visits: 2, parentId: null, tokens: ['Will', ' AGI', ' eliminate', ' roles?'], x: 400, y: 50 },
      { id: 'a1', label: 'NODE 1 (A1)', title: 'A1: Fully automated code creation shifts all engineering...', desc: 'Hypothesizes 100% displacement.', qBase: -0.85, visits: 1, parentId: 'root', tokens: ['Fully', ' automated', ' code', ' creation'], x: 150, y: 200 },
      { id: 'a2', label: 'NODE 2 (A2)', title: 'A2: Human enterprise security and proprietary data lock-in...', desc: 'Focuses on security moats preventing displacement.', qBase: 0.12, visits: 1, parentId: 'root', tokens: ['Human', ' enterprise', ' security'], x: 400, y: 200 },
      { id: 'a3', label: 'NODE 3 (A3)', title: 'A3: Fiduciary legal limits shift software roles to liability...', desc: 'Focuses on legal accountability shift.', qBase: 0.94, visits: 2, parentId: 'root', tokens: ['Fiduciary', ' legal', ' limits', ' shift'], x: 650, y: 200 },
      { id: 'b1', label: 'B3.1', title: 'Liability Cost Escalation', desc: 'Insurance premiums rise rapidly for purely automated codebases due to audit failures.', qBase: 0.5, visits: 1, parentId: 'a3', tokens: ['Insurance', ' premiums', ' rise', ' rapidly'], x: 550, y: 350 },
      { id: 'b2', label: 'B3.2', title: 'Liability Architects', desc: 'Engineers transition into Liability Architects certifying AI code.', qBase: 0.96, visits: 1, parentId: 'a3', tokens: ['Engineers', ' transition', ' into', ' Liability', ' Architects'], x: 650, y: 350 },
      { id: 'b3', label: 'B3.3', title: 'Global Ban', desc: 'AGI is globally banned in enterprise due to IP risks.', qBase: -0.68, visits: 1, parentId: 'a3', tokens: ['AGI', ' is', ' globally', ' banned'], x: 750, y: 350 },
      
      // Node 2 children
      { id: 'c1', label: 'B2.1', title: 'Narrow AI', desc: 'Specialized narrow AI replaces specific tasks only.', qBase: -0.10, visits: 1, parentId: 'a2', tokens: ['Specialized', ' narrow', ' AI'], x: 250, y: 350 },
      { id: 'c2', label: 'B2.2', title: 'Local Lock', desc: 'Local models trained on proprietary data secure jobs.', qBase: 0.28, visits: 1, parentId: 'a2', tokens: ['Local', ' models', ' trained'], x: 350, y: 350 },
      { id: 'c3', label: 'B2.3', title: 'Prop Data', desc: 'Proprietary data becomes the only valuable asset.', qBase: 0.40, visits: 1, parentId: 'a2', tokens: ['Proprietary', ' data', ' becomes'], x: 450, y: 350 },
    ]
  },
  quantum_crypto: {
    id: 'quantum_crypto',
    name: 'Quantum Crypto Security',
    nodes: [
      { id: 'root', label: 'ROOT (S0 INITIALIZATION)', title: '"How will Quantum Computing affect current RSA encryption?"', desc: 'Initial prompt parsed.', qBase: 0.5, visits: 2, parentId: null, tokens: ['How', ' will', ' Quantum', ' Computing'], x: 400, y: 50 },
      { id: 'a1', label: 'NODE 1 (A1)', title: 'A1: Immediate total collapse of global banking.', desc: 'Catastrophic immediate failure.', qBase: -0.9, visits: 1, parentId: 'root', tokens: ['Immediate', ' total', ' collapse'], x: 150, y: 200 },
      { id: 'a2', label: 'NODE 2 (A2)', title: 'A2: Shor\'s algorithm scales slowly over decades.', desc: 'Gradual transition phase.', qBase: 0.4, visits: 1, parentId: 'root', tokens: ['Shor\'s', ' algorithm', ' scales'], x: 400, y: 200 },
      { id: 'a3', label: 'NODE 3 (A3)', title: 'A3: Post-quantum cryptography adoption outpaces hardware.', desc: 'Defensive measures succeed first.', qBase: 0.85, visits: 2, parentId: 'root', tokens: ['Post-quantum', ' cryptography', ' adoption'], x: 650, y: 200 },
      { id: 'b1', label: 'B3.1', title: 'Lattice-based', desc: 'Lattice-based cryptography becomes standard.', qBase: 0.9, visits: 1, parentId: 'a3', tokens: ['Lattice-based', ' cryptography', ' becomes'], x: 550, y: 350 },
      { id: 'b2', label: 'B3.2', title: 'Hash-based', desc: 'Stateful hash-based signatures for specific uses.', qBase: 0.6, visits: 1, parentId: 'a3', tokens: ['Stateful', ' hash-based', ' signatures'], x: 650, y: 350 },
      { id: 'b3', label: 'B3.3', title: 'Isogeny-based', desc: 'Isogeny graphs offer alternative but mathematically complex.', qBase: 0.2, visits: 1, parentId: 'a3', tokens: ['Isogeny', ' graphs', ' offer'], x: 750, y: 350 },
      { id: 'c1', label: 'B2.1', title: 'Hybrid certs', desc: 'Hybrid RSA/PQC certificates deployed.', qBase: 0.7, visits: 1, parentId: 'a2', tokens: ['Hybrid', ' RSA/PQC', ' certificates'], x: 300, y: 350 },
      { id: 'c2', label: 'B2.2', title: 'Key sizes double', desc: 'RSA key sizes are just doubled temporarily.', qBase: -0.2, visits: 1, parentId: 'a2', tokens: ['RSA', ' key', ' sizes'], x: 400, y: 350 },
      { id: 'c3', label: 'B2.3', title: 'Hardware delays', desc: 'Qubit coherence issues delay threat.', qBase: 0.5, visits: 1, parentId: 'a2', tokens: ['Qubit', ' coherence', ' issues'], x: 500, y: 350 },
    ]
  },
  autonomous_driving: {
    id: 'autonomous_driving',
    name: 'Autonomous Driving',
    nodes: [
      { id: 'root', label: 'ROOT (S0 INITIALIZATION)', title: '"What is the primary barrier to Level 5 autonomy?"', desc: 'Initial prompt parsed.', qBase: 0.45, visits: 2, parentId: null, tokens: ['What', ' is', ' the', ' primary'], x: 400, y: 50 },
      { id: 'a1', label: 'NODE 1 (A1)', title: 'A1: Hardware sensor limitations (LiDAR cost).', desc: 'Hardware is the bottleneck.', qBase: -0.5, visits: 1, parentId: 'root', tokens: ['Hardware', ' sensor', ' limitations'], x: 150, y: 200 },
      { id: 'a2', label: 'NODE 2 (A2)', title: 'A2: Long-tail edge cases in real-world perception.', desc: 'Software struggles with rare events.', qBase: 0.92, visits: 2, parentId: 'root', tokens: ['Long-tail', ' edge', ' cases'], x: 400, y: 200 },
      { id: 'a3', label: 'NODE 3 (A3)', title: 'A3: Regulatory and legal liability frameworks.', desc: 'Law is the bottleneck.', qBase: 0.3, visits: 1, parentId: 'root', tokens: ['Regulatory', ' and', ' legal'], x: 650, y: 200 },
      { id: 'b1', label: 'B2.1', title: 'Simulation Gap', desc: 'Simulators cannot perfectly replicate reality.', qBase: 0.6, visits: 1, parentId: 'a2', tokens: ['Simulators', ' cannot', ' perfectly'], x: 300, y: 350 },
      { id: 'b2', label: 'B2.2', title: 'Adversarial weather', desc: 'Snow and heavy rain defeat perception systems.', qBase: 0.7, visits: 1, parentId: 'a2', tokens: ['Snow', ' and', ' heavy'], x: 400, y: 350 },
      { id: 'b3', label: 'B2.3', title: 'Pedestrian unpredictability', desc: 'Human behavior is non-deterministic.', qBase: 0.95, visits: 1, parentId: 'a2', tokens: ['Human', ' behavior', ' is'], x: 500, y: 350 },
      { id: 'c1', label: 'B3.1', title: 'State laws', desc: 'Fragmented state-by-state laws.', qBase: 0.2, visits: 1, parentId: 'a3', tokens: ['Fragmented', ' state-by-state', ' laws'], x: 550, y: 350 },
      { id: 'c2', label: 'B3.2', title: 'Insurance models', desc: 'No clear model for automated liability.', qBase: 0.4, visits: 1, parentId: 'a3', tokens: ['No', ' clear', ' model'], x: 650, y: 350 },
      { id: 'c3', label: 'B3.3', title: 'Public trust', desc: 'One crash destroys years of trust.', qBase: 0.1, visits: 1, parentId: 'a3', tokens: ['One', ' crash', ' destroys'], x: 750, y: 350 },
    ]
  }
};

export type NodeStatus = 'pending' | 'active' | 'optimal' | 'pruned' | 'suboptimal';

// Mapping a step (0-11) to the status of each node in the tree.
export const STEP_STATUS_MAP: Record<number, Record<string, NodeStatus>> = {
  0: { root: 'active' },
  1: { root: 'optimal', a1: 'active', a2: 'pending', a3: 'pending' },
  2: { root: 'optimal', a1: 'pruned', a2: 'active', a3: 'pending' },
  3: { root: 'optimal', a1: 'pruned', a2: 'suboptimal', a3: 'active' },
  4: { root: 'optimal', a1: 'pruned', a2: 'suboptimal', a3: 'optimal', b1: 'active', b2: 'pending', b3: 'pending', c1: 'pending', c2: 'pending', c3: 'pending' },
  5: { root: 'optimal', a1: 'pruned', a2: 'suboptimal', a3: 'optimal', b1: 'suboptimal', b2: 'active', b3: 'pending', c1: 'pending', c2: 'pending', c3: 'pending' },
  6: { root: 'optimal', a1: 'pruned', a2: 'suboptimal', a3: 'optimal', b1: 'suboptimal', b2: 'optimal', b3: 'active', c1: 'pending', c2: 'pending', c3: 'pending' },
  7: { root: 'optimal', a1: 'pruned', a2: 'suboptimal', a3: 'optimal', b1: 'suboptimal', b2: 'optimal', b3: 'pruned', c1: 'active', c2: 'pending', c3: 'pending' },
  8: { root: 'optimal', a1: 'pruned', a2: 'suboptimal', a3: 'optimal', b1: 'suboptimal', b2: 'optimal', b3: 'pruned', c1: 'pruned', c2: 'active', c3: 'pending' },
  9: { root: 'optimal', a1: 'pruned', a2: 'suboptimal', a3: 'optimal', b1: 'suboptimal', b2: 'optimal', b3: 'pruned', c1: 'pruned', c2: 'suboptimal', c3: 'active' },
  10: { root: 'optimal', a1: 'pruned', a2: 'suboptimal', a3: 'optimal', b1: 'suboptimal', b2: 'optimal', b3: 'pruned', c1: 'pruned', c2: 'suboptimal', c3: 'suboptimal' },
  11: { root: 'optimal', a1: 'pruned', a2: 'suboptimal', a3: 'optimal', b1: 'suboptimal', b2: 'optimal', b3: 'pruned', c1: 'pruned', c2: 'suboptimal', c3: 'suboptimal' }
};

export const STEP_ANALOGIES: Record<number, { phase: string, title: string, text: string }> = {
  0: { phase: '0. Initialization', title: 'Receiving the Order', text: 'The Head Chef (MCTS Controller) receives the ticket (prompt) and begins planning the dish.' },
  1: { phase: '1. First Expansion', title: 'Testing the First Recipe', text: 'The Sous Chef attempts Recipe A1. It tastes terrible (Q < 0).' },
  2: { phase: '2. Pruning', title: 'Throwing out the Dish', text: 'The Tasting Sauce (Process Reward Model) instantly rejects A1. The Head Chef throws it in the trash.' },
  3: { phase: '3. Second Expansion', title: 'Testing the Second Recipe', text: 'Recipe A2 is created. It tastes okay, but might not win a Michelin star.' },
  4: { phase: '4. Third Expansion', title: 'Testing the Third Recipe', text: 'Recipe A3 is created and tastes amazing. The Head Chef decides to explore variations of A3.' },
  5: { phase: '5. Deep Rollout', title: 'Refining Recipe A3', text: "Variation B1 (adding more salt) is tested. It's decent, but could be better." },
  6: { phase: '6. Deep Rollout', title: 'Finding the Secret Ingredient', text: 'Variation B2 (adding truffle oil) is tested. It is absolutely perfect (Highest Q-value).' },
  7: { phase: '7. Deep Rollout', title: 'A Failed Variation', text: 'Variation B3 (adding sugar) ruins the dish completely and is pruned.' },
  8: { phase: '8. Backtracking', title: 'Checking other options', text: 'Just in case, the Chef explores variations of Recipe A2 (C1).' },
  9: { phase: '9. Backtracking', title: 'More tests', text: 'Variation C2 is tested. Not bad, but not as good as B2.' },
  10: { phase: '10. Convergence', title: 'Final Review', text: 'All promising paths have been explored. The Chef compares the best dishes.' },
  11: { phase: '11. Global Convergence & Trajectory Lock', title: 'Locking Optimal Decision Path', text: 'With both branches thoroughly explored and weighed, the optimal path is mathematically locked for auto-regressive generation.' }
};
