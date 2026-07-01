import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Tensor } from '../../lib/tensorEngine';

interface TensorContextType {
  tensor: Tensor;
  setTensor: (t: Tensor) => void;
  selectedLogicalIndices: number[] | null;
  setSelectedLogicalIndices: (indices: number[] | null) => void;
  selectedPhysicalIndex: number | null;
}

const TensorContext = createContext<TensorContextType | undefined>(undefined);

export function isIndicesValid(indices: number[] | null, t: Tensor): boolean {
  if (!indices) return false;
  if (indices.length !== t.shape.length) return false;
  return indices.every((idx, dim) => idx >= 0 && idx < t.shape[dim]);
}

export function TensorProvider({ children }: { children: ReactNode }) {
  const [tensor, setTensor] = useState<Tensor>(() => Tensor.arange(12).transpose(0, 0)); // Initialize with something, but wait, transpose(0,0) is just itself. Let's do a 3x4.
  // Actually, let's start with a nice 3x4 arange tensor
  const [initialTensor, setInitialTensor] = useState<Tensor>(() => {
    const t = Tensor.arange(12);
    t.shape = [3, 4];
    t.strides = [4, 1];
    return t;
  });

  const [currentTensor, setCurrentTensor] = useState<Tensor>(initialTensor);
  const [selectedLogicalIndices, setSelectedLogicalIndices] = useState<number[] | null>(null);

  const selectedPhysicalIndex = isIndicesValid(selectedLogicalIndices, currentTensor) 
    ? currentTensor.offset(selectedLogicalIndices!) 
    : null;

  useEffect(() => {
    if (selectedLogicalIndices && !isIndicesValid(selectedLogicalIndices, currentTensor)) {
      setSelectedLogicalIndices(null);
    }
  }, [selectedLogicalIndices, currentTensor]);

  return (
    <TensorContext.Provider 
      value={{ 
        tensor: currentTensor, 
        setTensor: setCurrentTensor, 
        selectedLogicalIndices, 
        setSelectedLogicalIndices,
        selectedPhysicalIndex
      }}
    >
      {children}
    </TensorContext.Provider>
  );
}

export function useTensor() {
  const context = useContext(TensorContext);
  if (!context) {
    throw new Error('useTensor must be used within a TensorProvider');
  }
  return context;
}
