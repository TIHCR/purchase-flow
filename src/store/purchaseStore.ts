import { create } from 'zustand';

export type RequestStatus = 'PENDENTE' | 'APROVADO' | 'REPROVADO';

export interface PurchaseRequest {
  id: string;
  email: string;
  setor: string;
  solicitante: string;
  urgencia: boolean;
  motivo: string;
  produto: string;
  quantidade: number;
  status: RequestStatus;
  createdAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  signature?: string;
  signedAt?: Date;
}

interface PurchaseStore {
  requests: PurchaseRequest[];
  addRequest: (request: Omit<PurchaseRequest, 'id' | 'status' | 'createdAt'>) => void;
  approveRequest: (id: string, approvedBy: string) => void;
  rejectRequest: (id: string) => void;
  signRequest: (id: string, signature: string) => void;
  getRequestById: (id: string) => PurchaseRequest | undefined;
}

export const usePurchaseStore = create<PurchaseStore>((set, get) => ({
  requests: [],
  
  addRequest: (request) => {
    const newRequest: PurchaseRequest = {
      ...request,
      id: `SC-${Date.now().toString(36).toUpperCase()}`,
      status: 'PENDENTE',
      createdAt: new Date(),
    };
    set((state) => ({ requests: [...state.requests, newRequest] }));
  },
  
  approveRequest: (id, approvedBy) => {
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id
          ? { ...req, status: 'APROVADO' as RequestStatus, approvedAt: new Date(), approvedBy }
          : req
      ),
    }));
  },
  
  rejectRequest: (id) => {
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id ? { ...req, status: 'REPROVADO' as RequestStatus } : req
      ),
    }));
  },
  
  signRequest: (id, signature) => {
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id ? { ...req, signature, signedAt: new Date() } : req
      ),
    }));
  },
  
  getRequestById: (id) => {
    return get().requests.find((req) => req.id === id);
  },
}));
