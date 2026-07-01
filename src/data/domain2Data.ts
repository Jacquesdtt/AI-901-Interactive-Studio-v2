import { TopicDef, MisconceptionDef } from '../components/layouts/TheoryBlock';

export const domain2Summary = "Machine Learning (ML). Covers core ML concepts, preparing tabular data, regression vs classification, supervised vs unsupervised learning, and Scikit-Learn workflows.";

export const domain2Topics: TopicDef[] = [
  {
    name: "Supervised vs Unsupervised Learning",
    desc: "Recognising learning paradigms based on labelled vs unlabelled data.",
    detail: "Supervised learning (Regression & Classification) predicts a known target variable. Unsupervised learning (Clustering & PCA) uncovers hidden structure in unlabelled data."
  },
  {
    name: "Data Preprocessing & Feature Engineering",
    desc: "Imputation, encoding, scaling, and transformers.",
    detail: "Preparing tabular data for modelling. Using Scikit-Learn pipelines and ColumnTransformers to build clean, reproducible data preparation steps."
  },
  {
    name: "Core Model Families",
    desc: "Linear models, Decision Trees, and Ensembles.",
    detail: "Linear models (regression, logistic, gradient descent), Tree-based models (CART), and Model Ensembles (Bagging, Boosting, Random Forests) combining weak learners."
  },
  {
    name: "Model Validation & Tuning",
    desc: "Cross-validation and diagnosing poor model behaviour.",
    detail: "Choosing appropriate evaluation metrics (MSE, RMSE, Accuracy, F1-score), tuning hyperparameters, and debugging underfitting vs overfitting."
  }
];

export const domain2KeyTerms = [
  'Supervised', 'Unsupervised', 'PCA', 'K-Means', 'Scikit-Learn', 'Pipelines', 'Ensembles', 'Cross-Validation'
];

export const domain2Misconceptions: MisconceptionDef[] = [
  {
    badge: 'ML Evaluation',
    concept: 'Accuracy is always the best metric for classification models.',
    reality: 'For imbalanced datasets, Accuracy can be highly misleading. Metrics like F1-Score, Precision, and Recall are more informative.',
    description: 'If a disease occurs in 1% of patients, a model predicting "healthy" 100% of the time will have 99% accuracy but 0% usefulness.'
  }
];
