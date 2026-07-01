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
    question: 'When initializing the AIProjectClient in the Azure AI Projects SDK, which class from the azure.identity package is commonly instantiated to handle authentication silently using environment credentials?',
    scenario: 'You are writing a Python script using the Microsoft Azure AI Projects SDK to manage agents. Before initializing the client, you must configure authentication.',
    correctAnswerText: 'DefaultAzureCredential',
    explanation: 'The azure.identity package provides DefaultAzureCredential, which supports Managed Identity, Developer CLI, and environment variables to handle credentials silently without hardcoded secrets.'
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
    question: 'Based on the Azure AI Projects SDK usage below, what exception is raised if you attempt to create a run with a non-existent assistant (agent) ID?',
    codeSnippet: 'from azure.core.exceptions import HttpResponseError\ntry:\n    run = project_client.agents.runs.create(thread_id="thread_123", assistant_id="deleted-agent-id")\nexcept HttpResponseError as e:\n    print(f"Error: {e.status_code}")',
    scenario: 'You are orchestrating an agent run. The target agent with ID "deleted-agent-id" was recently deleted by another pipeline.',
    options: [
      'The client will silently create a new agent with that ID.',
      'It raises an HttpResponseError which is caught by the try-except block.',
      'The code enters an infinite retry loop.',
      'It returns a null response instead of throwing an error.'
    ],
    correctAnswer: 1,
    explanation: 'According to the Azure AI Projects SDK, standard API calls to Azure services raise HttpResponseError from the azure.core.exceptions module when they encounter HTTP failures (such as a 404 for a non-existent resource ID).'
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
  },
  {
    id: 6,
    topic: 'FastAPI & Serving',
    difficulty: 'medium',
    type: 'mcq',
    question: 'When serving a machine learning model via FastAPI, where is the most efficient place to load the serialized model (e.g., joblib.load)?',
    options: [
      'Inside the @app.post route handler so it loads fresh on every request.',
      'At the global module scope before the FastAPI app is initialized.',
      'Inside a background task after the response is returned.',
      'Models cannot be loaded into FastAPI; you must use a separate database.'
    ],
    correctAnswer: 1,
    explanation: 'Loading the model at module startup executes exactly once. Loading it inside the route handler adds massive I/O latency to every single prediction request.'
  },
  {
    id: 7,
    topic: 'Streamlit Web Apps',
    difficulty: 'easy',
    type: 'mcq',
    question: 'What happens to standard Python variables (e.g., count = 0) in a Streamlit app when a user clicks a button?',
    options: [
      'They retain their current value automatically.',
      'They are saved to the browser\'s local storage.',
      'Streamlit reruns the entire script from top to bottom, resetting them to their initial state unless st.session_state is used.',
      'The button click only updates the specific HTML element and does not affect Python variables.'
    ],
    correctAnswer: 2,
    explanation: 'Streamlit\'s execution model reruns the entire script on any interaction. To persist data across reruns, developers must use the st.session_state dictionary.'
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
  },
  {
    id: 4,
    topic: 'Docker & CI/CD',
    question: 'Why is it recommended to copy requirements.txt and run pip install BEFORE copying the rest of your application source code into a Dockerfile?',
    answer: 'Docker caches image layers. By installing dependencies first, you leverage the cache and avoid re-downloading/re-installing all pip packages every time you make a minor change to your application code.'
  },
  {
    id: 5,
    topic: 'Probability & Statistics',
    question: 'What does the Central Limit Theorem (CLT) state?',
    answer: 'It states that the sampling distribution of the sample mean will approach a normal distribution as the sample size increases, regardless of the underlying population distribution.'
  }
];
