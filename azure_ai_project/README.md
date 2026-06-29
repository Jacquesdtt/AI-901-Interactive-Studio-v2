# Azure AI Foundry Agent - AI-901 Companion Project

This directory contains the real-world Python implementation of the **Azure AI Foundry Agents** pipeline modeled in the interactive visualizer. It provides students and cloud developers with a template that adheres to the security and operational requirements of the Microsoft AI-901 examination syllabus.

## Core Project Architecture

The codebase is split into two modular parts:
1. **`agent_client.py`**: Handles passwordless authentication and connection setup using the Azure Identity SDK's `DefaultAzureCredential` flow, ensuring zero-trust compliance.
2. **`app.py`**: Executes the mathematical orchestration flow, starting persistent client threads, registering sandbox code-interpreter containers, and polling response queues.

---

## Local Setup & Execution Guide

### 1. Prerequisites
- Python 3.10 or higher installed.
- An active Azure subscription with an AI Search and AI Project deployment configured in Azure AI Foundry.

### 2. Install Dependencies
Initialize a virtual environment and install the required official Azure SDK packages:
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### 3. Configure Environmental Variables
Copy the `.env.example` structure to a local `.env` file:
```bash
cp .env.example .env
```
Fill in your Azure Connection String inside `.env`:
```env
AZURE_AI_CONN_STR="<region>.api.azure.com;<subscription_id>;<resource_group_name>;<project_name>"
MODEL_DEPLOYMENT_NAME="gpt-4o-mini"
```

### 4. Run the Script
Verify authentication and launch the agent pipeline:
```bash
# Test project client connectivity
python agent_client.py

# Launch stateful conversation orchestration
python app.py
```

---

## AI-901 Curriculum Study Focus Areas

- **Passwordless Auth (`DefaultAzureCredential`)**: Theoretical questions frequently ask how to secure AI endpoints. Traditional API keys are prone to leakage; `DefaultAzureCredential` is the recommended method to delegate server-to-server authorization under Entra ID.
- **Stateful Conversation Threads**: Standard completions are stateless. Azure AI threads are stateful cloud resources, meaning history is cached on the server, significantly reducing bandwidth and request latency.
- **Dynamic Code Sandboxes**: When executing user scripts, Azure launches isolated, ephemeral multi-tenant containers on-demand to run Python calculations safely and prevent injection attacks from accessing host system memories.
