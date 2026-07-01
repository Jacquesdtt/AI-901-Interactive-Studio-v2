import { TopicDef, MisconceptionDef } from '../components/layouts/TheoryBlock';

export const domain6Summary = "DevOps, APIs & Containerisation. Designing pipelines, creating HTTP APIs with FastAPI, and packaging infrastructure using Docker & Kubernetes.";

export const domain6Topics: TopicDef[] = [
  {
    name: "DevOps & CI/CD",
    desc: "History, core principles, and Azure Pipelines.",
    detail: "Writing Azure Pipelines YAML files from scratch, enforcing quality gates with branch policies (blocking merges on test failure), and handling secrets safely via pipeline variables."
  },
  {
    name: "Building APIs with FastAPI",
    desc: "Exposing models and data over HTTP.",
    detail: "Building RESTful endpoints (GET, POST, PUT, DELETE), validating incoming JSON payloads with Pydantic, and testing routes directly through FastAPI's automatic /docs UI."
  },
  {
    name: "Containerisation with Docker",
    desc: "Images, Containers, and Dockerfiles.",
    detail: "Packaging Python apps using Dockerfiles. Understanding how images are assembled from layers, and managing multi-container workflows locally using Docker Compose."
  },
  {
    name: "Kubernetes Basics",
    desc: "Production container orchestration.",
    detail: "Scaling, networking, and deploying containerised workloads robustly in the cloud."
  }
];

export const domain6KeyTerms = [
  'CI/CD', 'Azure Pipelines', 'FastAPI', 'Pydantic', 'Docker', 'Dockerfile', 'Docker Compose', 'Kubernetes'
];

export const domain6Misconceptions: MisconceptionDef[] = [
  {
    badge: 'API Endpoints',
    concept: 'A REST API can only return HTML web pages.',
    reality: 'APIs (like those built in FastAPI) typically return structured data formats like JSON, designed to be consumed by other software systems, not directly rendered by web browsers as HTML.',
    description: 'This decoupled architecture allows the same FastAPI backend to serve React web apps, mobile apps, and Python scripts identically.'
  }
];
