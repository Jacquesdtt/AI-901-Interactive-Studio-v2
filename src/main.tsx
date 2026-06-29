import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MasteryProvider } from './context/MasteryContext';
import { AiProvider } from './context/AiContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AiProvider>
      <MasteryProvider>
        <App />
      </MasteryProvider>
    </AiProvider>
  </StrictMode>,
);
