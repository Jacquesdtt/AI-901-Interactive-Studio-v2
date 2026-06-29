import React from 'react';
import DomainLayout from '../layouts/DomainLayout';
import { TheoryBlock } from '../layouts/TheoryBlock';
import PyTorchInspector from '../visualizers/PyTorchInspector';
import { Network } from 'lucide-react';

const topics = [
  {
    name: "Image Classification",
    desc: "Determining what main item is in an image.",
    detail: "Outputs a single tag or category for the entire image (e.g., 'This is a dog')."
  },
  {
    name: "Object Detection",
    desc: "Locating and categorizing multiple items in an image.",
    detail: "Identifies the classification label AND outputs pixel coordinates (bounding boxes) for each item found."
  },
  {
    name: "Semantic Segmentation",
    desc: "Classifying individual pixels in an image.",
    detail: "Color-codes pixels to represent separate object masks (e.g., separating road, sky, and sidewalk pixels in autonomous driving feeds)."
  },
  {
    name: "OCR & Read API",
    desc: "Optical Character Recognition.",
    detail: "Extracts handwritten and typed text from papers, PDFs, billboards, or photos into clean string structures."
  },
  {
    name: "Keyphrase Extraction & NER",
    desc: "Identifying main points and entities in text.",
    detail: "Finds the core concepts (Keyphrase Extraction) and categorizes nouns into predefined structures like Person or Organization (NER)."
  },
  {
    name: "Sentiment Analysis",
    desc: "Gauging the emotional tone of text input.",
    detail: "Returns score probabilities ranging from 0.0 (highly negative) to 1.0 (highly positive) to assess user feedback."
  }
];

const keyTerms = ['Object Detection', 'Bounding Box', 'OCR', 'Segmentation', 'NER', 'Sentiment Score', 'CNNs', 'Tensors'];

export default function Domain3() {
  const theory = (
    <TheoryBlock 
      summary="Focuses on visual cognitive capabilities and natural language processing, backed by Deep Learning neural networks (like CNNs and Transformers) handling complex unstructured data."
      topics={topics}
      keyTerms={keyTerms}
    />
  );

  return (
    <DomainLayout 
      title="Domain 3: Deep Learning (Vision/NLP)"
      badge="30-40% of exam"
      icon={<Network className="w-6 h-6" />}
      theoryContent={theory}
      interactiveContent={<PyTorchInspector />}
    />
  );
}
