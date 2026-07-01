import { ExecutionStep } from '../types';

export const STEPS_DATA: ExecutionStep[] = [
  {
    id: 1,
    title: "1. Environment Load (.env)",
    file: ".env",
    description: "Loads the primary configuration variables, including your Azure Project Connection String, Azure OpenAI model deployment targets, and data-plane endpoint versions.",
    analogy: "Packing your physical passport, travel ticket, and map before heading to the airport.",
    examTip: "MS AI-901 focuses heavily on data security and identity. Connection strings should always be treated as sensitive secrets. In production, instead of storing credentials inside the client environment directly, we leverage Azure Entra ID and Managed Identities.",
    payload: {
      url: "local://process.env",
      method: "GET",
      headers: {
        "Host": "localhost",
        "Environment": "Python-3.11",
        "Config-Library": "python-dotenv"
      },
      body: JSON.stringify({
        AZURE_AI_CONN_STR: "eastus2.api.azure.com;00000000-0000-0000-0000-000000000000;rg-ai901;proj-foundry",
        MODEL_DEPLOYMENT_NAME: "gpt-4o-mini",
        AZURE_OPENAI_API_VERSION: "2024-12-01-preview"
      }, null, 2)
    },
    logs: [
      "[INFO] Bootstrapping client environment...",
      "[INFO] Loading variables from root .env file...",
      "[SUCCESS] Found 'AZURE_AI_CONN_STR' (Connection String).",
      "[SUCCESS] Found 'MODEL_DEPLOYMENT_NAME' => 'gpt-4o-mini'.",
      "[INFO] Client config verified successfully."
    ],
    codeSnippet: `# .env - Local Project Configuration File
# Format: <region>.<domain>;<subscription_id>;<resource_group>;<project_name>
AZURE_AI_CONN_STR="eastus2.api.azure.com;00000000-0000-0000-0000-000000000000;rg-ai901;proj-foundry"
MODEL_DEPLOYMENT_NAME="gpt-4o-mini"
AZURE_OPENAI_API_VERSION="2024-12-01-preview"
`,
    highlightLines: [1, 2, 3, 4]
  },
  {
    id: 2,
    title: "2. Client Authentication (Entra ID)",
    file: "agent_client.py",
    description: "Authenticates your script client with the Azure AI services. By instantiating DefaultAzureCredential, the applet requests secure credentials via Entra ID (Azure Active Directory).",
    analogy: "Presenting your passport at the secure terminal gate to receive a verified, tamper-proof boarding pass.",
    examTip: "Azure Entra ID is Microsoft's unified identity and access management system. Under AI-901 governance, securing models using role-based access control (RBAC) ensures least-privilege security and protects data-plane telemetry.",
    payload: {
      url: "https://login.microsoftonline.com/oauth2/v2.0/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Azure-Identity-Python-SDK"
      },
      body: "grant_type=client_credentials\n&client_id=entra-app-sp-id\n&scope=https://cognitiveservices.azure.com/.default\n&client_secret=••••••••"
    },
    logs: [
      "[INFO] Instantiating DefaultAzureCredential framework...",
      "[INFO] Attempting silent authentication via Managed Identity...",
      "[INFO] Requesting token from OAuth provider 'login.microsoftonline.com'...",
      "[SECURE] Received Azure AD Bearer Token. Token length: 1240 bytes.",
      "[SUCCESS] AIProjectClient successfully initialized with secure credentials."
    ],
    codeSnippet: `import os
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

# 1. Fetch connection properties from environment
connection_string = os.environ["AZURE_AI_CONN_STR"]

# 2. Instantiate passwordless Azure Active Directory credential flow
credential = DefaultAzureCredential()

# 3. Build the primary data-plane project client
project_client = AIProjectClient.from_connection_string(
    credential=credential,
    conn_str=connection_string
)
print("Auth Success: Connected to AI Project!")`,
    highlightLines: [6, 9, 12]
  },
  {
    id: 3,
    title: "3. Create/Fetch Agent (Register Tool)",
    file: "agent_client.py",
    description: "Creates an sovereign Agent within the project. The client specifies the core persona (instructions), target LLM, and registers tools like the Python Sandbox Code Interpreter.",
    analogy: "Hiring a specialized math tutor, equipping them with a rules booklet, and handing them a calculator.",
    examTip: "Azure AI Foundry Agents allow model-agnostic tooling. A core AI-901 topic is identifying key AI workloads: here, the Code Interpreter tool runs untrusted, dynamic python computations within a secured, multi-tenant virtual sandbox.",
    payload: {
      url: "https://eastus2.api.azure.com/projects/agents",
      method: "POST",
      headers: {
        "Authorization": "Bearer eyJ0...",
        "Content-Type": "application/json",
        "x-ms-client-request-id": "req-901-003"
      },
      body: JSON.stringify({
        name: "Math-Orchestrator-Agent",
        instructions: "You are an AI-901 assistant. Solve complex calculations using the code interpreter.",
        model: "gpt-4o-mini",
        tools: [{ type: "code_interpreter" }]
      }, null, 2)
    },
    logs: [
      "[INFO] Sending Agent registration request to Azure AI Foundry gateway...",
      "[INFO] Assigning agent parameters: Model='gpt-4o-mini', Name='Math-Orchestrator-Agent'...",
      "[INFO] Attaching Tool capability: 'code_interpreter' sandbox...",
      "[SUCCESS] Agent successfully registered. Assigned ID: agt_01f92ba3."
    ],
    codeSnippet: `# 4. Create an Agent in the AI Foundry Project
agent = project_client.agents.create_agent(
    model=os.environ["MODEL_DEPLOYMENT_NAME"],
    name="Math-Orchestrator-Agent",
    instructions="You are an AI-901 assistant. Solve complex calculations using the code interpreter.",
    tools=[{"type": "code_interpreter"}]
)

print(f"Agent successfully created. ID: {agent.id}")`,
    highlightLines: [2, 3, 4, 5, 6]
  },
  {
    id: 4,
    title: "4. Initialize Conversation Thread",
    file: "app.py",
    description: "Initializes a conversation session (Thread) on the server. Threads maintain context history automatically so the client doesn't need to post historical prompts with each turn.",
    analogy: "Opening a new, blank notepad and writing a dedicated file number for a new client's file.",
    examTip: "AI systems can be stateless or stateful. Traditional LLM API completions are stateless (the client must send the entire history). Azure AI Agent Threads are stateful resources managed entirely by the server, boosting speed and lowering bandwidth.",
    payload: {
      url: "https://eastus2.api.azure.com/projects/threads",
      method: "POST",
      headers: {
        "Authorization": "Bearer eyJ0...",
        "Content-Type": "application/json"
      },
      body: "{}"
    },
    logs: [
      "[INFO] Requesting a new stateful conversation thread from Azure...",
      "[INFO] Initiating empty storage slot in Azure Cosmos backend...",
      "[SUCCESS] Thread successfully initialized on the cloud. ID: thread_ch901a"
    ],
    codeSnippet: `import os
from agent_client import project_client

# 5. Initialize a persistent stateful thread on the server side
thread = project_client.agents.threads.create()

print(f"Stateful Session Started! Thread ID: {thread.id}")`,
    highlightLines: [4, 5]
  },
  {
    id: 5,
    title: "5. Post User Message",
    file: "app.py",
    description: "Appends the user's input prompt directly to the established cloud thread resource, setting up the context before triggering execution.",
    analogy: "Writing the user's specific problem statement on the first page of the customer notebook.",
    examTip: "In Natural Language Processing (NLP) workloads, the quality of responses depends directly on prompt engineering. Adding messages into a persistent thread preserves context like conversation history and metadata.",
    payload: {
      url: "https://eastus2.api.azure.com/projects/threads/thread_ch901a/messages",
      method: "POST",
      headers: {
        "Authorization": "Bearer eyJ0...",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        role: "user",
        content: "Verify the prime factors of 901 and write code to prove it."
      }, null, 2)
    },
    logs: [
      "[INFO] Appending user prompt to cloud thread_ch901a...",
      "[INFO] Processing prompt text parameters...",
      "[SUCCESS] Message successfully added. Role: 'user', ID: msg_usr901f"
    ],
    codeSnippet: `# 6. Append the user prompt to the persistent cloud thread
message = project_client.agents.messages.create(
    thread_id=thread.id,
    role="user",
    content="Verify the prime factors of 901 and write code to prove it."
)

print(f"Message attached to thread. Message ID: {message.id}")`,
    highlightLines: [2, 3, 4, 5, 6]
  },
  {
    id: 6,
    title: "6. Trigger Agent Run",
    file: "app.py",
    description: "Creates an active 'Run' execution job on the thread. This tells Azure's orchestration backend to evaluate the thread messages with the agent's instructions.",
    analogy: "Telling your assistant, 'Please grab the notepad from the shelf, read the query on page 1, and work out the solution now!'",
    examTip: "Runs manage the execution lifecycles of an agent. A run transitions through multiple states (queued, in_progress, requires_action, completed) and is processed asynchronously by the Azure scheduler.",
    payload: {
      url: "https://eastus2.api.azure.com/projects/threads/thread_ch901a/runs",
      method: "POST",
      headers: {
        "Authorization": "Bearer eyJ0...",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        agent_id: "agt_01f92ba3"
      }, null, 2)
    },
    logs: [
      "[INFO] Queueing execution job on thread_ch901a...",
      "[INFO] Mapping agent instructions to run context...",
      "[SUCCESS] Run created in status 'queued'. Run ID: run_r8a71b"
    ],
    codeSnippet: `# 7. Trigger the run scheduler for this thread and agent
run = project_client.agents.runs.create(
    thread_id=thread.id,
    assistant_id=agent.id
)

print(f"Run triggered successfully. Run ID: {run.id}")`,
    highlightLines: [2, 3, 4, 5]
  },
  {
    id: 7,
    title: "7. Poll Run Status & Tool Detection",
    file: "app.py",
    description: "Periodically polls the run status. While server-side tools like Code Interpreter are executed automatically within Azure's secure sandbox, any custom client-side function calls would trigger a transition to the 'requires_action' state.",
    analogy: "Knocking on the assistant's door to check progress and seeing them active. If they are running a server-side tool, they handle it automatically; if they need a client-provided tool, they request input.",
    examTip: "MS AI-901 distinguishes between Azure-managed tools (Code Interpreter, Bing Search) which run server-side without client intervention, and client-defined Custom Functions (Actions) which halt the run and transition it to 'requires_action'.",
    payload: {
      url: "https://eastus2.api.azure.com/projects/threads/thread_ch901a/runs/run_r8a71b",
      method: "POLL",
      headers: {
        "Authorization": "Bearer eyJ0..."
      },
      body: JSON.stringify({
        status: "requires_action",
        required_action: {
          type: "submit_tool_outputs",
          submit_tool_outputs: {
            tool_calls: [
              {
                id: "call_901x",
                type: "custom_function",
                custom_function: {
                  name: "check_prime_factors",
                  arguments: "{\"number\": 901}"
                }
              }
            ]
          }
        }
      }, null, 2)
    },
    logs: [
      "[INFO] Polling run status... [Attempt #1: queued]",
      "[INFO] Polling run status... [Attempt #2: in_progress]",
      "[INFO] Polling run status... [Attempt #3: requires_action]",
      "[WARN] State transition: 'requires_action' detected (Client tool requested).",
      "[INFO] LLM requested custom function execution. Tool Call ID: call_901x"
    ],
    codeSnippet: `import time

# 8. Poll the run until it completes or requests custom tool execution
while True:
    time.sleep(1.0)
    run = project_client.agents.runs.get_run(thread_id=thread.id, run_id=run.id)
    print(f"Run state: {run.status}")
    
    if run.status == "requires_action":
        print("Agent requested custom function output. Processing required actions...")
        break
    elif run.status == "completed":
        break`,
    highlightLines: [4, 5, 6, 8, 9, 10]
  },
  {
    id: 8,
    title: "8. Sandbox Execution (Code Interpreter)",
    file: "requirements.txt",
    description: "The agent's server-side Code Interpreter spawns an isolated container sandbox. It executes the python script generated by the LLM, outputting terminal text and saving artifact files.",
    analogy: "Locking the assistant inside an emergency laboratory with self-contained air, letting them mix test tubes safely without risking the main building.",
    examTip: "Responsible AI & Security: Azure AI code sandboxes protect enterprise hosts from malicious code. They operate under a zero-trust model, limiting disk access, disabling outbound network calls, and recycling after use.",
    payload: {
      url: "https://eastus2.api.azure.com/sandbox/code_interpreter/execute",
      method: "POST",
      headers: {
        "Authorization": "Bearer eyJ0...",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: "def is_prime(n):\n    if n < 2: return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0: return False\n    return True\n\nfactors = [i for i in range(1, 902) if 901 % i == 0]\nprint(f'Factors of 901: {factors}')\nprint(f'Is 17 prime? {is_prime(17)}')\nprint(f'Is 53 prime? {is_prime(53)}')",
        packages: []
      }, null, 2)
    },
    logs: [
      "[SANDBOX] Provisioning fresh, ephemeral sandbox environment...",
      "[SANDBOX] Mounting local runtime packages...",
      "[SANDBOX] Executing LLM-generated Python script...",
      "[SANDBOX_STDOUT] Factors of 901: [1, 17, 53, 901]",
      "[SANDBOX_STDOUT] Is 17 prime? True",
      "[SANDBOX_STDOUT] Is 53 prime? True",
      "[SUCCESS] Sandbox execution completed. Exit Code: 0"
    ],
    codeSnippet: `# This dynamic code is generated by the LLM and executed in the secure Sandbox:
def is_prime(n):
    if n < 2: return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0: return False
    return True

# 901 = 17 * 53 (Both are prime numbers!)
factors = [i for i in range(1, 902) if 901 % i == 0]
print(f"Factors of 901: {factors}")
print(f"Is 17 prime? {is_prime(17)}")
print(f"Is 53 prime? {is_prime(53)}")`,
    highlightLines: [2, 3, 4, 5, 6, 8, 9, 10]
  },
  {
    id: 9,
    title: "9. Submit Tool Outputs (Actions)",
    file: "agent_client.py",
    description: "Uploads the execution results of the requested client-side custom function back to the active run in Azure AI Foundry. This closes the interactive tool-call loop and resumes model processing.",
    analogy: "The assistant hands you the exact computed results of their custom inquiry, closing the request loop.",
    examTip: "In client-side function calling, the client acts as the executor. The backend is completely unaware of the custom local environment or third-party APIs unless results are submitted back using 'submit_tool_outputs'.",
    payload: {
      url: "https://eastus2.api.azure.com/projects/threads/thread_ch901a/runs/run_r8a71b/submit_tool_outputs",
      method: "POST",
      headers: {
        "Authorization": "Bearer eyJ0...",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tool_outputs: [
          {
            tool_call_id: "call_901x",
            output: "Factors of 901: [1, 17, 53, 901]\nIs 17 prime? True\nIs 53 prime? True"
          }
        ]
      }, null, 2)
    },
    logs: [
      "[INFO] Packaging terminal outputs for upload...",
      "[INFO] Sending POST request to submit outputs for Tool Call ID 'call_901x'...",
      "[SUCCESS] Cloud accepted sandbox results. Resuming run orchestration..."
    ],
    codeSnippet: `# 9. Submit the output of the sandbox execution back to the Azure Run
project_client.agents.submit_tool_outputs(
    thread_id=thread.id,
    run_id=run.id,
    tool_outputs=[{
        "tool_call_id": "call_901x",
        "output": "Factors of 901: [1, 17, 53, 901]\\nIs 17 prime? True\\nIs 53 prime? True"
    }]
)
print("Tool outputs submitted. Agent is finalising answer.")`,
    highlightLines: [2, 3, 4, 5, 6, 7]
  },
  {
    id: 10,
    title: "10. Retrieve Response Messages",
    file: "app.py",
    description: "Fetches the full message collection from the Thread after the run is complete, retrieving the final answer along with links, code blocks, and images.",
    analogy: "Taking the final report from the desk, reading the printed results, and sharing it with the client.",
    examTip: "AI-901 students must understand NLP outputs are probabilistic and non-deterministic. Azure AI Foundry packages these responses into a structured Thread messages array where the latest response sits at index 0.",
    payload: {
      url: "https://eastus2.api.azure.com/projects/threads/thread_ch901a/messages?limit=5",
      method: "GET",
      headers: {
        "Authorization": "Bearer eyJ0..."
      },
      body: JSON.stringify({
        data: [
          {
            id: "msg_ast901z",
            role: "assistant",
            content: [
              {
                type: "text",
                text: {
                  value: "I have verified the factors of 901 using the Azure python interpreter sandbox. The factors of 901 are 1, 17, 53, and 901. Since 17 and 53 are prime, 901 is the product of two prime numbers (17 * 53 = 901)."
                }
              }
            ],
            thread_id: "thread_ch901a"
          }
        ]
      }, null, 2)
    },
    logs: [
      "[INFO] Polling run status... [Attempt #4: completed]",
      "[INFO] Run completed successfully. Fetching thread messages...",
      "[SUCCESS] Found assistant response 'msg_ast901z' in thread history.",
      "[INFO] Displaying final agent response content to user.",
      "[SUCCESS] AI Agent Execution Sequence Completed! Ready for next request."
    ],
    codeSnippet: `# 10. Fetch the final list of messages from the server
messages = project_client.agents.messages.list(thread_id=thread.id)

# The messages are returned in reverse chronological order
latest_response = messages.data[0]
print(f"Agent Answer:\n{latest_response.content[0].text.value}")`,
    highlightLines: [2, 5, 6]
  },
  {
    id: 11,
    title: "11. FastAPI Server Startup",
    file: "app.py",
    description: "Initialize the FastAPI server locally. Notice how `model = joblib.load()` executes exactly once during startup, before the server begins listening for requests.",
    analogy: "A restaurant kitchen prepping all ingredients in the morning, rather than chopping carrots individually for every single order.",
    examTip: "Loading a model takes I/O and CPU time. In production, load the model at module scope, not inside the route handler, to ensure fast inference.",
    payload: {
      url: "local://uvicorn app:app --host 0.0.0.0 --port 8000",
      method: "EXECUTE",
      headers: { "Environment": "FastAPI" },
      body: "Starting Uvicorn server..."
    },
    logs: [
      "[INFO] Loading model.joblib from disk... (Time: 1.2s)",
      "[SUCCESS] Model loaded successfully into memory.",
      "[INFO] Started server process [7123]",
      "[INFO] Waiting for application startup.",
      "[INFO] Application startup complete.",
      "[INFO] Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)"
    ],
    codeSnippet: `import joblib
from fastapi import FastAPI

# Loaded exactly once at module startup!
print("Loading model.joblib from disk...")
model = joblib.load("model.joblib")

app = FastAPI()

@app.post("/predictions")
def predict(data: dict):
    # Instant prediction using in-memory model
    return {"prediction": model.predict([data["text"]])[0]}`,
    highlightLines: [5, 6, 12]
  },
  {
    id: 12,
    title: "12. Docker Build: Layer Caching",
    file: "Dockerfile",
    description: "Building the Docker image. Docker executes instructions step-by-step, caching each layer. Notice how copying requirements.txt BEFORE the rest of the app prevents reinstalling pip packages when only app.py changes.",
    analogy: "Baking a cake in stages: you can bake the sponge ahead of time (cache) and just add different icing later.",
    examTip: "To optimize build times, copy only dependency files (requirements.txt) and run `pip install` BEFORE copying source code. Source code changes frequently, but dependencies change rarely.",
    payload: {
      url: "local://docker build -t text-classifier:latest .",
      method: "EXECUTE",
      headers: { "Environment": "Docker Engine" },
      body: "Building image layers..."
    },
    logs: [
      "Step 1/5 : FROM python:3.11-slim",
      " ---> 4e4b51... (Cached)",
      "Step 2/5 : COPY requirements.txt .",
      " ---> Using cache",
      "Step 3/5 : RUN pip install -r requirements.txt",
      " ---> Using cache (Prevents downloading all packages again)",
      "Step 4/5 : COPY app.py model.joblib ./",
      " ---> f83c19... (New layer)",
      "Successfully built text-classifier:latest"
    ],
    codeSnippet: `FROM python:3.11-slim
WORKDIR /app

# Step 1: Copy ONLY dependencies to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Step 2: Copy source code (changes often)
COPY app.py model.joblib ./

CMD ["uvicorn", "app:app", "--host", "0.0.0.0"]`,
    highlightLines: [4, 5, 6]
  },
  {
    id: 13,
    title: "13. PyTorch Training Step",
    file: "train.py",
    description: "Executing one step of gradient descent in PyTorch. The optimizer zeroes out old gradients, the model makes a prediction (forward pass), loss is computed, and backpropagation calculates new gradients to update weights.",
    analogy: "A golfer taking a swing (forward), seeing how far they missed the hole (loss), figuring out how to adjust their stance (backward), and physically moving their feet (step).",
    examTip: "Failing to call `optimizer.zero_grad()` will cause gradients to accumulate across batches, completely ruining the training process.",
    payload: {
      url: "local://python train.py",
      method: "EXECUTE",
      headers: { "Environment": "PyTorch 2.0" },
      body: "Running Epoch 1, Batch 1..."
    },
    logs: [
      "[INFO] Batch 1/1000",
      "[INFO] optimizer.zero_grad() -> Cleared old gradients.",
      "[INFO] Forward Pass -> outputs = model(inputs)",
      "[INFO] Loss computed: 2.3015",
      "[INFO] loss.backward() -> Gradients computed via autograd.",
      "[INFO] optimizer.step() -> Weights updated.",
      "[SUCCESS] Batch 1 complete. Loss dropped to 2.1004"
    ],
    codeSnippet: `import torch

# Standard PyTorch Training Loop Step
for inputs, labels in dataloader:
    # 1. Clear old gradients
    optimizer.zero_grad()
    
    # 2. Forward pass (predictions)
    outputs = model(inputs)
    
    # 3. Compute error (loss)
    loss = criterion(outputs, labels)
    
    # 4. Backpropagation (compute gradients)
    loss.backward()
    
    # 5. Update weights
    optimizer.step()`,
    highlightLines: [6, 9, 12, 15, 18]
  }
];
