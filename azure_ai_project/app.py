import os
import sys
import time
from agent_client import get_project_client

def run_math_orchestrator():
    """
    Main orchestration loop using the Azure AI Foundry SDK.
    Initializes a stateful Thread, registers the Code Interpreter tool,
    and runs a simulation to solve complex arithmetic tasks.
    """
    print("[INFO] Bootstrapping Math Orchestrator Agent...")
    project_client = get_project_client()
    
    model_name = os.environ.get("MODEL_DEPLOYMENT_NAME", "gpt-4o-mini")
    
    try:
        # 1. Register a secure Math Assistant Agent with Code Interpreter
        print("[INFO] Registering agent with Azure AI Project...")
        agent = project_client.agents.create_agent(
            model=model_name,
            name="Math-Orchestrator-Agent",
            instructions="You are a skilled mathematical advisor. Leverage the Code Interpreter tool to perform calculations.",
            tools=[{"type": "code_interpreter"}]
        )
        print(f"[SUCCESS] Agent registered! ID: {agent.id}")
        
        # 2. Open a server-side stateful Thread
        print("[INFO] Initializing server-side conversation thread...")
        thread = project_client.agents.threads.create()
        print(f"[SUCCESS] Thread initialized. ID: {thread.id}")
        
        # 3. Post a message representing the user's question
        question = "Calculate the standard deviation of these values: [12, 15, 22, 18, 30, 45, 11]"
        print(f"[USER PROMPT] {question}")
        project_client.agents.messages.create(
            thread_id=thread.id,
            role="user",
            content=question
        )
        
        # 4. Trigger the run to invoke the agent's computation pipeline
        print("[INFO] Dispatching agent run...")
        run = project_client.agents.runs.create(
            thread_id=thread.id,
            assistant_id=agent.id
        )
        
        # 5. Poll the stateful run queue
        print("[INFO] Polling run status queue...")
        while run.status in ["queued", "queued_active", "in_progress"]:
            time.sleep(1.5)
            run = project_client.agents.runs.get_run(
                thread_id=thread.id,
                run_id=run.id
            )
            print(f"[POLL] Run Status: {run.status}")
            
        if run.status == "completed":
            print("[SUCCESS] Agent execution run completed. Fetching responses...")
            # Retrieve the full message history
            messages = project_client.agents.messages.list(thread_id=thread.id)
            
            # Print messages chronologically
            for msg in reversed(messages.data):
                role_label = "Agent" if msg.role == "assistant" else "User"
                for content_block in msg.content:
                    if content_block.type == "text":
                        print(f"\n[{role_label}] {content_block.text.value}")
        else:
            print(f"[FATAL] Run execution failed with status: {run.status}", file=sys.stderr)
            if hasattr(run, 'last_error') and run.last_error:
                print(f"[ERROR DETAILS] {run.last_error.message}", file=sys.stderr)
                
    except Exception as e:
        print(f"[FATAL] Connection error or API failure: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    run_math_orchestrator()
    print("\n[INFO] Agent pipeline run sequence finished.")
