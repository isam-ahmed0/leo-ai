import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface McpServer {
  id: string;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
}

interface LeoConfigState {
  // Identity
  isConfigured: boolean;
  
  // Primary Chat Config
  provider: 'openai' | 'anthropic' | 'google' | 'custom';
  apiKey: string;
  modelName: string; // e.g., "gemini-1.5-pro"
  endpoint: string;  // e.g., "https://openrouter.ai/api/v1"
  
  // Fixer Config (Self-Healing)
  fixerModel: string;
  
  // Tools
  mcpServers: McpServer[];
  
  // Actions
  setConfig: (config: Partial<LeoConfigState>) => void;
  addMcpServer: (url: string) => void;
  updateMcpStatus: (id: string, status: McpServer['status']) => void;
}

export const useConfigStore = create<LeoConfigState>()(
  persist(
    (set) => ({
      isConfigured: false,
      provider: 'custom',
      apiKey: '',
      modelName: 'gpt-4o',
      endpoint: '',
      fixerModel: 'gpt-4o-mini',
      mcpServers: [],

      setConfig: (config) => set((state) => ({ ...state, ...config })),
      
      addMcpServer: (url) => set((state) => ({
        mcpServers: [...state.mcpServers, { id: crypto.randomUUID(), url, status: 'disconnected' }]
      })),

      updateMcpStatus: (id, status) => set((state) => ({
        mcpServers: state.mcpServers.map(s => s.id === id ? { ...s, status } : s)
      }))
    }),
    {
      name: 'leo-neural-config',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
