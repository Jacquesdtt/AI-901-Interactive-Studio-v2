import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

interface AiContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isKeyValid: boolean;
  clearKey: () => void;
  aiClient: any | null; // We can't strictly type without knowing full internal types, using any for ease
  isUsingFallbackKey: boolean;
}

const AiContext = createContext<AiContextType | undefined>(undefined);

export function AiProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState(() => {
    try {
      return localStorage.getItem('AI-901 web app key') || (import.meta as any).env?.VITE_AI_901_WEB_APP_KEY || '';
    } catch (err) {
      console.warn("localStorage read failed, falling back to env:", err);
      return (import.meta as any).env?.VITE_AI_901_WEB_APP_KEY || '';
    }
  });
  
  const [isKeyValid, setIsKeyValid] = useState(!!apiKey);
  const [aiClient, setAiClient] = useState<any | null>(null);
  const [isUsingFallbackKey, setIsUsingFallbackKey] = useState(false);

  useEffect(() => {
    let hasLocalKey = false;
    try {
      hasLocalKey = !!localStorage.getItem('AI-901 web app key');
    } catch (e) {}
    
    setIsUsingFallbackKey(!hasLocalKey && !!(import.meta as any).env?.VITE_AI_901_WEB_APP_KEY);

    if (apiKey) {
      try {
        const client = new GoogleGenAI({ apiKey });
        setAiClient(client);
        setIsKeyValid(true);
      } catch (err) {
        console.error("Failed to initialize GoogleGenAI client:", err);
        setAiClient(null);
        setIsKeyValid(false);
      }
    } else {
      setAiClient(null);
      setIsKeyValid(false);
    }
  }, [apiKey]);

  const setApiKey = (key: string) => {
    try {
      localStorage.setItem('AI-901 web app key', key);
    } catch (err) {
      console.warn("Failed to write to localStorage:", err);
    }
    setApiKeyState(key);
  };

  const clearKey = () => {
    try {
      localStorage.removeItem('AI-901 web app key');
    } catch (err) {
      console.warn("Failed to clear localStorage:", err);
    }
    setApiKeyState('');
  };

  return (
    <AiContext.Provider value={{ apiKey, setApiKey, isKeyValid, clearKey, aiClient, isUsingFallbackKey }}>
      {children}
    </AiContext.Provider>
  );
}

export function useAi() {
  const context = useContext(AiContext);
  if (context === undefined) {
    throw new Error('useAi must be used within an AiProvider');
  }
  return context;
}
