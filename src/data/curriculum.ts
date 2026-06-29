import { ExamQuestion } from '../types';

export const examQuestions: ExamQuestion[] = [
  {
    id: 1,
    topic: 'Containerisation',
    difficulty: 'easy',
    type: 'mcq',
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
    topic: 'Foundry SDK',
    difficulty: 'medium',
    type: 'short-answer',
    question: 'What is the exact function name required to authenticate and initialize the Foundry tooling layer before invoking other agents or models?',
    scenario: 'You are writing a Python script using the Microsoft Foundry SDK to list available models. Before calling `foundry_models_list()`, you must ensure the session is authenticated.',
    correctAnswerText: 'foundry_check_auth',
    explanation: 'The Foundry tooling layer requires `foundry_check_auth` to be called first to ensure the workspace and telemetry environment are properly authorized before any other SDK operations.'
  },
  {
    id: 3,
    topic: 'Deep Learning',
    difficulty: 'hard',
    type: 'mcq',
    question: 'Given the code snippet, what is the purpose of `loss.backward()`?',
    codeSnippet: 'optimizer.zero_grad()\noutputs = model(inputs)\nloss = criterion(outputs, labels)\nloss.backward()\noptimizer.step()',
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
    id: 4,
    topic: 'Foundry SDK',
    difficulty: 'hard',
    type: 'mcq',
    question: 'Based on the Foundry SDK usage below, what will happen if `agent_id` does not exist?',
    codeSnippet: 'try:\n    response = foundry_agent_invoke(agent_id="data-processor-v2", payload={"data": "raw"})\nexcept FoundryError as e:\n    print(e)',
    scenario: 'You are orchestrating a multi-agent workflow. The `data-processor-v2` agent was recently deleted by another pipeline.',
    options: [
      'The function will silently create a new agent with that ID.',
      'It raises a FoundryError which is caught and printed.',
      'The code enters an infinite retry loop.',
      'It returns a null response instead of throwing an error.'
    ],
    correctAnswer: 1,
    explanation: 'Invoking a non-existent agent via `foundry_agent_invoke` raises a specific SDK error (`FoundryError` or similar standard exception), which in this snippet is caught by the try-except block.'
  },
  {
    id: 5,
    topic: 'MLOps',
    difficulty: 'medium',
    type: 'short-answer',
    question: 'Which MLflow command line instruction starts the tracking server bound to all network interfaces on port 5000?',
    scenario: 'You are deploying an MLflow tracking server inside a Docker container. You need it to be accessible from outside the container.',
    correctAnswerText: 'mlflow server --host 0.0.0.0 --port 5000',
    explanation: 'To expose the MLflow server outside of localhost (especially in Docker), you must bind to all interfaces using `--host 0.0.0.0`.'
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
