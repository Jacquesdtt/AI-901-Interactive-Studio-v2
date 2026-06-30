import React, { useState } from 'react';
import { Cpu, Database, Settings2, LineChart, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function MachineLearningTab() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 'data', title: 'Data Ingestion', icon: Database, desc: 'Load CSV, handle missing values, Train/Test split.' },
    { id: 'prep', title: 'Preprocessing', icon: Settings2, desc: 'StandardScaler, One-Hot Encoding, Imputers.' },
    { id: 'train', title: 'Model Training', icon: Cpu, desc: 'Fit RandomForestRegressor on X_train, y_train.' },
    { id: 'eval', title: 'Evaluation', icon: LineChart, desc: 'Calculate MSE, R2 Score, and Confusion Matrix.' }
  ];

  return (
    <div className="flex flex-col w-full h-full p-6 lg:p-12 gap-8 overflow-y-auto">
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Cpu className="w-8 h-8 text-emerald-400" /> Machine Learning Pipeline
        </h2>
        <p className="text-slate-400">Scikit-Learn Architecture &amp; Lifecycle</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#111116] border border-white/5 rounded-2xl p-8 shadow-xl">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          const isDone = activeStep > idx;
          
          return (
            <React.Fragment key={step.id}>
              <div 
                className="flex flex-col items-center gap-4 cursor-pointer relative z-10"
                onClick={() => setActiveStep(idx)}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all border-2 ${
                  isActive ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-110' :
                  isDone ? 'bg-[#181820] border-emerald-500/50 text-emerald-500' :
                  'bg-[#181820] border-white/10 text-slate-500'
                }`}>
                  {isDone ? <CheckCircle2 className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
                </div>
                <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>{step.title}</span>
              </div>
              
              {idx < steps.length - 1 && (
                <div className="hidden md:flex flex-1 items-center justify-center relative -mt-6">
                  <div className={`h-1 w-full absolute ${isDone ? 'bg-emerald-500' : 'bg-slate-800'} transition-colors`} />
                  <ArrowRight className={`w-6 h-6 absolute z-10 ${isDone ? 'text-emerald-400' : 'text-slate-600'}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="bg-[#111116] border border-white/5 rounded-2xl p-8 shadow-xl flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <Settings2 className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-bold">{steps[activeStep].title} Step Details</h3>
        </div>
        
        <p className="text-slate-300 text-lg leading-relaxed mb-8">
          {steps[activeStep].desc}
        </p>

        <div className="mt-auto bg-[#0a0a0c] border border-white/5 p-6 rounded-xl font-mono text-sm text-slate-300">
          <div className="text-slate-500 mb-2"># Scikit-Learn Python Implementation</div>
          {activeStep === 0 && (
            <pre>
              <span className="text-slate-500"># Load pandas for data manipulation & analysis</span><br/>
              <span className="text-purple-400">import</span> pandas <span className="text-purple-400">as</span> pd<br/>
              <span className="text-slate-500"># Import utility to split data into random train and test subsets</span><br/>
              <span className="text-purple-400">from</span> sklearn.model_selection <span className="text-purple-400">import</span> train_test_split<br/><br/>
              <span className="text-slate-500"># Read the dataset from a CSV file into a DataFrame</span><br/>
              df = pd.read_csv(<span className="text-amber-300">'data.csv'</span>)<br/>
              <span className="text-slate-500"># Split features (X) and labels (y) into 80% training / 20% testing sets</span><br/>
              X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=<span className="text-rose-400">0.2</span>, random_state=<span className="text-rose-400">42</span>)
            </pre>
          )}
          {activeStep === 1 && (
            <pre>
              <span className="text-slate-500"># Import feature scaling utility to standardise features</span><br/>
              <span className="text-purple-400">from</span> sklearn.preprocessing <span className="text-purple-400">import</span> StandardScaler<br/><br/>
              <span className="text-slate-500"># Instantiate the scaler (shifts mean to 0 and scales variance to 1)</span><br/>
              scaler = StandardScaler()<br/>
              <span className="text-slate-500"># Fit on training data AND scale training data in one step</span><br/>
              X_train_scaled = scaler.fit_transform(X_train)<br/>
              <span className="text-slate-500"># Only transform test data (using parameters learned from X_train)</span><br/>
              X_test_scaled = scaler.transform(X_test) <span className="text-slate-500"># Avoid data leakage!</span>
            </pre>
          )}
          {activeStep === 2 && (
            <pre>
              <span className="text-slate-500"># Import the RandomForest ensemble model for regression tasks</span><br/>
              <span className="text-purple-400">from</span> sklearn.ensemble <span className="text-purple-400">import</span> RandomForestRegressor<br/><br/>
              <span className="text-slate-500"># Initialize the model with 100 decision trees</span><br/>
              model = RandomForestRegressor(n_estimators=<span className="text-rose-400">100</span>, random_state=<span className="text-rose-400">42</span>)<br/>
              <span className="text-slate-500"># Fit the model: train the decision trees using the scaled training data</span><br/>
              model.fit(X_train_scaled, y_train)<br/>
            </pre>
          )}
          {activeStep === 3 && (
            <pre>
              <span className="text-slate-500"># Import the metric to measure regression performance</span><br/>
              <span className="text-purple-400">from</span> sklearn.metrics <span className="text-purple-400">import</span> mean_squared_error<br/><br/>
              <span className="text-slate-500"># Generate predictions on the scaled test set</span><br/>
              preds = model.predict(X_test_scaled)<br/>
              <span className="text-slate-500"># Calculate Mean Squared Error: average squared difference between actual & predicted</span><br/>
              mse = mean_squared_error(y_test, preds)<br/>
              <span className="text-blue-400">print</span>(<span className="text-amber-300">f"MSE: {`{mse}`}"</span>)
            </pre>
          )}
        </div>

        {/* MATHEMATICAL VISUALISATION PANEL */}
        <div className="mt-6 bg-[#161620] border border-[#0078d4]/20 rounded-xl p-6">
          <h4 className="text-sm font-bold text-[#0078d4] mb-4 uppercase tracking-wider flex items-center gap-2">
            <span>Mathematical Visualisation &amp; Concrete Example</span>
          </h4>

          {activeStep === 0 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                <strong>Concept: Random Partitioning.</strong> We split a dataset D of size N into D_train and D_test such that size of D_train = (1 - p) * N and size of D_test = p * N where p is the test ratio (here p = 0.2).
              </p>
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-3 py-2 rounded text-xs text-center flex-1">
                  <strong>Train Set (80%)</strong><br/>
                  80 samples (e.g. indices 0-79)
                </div>
                <div className="bg-rose-500/20 border border-rose-500/50 text-rose-400 px-3 py-2 rounded text-xs text-center flex-[0.25]">
                  <strong>Test Set (20%)</strong><br/>
                  20 samples (e.g. indices 80-99)
                </div>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Standardisation Formula:</strong><br/>
                <span className="font-mono text-sm block my-2 text-indigo-400">z = (x - μ) / σ</span>
                where x is the raw feature value, μ is the mean, and σ is the standard deviation. This shifts the mean to 0 and scales the variance to 1.
              </p>
              <div className="bg-black/30 p-3 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-1">Raw Value (x)</th>
                      <th className="pb-1">Mean (μ)</th>
                      <th className="pb-1">Std Dev (σ)</th>
                      <th className="pb-1 text-emerald-400">Scaled Value (z)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1">10</td>
                      <td className="py-1">30</td>
                      <td className="py-1">14.14</td>
                      <td className="py-1 text-emerald-400">-1.41</td>
                    </tr>
                    <tr>
                      <td className="py-1">20</td>
                      <td className="py-1">30</td>
                      <td className="py-1">14.14</td>
                      <td className="py-1 text-emerald-400">-0.71</td>
                    </tr>
                    <tr>
                      <td className="py-1">30</td>
                      <td className="py-1">30</td>
                      <td className="py-1">14.14</td>
                      <td className="py-1 text-emerald-400">0.00</td>
                    </tr>
                    <tr>
                      <td className="py-1">40</td>
                      <td className="py-1">30</td>
                      <td className="py-1">14.14</td>
                      <td className="py-1 text-emerald-400">0.71</td>
                    </tr>
                    <tr>
                      <td className="py-1">50</td>
                      <td className="py-1">30</td>
                      <td className="py-1">14.14</td>
                      <td className="py-1 text-emerald-400">1.41</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Ensemble Decision Tree Prediction:</strong><br/>
                A Random Forest is a collection of M decision trees. The final regression output is the average prediction across all trees:
                <span className="font-mono text-sm block my-2 text-indigo-400">y_pred = (1 / M) * Σ T_j(x)</span>
              </p>
              <div className="bg-black/30 p-3 rounded-lg text-xs leading-normal space-y-1">
                <div>🌳 Tree 1 Predicts: <span className="font-bold text-sky-400">15.5</span></div>
                <div>🌳 Tree 2 Predicts: <span className="font-bold text-sky-400">17.2</span></div>
                <div>🌳 Tree 3 Predicts: <span className="font-bold text-sky-400">16.1</span></div>
                <div className="pt-1.5 border-t border-white/5 font-bold text-emerald-400">
                  Ensemble Prediction (Average): (15.5 + 17.2 + 16.1) / 3 = 16.27
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Mean Squared Error (MSE) Formula:</strong>
                <span className="font-mono text-sm block my-2 text-indigo-400">MSE = (1 / n) * Σ (y_i - y_pred_i)²</span>
                where y_i is the actual value and y_pred_i is the predicted value.
              </p>
              <div className="bg-black/30 p-3 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-1">Actual (y)</th>
                      <th className="pb-1">Predicted (y_pred)</th>
                      <th className="pb-1">Error (y - y_pred)</th>
                      <th className="pb-1 text-emerald-400">Sq. Error (y - y_pred)²</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1">3.0</td>
                      <td className="py-1">2.8</td>
                      <td className="py-1">0.2</td>
                      <td className="py-1 text-emerald-400">0.04</td>
                    </tr>
                    <tr>
                      <td className="py-1">5.0</td>
                      <td className="py-1">5.5</td>
                      <td className="py-1">-0.5</td>
                      <td className="py-1 text-emerald-400">0.25</td>
                    </tr>
                    <tr>
                      <td className="py-1">8.0</td>
                      <td className="py-1">7.5</td>
                      <td className="py-1">0.5</td>
                      <td className="py-1 text-emerald-400">0.25</td>
                    </tr>
                    <tr className="border-t border-white/10 font-bold">
                      <td className="py-1" colSpan={3}>Average (MSE):</td>
                      <td className="py-1 text-emerald-400">(0.04 + 0.25 + 0.25) / 3 = 0.18</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
