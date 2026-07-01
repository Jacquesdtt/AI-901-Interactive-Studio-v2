import { TopicDef, MisconceptionDef } from '../components/layouts/TheoryBlock';

export const domain1Summary = "Foundations of Probability, Statistics, and Data Visualisation. Covers the core mathematical axioms, distributions, and python-based static/statistical visualisations necessary for data analysis.";

export const domain1Topics: TopicDef[] = [
  {
    name: "Probability & Distributions",
    desc: "Sets, conditional probability, Bayes' theorem, and distributions.",
    detail: "Discrete and continuous random variables (RVs), the normal distribution (z-scores), and joint distributions. Foundations of Probability rely heavily on understanding conditional dependence and Bayes' rule."
  },
  {
    name: "Statistical Inference & Moments",
    desc: "Mean, variance, LLN, and CLT.",
    detail: "Expectations, moments, correlation, and conditional expectations. Convergence theorems like the Law of Large Numbers (LLN) and Central Limit Theorem (CLT) underpin sampling distributions and confidence intervals."
  },
  {
    name: "Matplotlib Fundamentals",
    desc: "The cornerstone library for static visualisations in Python.",
    detail: "Basic plotting concepts, different Matplotlib interfaces, line plots, scatter plots, histograms, contour plots, and customizing subplots."
  },
  {
    name: "Seaborn Aesthetcis",
    desc: "High-level statistical data visualization built on Matplotlib.",
    detail: "Creating relational, categorical, distribution, and regression plots. Using matrix, pair, and joint plots to analyze data distributions and relationships with improved default aesthetics."
  }
];

export const domain1KeyTerms = [
  'Probability Axioms', 'Bayes Theorem', 'Random Variables', 'CLT', 'Matplotlib', 'Seaborn', 'Histograms', 'Confidence Intervals'
];

export const domain1Misconceptions: MisconceptionDef[] = [
  {
    badge: 'Stats Concept',
    concept: 'A p-value of 0.05 means there is a 5% chance the null hypothesis is true.',
    reality: 'A p-value is the probability of obtaining test results at least as extreme as the results actually observed, assuming the null hypothesis is correct.',
    description: 'P-values are about the data under the null, not the probability of the hypothesis itself.'
  }
];
