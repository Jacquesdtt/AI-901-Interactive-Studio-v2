import React from 'react';
import DomainLayout from '../layouts/DomainLayout';
import { TheoryBlock } from '../layouts/TheoryBlock';
import { InteractiveSwitcher } from '../layouts/InteractiveSwitcher';
import NetworkArchitecture from '../visualizers/NetworkArchitecture';
import ContainerisationTab from '../visualizers/ContainerisationTab';
import { Box } from 'lucide-react';

const topics = [
  {
    name: "TCP Sockets & HTTP Protocols",
    desc: "The backbone of microservice communication.",
    detail: "Understanding the 3-Way Handshake (SYN, SYN-ACK, ACK) and RESTful principles (GET, POST, PUT, DELETE) required for deploying APIs like FastAPI."
  },
  {
    name: "Container Images vs Containers",
    desc: "Static blueprints vs dynamic runtime instances.",
    detail: "A Docker Image is an immutable, read-only template built from a Dockerfile. A Container is a running instance of that image with an ephemeral Read/Write layer."
  },
  {
    name: "Container Orchestration",
    desc: "Managing multiple containers in production.",
    detail: "Using tools like Docker Compose (multi-container local testing) and Kubernetes/Azure Container Apps to manage scaling, networking, and deployment."
  }
];

const keyTerms = ['Sockets', 'TCP/IP', 'HTTP', 'Dockerfile', 'Images', 'Containers', 'Volumes', 'FastAPI'];

export default function Domain6() {
  const theory = (
    <TheoryBlock 
      summary="Explore the infrastructure required to host AI applications. Includes networking fundamentals (TCP/HTTP) and containerization paradigms using Docker."
      topics={topics}
      keyTerms={keyTerms}
    />
  );

  const interactive = (
    <InteractiveSwitcher 
      tabs={[
        { id: 'network', label: 'TCP Handshake', component: <NetworkArchitecture /> },
        { id: 'docker', label: 'Docker Build Layers', component: <ContainerisationTab /> }
      ]}
    />
  );

  return (
    <DomainLayout 
      title="Domain 6: DevOps & Containerisation"
      badge="Deployment Infrastructure"
      icon={<Box className="w-6 h-6" />}
      theoryContent={theory}
      interactiveContent={interactive}
    />
  );
}
