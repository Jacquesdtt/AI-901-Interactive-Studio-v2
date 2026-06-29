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
              <span className="text-purple-400">import</span> pandas <span className="text-purple-400">as</span> pd<br/>
              <span className="text-purple-400">from</span> sklearn.model_selection <span className="text-purple-400">import</span> train_test_split<br/><br/>
              df = pd.read_csv(<span className="text-amber-300">'data.csv'</span>)<br/>
              X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=<span className="text-rose-400">0.2</span>)
            </pre>
          )}
          {activeStep === 1 && (
            <pre>
              <span className="text-purple-400">from</span> sklearn.preprocessing <span className="text-purple-400">import</span> StandardScaler<br/><br/>
              scaler = StandardScaler()<br/>
              X_train_scaled = scaler.fit_transform(X_train)<br/>
              X_test_scaled = scaler.transform(X_test) <span className="text-slate-500"># Avoid data leakage!</span>
            </pre>
          )}
          {activeStep === 2 && (
            <pre>
              <span className="text-purple-400">from</span> sklearn.ensemble <span className="text-purple-400">import</span> RandomForestRegressor<br/><br/>
              model = RandomForestRegressor(n_estimators=<span className="text-rose-400">100</span>)<br/>
              model.fit(X_train_scaled, y_train)<br/>
            </pre>
          )}
          {activeStep === 3 && (
            <pre>
              <span className="text-purple-400">from</span> sklearn.metrics <span className="text-purple-400">import</span> mean_squared_error<br/><br/>
              preds = model.predict(X_test_scaled)<br/>
              mse = mean_squared_error(y_test, preds)<br/>
              <span className="text-blue-400">print</span>(<span className="text-amber-300">f"MSE: {`{mse}`}"</span>)
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
