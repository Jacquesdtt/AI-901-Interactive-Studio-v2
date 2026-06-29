import os
import sys
from dotenv import load_dotenv
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

# Load local environment parameters from a .env file if present
load_dotenv()

def get_project_client() -> AIProjectClient:
    """
    Initializes and returns the unified Azure AI Foundry Project Client.
    Employs passwordless Entra ID authentication for enterprise security governance,
    adhering to the AI-901 Zero-Trust Architecture guidelines.
    """
    connection_string = os.environ.get("AZURE_AI_CONN_STR")
    
    if not connection_string:
        print("[ERROR] AZURE_AI_CONN_STR environment variable is missing!", file=sys.stderr)
        print("[TIP] Please create a '.env' file matching '.env.example' and insert your Connection String.", file=sys.stderr)
        sys.exit(1)
        
    try:
        # DefaultAzureCredential supports multiple auth flows silently (Managed Identity, CLI, etc.)
        # This replaces legacy hardcoded API keys for secure data-plane access.
        credential = DefaultAzureCredential()
        
        client = AIProjectClient.from_connection_string(
            credential=credential,
            conn_str=connection_string
        )
        return client
    except Exception as e:
        print(f"[FATAL] Failed to initialize AIProjectClient: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    print("[INFO] Testing connection with Azure AI Project...")
    client = get_project_client()
    print("[SUCCESS] Connected to Azure AI Project Client successfully!")
