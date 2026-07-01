import { TopicDef, MisconceptionDef } from '../components/layouts/TheoryBlock';

export const domain7Summary = "MLOps & Model Serving. Connecting trained models into production systems using MLFlow, Docker, and Azure Container Instances.";

export const domain7Topics: TopicDef[] = [
  {
    name: "MLFlow Fundamentals",
    desc: "Tracking experiments and managing models.",
    detail: "Using MLFlow for Local Tracking, maintaining the Model Registry, and deploying tracked models. Ensures reproducibility across ML experiments."
  },
  {
    name: "Serving Models with FastAPI",
    desc: "Inference architecture in production.",
    detail: "Loading a serialized model (via joblib) at module startup—not inside the endpoint handler—to avoid latency. Mapping HTTP requests to prediction outputs."
  },
  {
    name: "Deploying to Azure (ACI)",
    desc: "Pushing images to ACR and running on ACI.",
    detail: "Tagging a Docker image, authenticating to Azure Container Registry (ACR), and provisioning an Azure Container Instance (ACI) via az cli to expose the model securely to the internet."
  }
];

export const domain7KeyTerms = [
  'MLFlow', 'Model Registry', 'joblib', 'Inference', 'ACR', 'Azure Container Instance'
];

export const domain7Misconceptions: MisconceptionDef[] = [
  {
    badge: 'Model Serving',
    concept: 'The model file should be re-loaded from disk inside the FastAPI route function on every request.',
    reality: 'The model (e.g., joblib.load) should be executed exactly once at module startup/global scope.',
    description: 'Loading the model on every single HTTP POST request adds massive latency and disk I/O overhead to every caller.'
  }
];
