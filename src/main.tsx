import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MasteryProvider } from './context/MasteryContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MasteryProvider>
      <App />
    </MasteryProvider>
  </StrictMode>,
);
