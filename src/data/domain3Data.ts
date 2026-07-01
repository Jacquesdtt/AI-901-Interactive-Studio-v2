import { TopicDef, MisconceptionDef } from '../components/layouts/TheoryBlock';

export const domain3Summary = "Deep Learning. Focuses on neural network architecture, activation functions, backpropagation, CNNs, RNNs, Transformers, and Transfer Learning using PyTorch.";

export const domain3Topics: TopicDef[] = [
  {
    name: "PyTorch Basics & Training Workflows",
    desc: "Tensors, torch.nn, and optimization.",
    detail: "Creating neural networks with stacked layers. Using torch.optim (SGD, Adam), DataLoader, Loss functions (CrossEntropy), and implementing the 'zero_grad -> forward -> loss -> backward -> step' pattern."
  },
  {
    name: "Convolutional Neural Networks (CNN)",
    desc: "Processing image data with spatial awareness.",
    detail: "Convolutions, padding, stride, and pooling. CNNs extract spatial features far better than flattened MLPs, forming the basis of computer vision tasks."
  },
  {
    name: "Recurrent Neural Networks (RNN) & LSTMs",
    desc: "Processing sequential and temporal data.",
    detail: "Maintaining hidden state across time steps. LSTMs solve the vanishing gradient problem in vanilla RNNs using input, forget, and output gates for sequences like text or time-series."
  },
  {
    name: "Transformers & Attention",
    desc: "Parallel processing for modern NLP and vision.",
    detail: "Encoder-decoder and decoder-only (GPT) architectures relying on self-attention mechanisms, largely replacing RNNs for long-context sequential tasks."
  },
  {
    name: "Transfer Learning",
    desc: "Leveraging pretrained models for new tasks.",
    detail: "Reusing weights from established models (e.g. ResNet) via torchvision. Using feature extraction (freezing layers) versus full fine-tuning."
  }
];

export const domain3KeyTerms = [
  'PyTorch', 'Backpropagation', 'CNNs', 'LSTMs', 'Transformers', 'Self-Attention', 'Transfer Learning', 'Tensors'
];

export const domain3Misconceptions: MisconceptionDef[] = [
  {
    badge: 'Architecture Selection',
    concept: 'Transformers have completely replaced LSTMs and RNNs for all tasks.',
    reality: 'Transformers dominate NLP and scale well, but RNNs/LSTMs remain practical for short sequences, limited training data, streaming contexts, and when compute is severely constrained.',
    description: 'A single LSTM has a far lower memory footprint and compute requirement than a small Transformer.'
  }
];
