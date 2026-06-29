export const examQuestions = [
  {
    id: 1,
    topic: 'Containerisation',
    question: 'What is the primary difference between a Docker Image and a Docker Container?',
    options: [
      'An image is a running instance, while a container is a read-only template.',
      'An image is a read-only template with instructions, while a container is a runnable instance of an image.',
      'A container runs on Linux only, while an image runs on Windows.',
      'There is no difference; they are synonymous.'
    ],
    correctAnswer: 1,
    explanation: 'According to official Docker documentation, an image is a read-only template with instructions for creating a Docker container, whereas a container is a runnable instance of an image.'
  },
  {
    id: 2,
    topic: 'Deep Learning',
    question: 'In PyTorch, what happens when you call `loss.backward()`?',
    options: [
      'It updates the weights of the neural network using the optimizer.',
      'It clears the gradients of all optimized `torch.Tensor`s.',
      'It computes the gradient of current tensor w.r.t. graph leaves (backpropagation).',
      'It performs a forward pass through the network.'
    ],
    correctAnswer: 2,
    explanation: 'According to PyTorch official docs, `Tensor.backward()` computes the gradient of current tensor w.r.t. graph leaves. The optimizer step (`optimizer.step()`) is what actually updates the weights.'
  },
  {
    id: 3,
    topic: 'MLOps',
    question: 'What is the primary purpose of MLflow Tracking?',
    options: [
      'To host machine learning models as REST APIs.',
      'To version control training data sets.',
      'To log parameters, code versions, metrics, and output files when running machine learning code.',
      'To automatically hyperparameter tune any Scikit-Learn model.'
    ],
    correctAnswer: 2,
    explanation: 'Official MLflow documentation states MLflow Tracking is an API and UI for logging parameters, code versions, metrics, and output files when running your machine learning code.'
  }
];

export const activeRecallCards = [
  {
    id: 1,
    topic: 'DevOps & APIs',
    question: 'What is the difference between POST and PUT in REST?',
    answer: 'POST is generally used to create a new resource, while PUT is used to replace/update an existing resource entirely. PUT is idempotent, meaning calling it multiple times has the same effect as calling it once.'
  },
  {
    id: 2,
    topic: 'Deep Learning',
    question: 'Explain the Vanishing Gradient problem.',
    answer: 'During backpropagation, gradients are calculated by the chain rule. If derivatives are smaller than 1, multiplying them across many layers causes the gradient to shrink exponentially, making early layers train very slowly. Solved by ReLU and ResNets.'
  },
  {
    id: 3,
    topic: 'GenAI',
    question: 'What is RAG (Retrieval-Augmented Generation)?',
    answer: 'A technique that grounds LLM outputs by first retrieving relevant factual documents from an external knowledge base (like a vector database), and then passing them to the LLM to generate a grounded answer.'
  }
];
