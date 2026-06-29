import React from 'react';
import DomainLayout from '../layouts/DomainLayout';
import { TheoryBlock } from '../layouts/TheoryBlock';
import MachineLearningTab from '../visualizers/MachineLearningTab';
import { Layers } from 'lucide-react';

const topics = [
  {
    name: "Supervised Learning",
    desc: "Training with labeled historical data.",
    detail: "Includes Regression (predicting numbers, e.g., real estate value) and Classification (predicting classes, e.g., spam vs ham email)."
  },
  {
    name: "Unsupervised Learning",
    desc: "Training with unlabeled raw data to find hidden structures.",
    detail: "Includes Clustering algorithms (e.g., K-Means) which group similar items together without pre-existing human tags (e.g., customer segmentation)."
  },
  {
    name: "Feature Engineering",
    desc: "Selecting and modifying input columns.",
    detail: "Selecting, cleaning, and transforming data attributes to boost model performance during the training phase."
  }
];

const keyTerms = ['Regression', 'Classification', 'Clustering', 'Labels', 'Features', 'Validation Set'];

export default function Domain2() {
  const theory = (
    <TheoryBlock 
      summary="Core terminology of predictive modeling: regression (continuous values), classification (categorical), clustering (grouping), supervised and unsupervised paradigms."
      topics={topics}
      keyTerms={keyTerms}
    />
  );

  return (
    <DomainLayout 
      title="Domain 2: Machine Learning Principles"
      badge="30-35% of exam"
      icon={<Layers className="w-6 h-6" />}
      theoryContent={theory}
      interactiveContent={<MachineLearningTab />}
    />
  );
}
