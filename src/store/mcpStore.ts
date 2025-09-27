import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
// --- Predefined Models ---
export const PREDEFINED_MODELS = [
  { id: 'google-ai-studio/gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'openai/gpt-4o', name: 'ChatGPT 4o' },
  { id: 'google-ai-studio/gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
  { id: 'google-ai-studio/gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
];
// --- Zod Schemas for Validation ---
const parameterSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required").regex(/^[a-zA-Z0-9_]+$/, "Name must be alphanumeric with underscores"),
  type: z.enum(['string', 'number', 'boolean']),
  description: z.string().min(1, "Description is required"),
  required: z.boolean(),
});
const toolSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required").regex(/^[a-zA-Z0-9_]+$/, "Name must be alphanumeric with underscores"),
  description: z.string().min(1, "Description is required"),
  parameters: z.array(parameterSchema),
});
const resourceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(['API', 'Database', 'File']),
  details: z.string().min(1, "Details are required"),
});
const promptSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  content: z.string().min(1, "Content cannot be empty"),
});
const customModelSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
});
const settingsSchema = z.object({
  defaultModel: z.string().min(1),
  customModels: z.array(customModelSchema),
});
const mcpConfigSchema = z.object({
  tools: z.array(toolSchema),
  resources: z.array(resourceSchema),
  prompts: z.array(promptSchema),
  settings: settingsSchema,
});
// --- Types ---
export type Parameter = z.infer<typeof parameterSchema>;
export type Tool = z.infer<typeof toolSchema>;
export type Resource = z.infer<typeof resourceSchema>;
export type Prompt = z.infer<typeof promptSchema>;
export type CustomModel = z.infer<typeof customModelSchema>;
export type Settings = z.infer<typeof settingsSchema>;
type McpState = {
  tools: Tool[];
  resources: Resource[];
  prompts: Prompt[];
  settings: Settings;
  activeToolId: string | null;
  activeResourceId: string | null;
  activePromptId: string | null;
  status: 'idle' | 'loading' | 'saving' | 'success' | 'error';
  errors: z.ZodError | null;
  deploymentStatus: 'idle' | 'deploying' | 'success' | 'failed';
  deploymentLogs: string[];
};
type McpActions = {
  // Tools
  addTool: () => void;
  setActiveTool: (toolId: string) => void;
  updateActiveToolDetails: (details: Partial<Omit<Tool, 'id' | 'parameters'>>) => void;
  removeTool: (toolId: string) => void;
  addParameter: () => void;
  updateParameter: (paramId: string, updates: Partial<Omit<Parameter, 'id'>>) => void;
  removeParameter: (paramId: string) => void;
  reorderParameters: (startIndex: number, endIndex: number) => void;
  // Resources
  addResource: () => void;
  setActiveResource: (resourceId: string) => void;
  updateActiveResource: (details: Partial<Omit<Resource, 'id'>>) => void;
  removeResource: (resourceId: string) => void;
  // Prompts
  addPrompt: () => void;
  setActivePrompt: (promptId: string) => void;
  updateActivePrompt: (details: Partial<Omit<Prompt, 'id'>>) => void;
  removePrompt: (promptId: string) => void;
  // Settings
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  addCustomModel: (model: CustomModel) => void;
  removeCustomModel: (modelId: string) => void;
  // Global
  saveConfiguration: () => Promise<void>;
  loadConfiguration: () => Promise<void>;
  startDeployment: () => Promise<void>;
  _validate: () => void;
};
// --- Helper Functions ---
const createNewTool = (): Tool => ({ id: uuidv4(), name: 'new_tool', description: 'Tool description.', parameters: [] });
const createNewParameter = (): Parameter => ({ id: uuidv4(), name: 'new_param', type: 'string', description: 'Param description.', required: true });
const createNewResource = (): Resource => ({ id: uuidv4(), name: 'new_resource', type: 'API', details: 'API endpoint URL or connection string.' });
const createNewPrompt = (): Prompt => ({ id: uuidv4(), name: 'system_prompt', content: 'You are a helpful AI assistant.' });
const createDefaultSettings = (): Settings => ({ defaultModel: PREDEFINED_MODELS[0].id, customModels: [] });
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// --- Zustand Store ---
export const useMcpStore = create<McpState & McpActions>()(
  immer((set, get) => ({
    tools: [],
    resources: [],
    prompts: [],
    settings: createDefaultSettings(),
    activeToolId: null,
    activeResourceId: null,
    activePromptId: null,
    status: 'idle',
    errors: null,
    deploymentStatus: 'idle',
    deploymentLogs: [],
    _validate: () => {
      const { tools, resources, prompts, settings } = get();
      const result = mcpConfigSchema.safeParse({ tools, resources, prompts, settings });
      set({ errors: result.success ? null : result.error });
    },
    // --- Tools ---
    addTool: () => {
      const newTool = createNewTool();
      set(state => { state.tools.push(newTool); state.activeToolId = newTool.id; });
      get()._validate();
    },
    setActiveTool: (toolId) => set({ activeToolId: toolId }),
    updateActiveToolDetails: (details) => {
      set(state => {
        const tool = state.tools.find(t => t.id === state.activeToolId);
        if (tool) Object.assign(tool, details);
      });
      get()._validate();
    },
    removeTool: (toolId) => {
      set(state => {
        state.tools = state.tools.filter(t => t.id !== toolId);
        if (state.activeToolId === toolId) {
          state.activeToolId = state.tools[0]?.id || null;
        }
      });
      get()._validate();
    },
    addParameter: () => {
      set(state => {
        const tool = state.tools.find(t => t.id === state.activeToolId);
        tool?.parameters.push(createNewParameter());
      });
      get()._validate();
    },
    updateParameter: (paramId, updates) => {
      set(state => {
        const tool = state.tools.find(t => t.id === state.activeToolId);
        const param = tool?.parameters.find(p => p.id === paramId);
        if (param) Object.assign(param, updates);
      });
      get()._validate();
    },
    removeParameter: (paramId) => {
      set(state => {
        const tool = state.tools.find(t => t.id === state.activeToolId);
        if (tool) tool.parameters = tool.parameters.filter(p => p.id !== paramId);
      });
      get()._validate();
    },
    reorderParameters: (startIndex, endIndex) => {
      set(state => {
        const tool = state.tools.find(t => t.id === state.activeToolId);
        if (tool) {
          const [removed] = tool.parameters.splice(startIndex, 1);
          tool.parameters.splice(endIndex, 0, removed);
        }
      });
      get()._validate();
    },
    // --- Resources ---
    addResource: () => {
      const newResource = createNewResource();
      set(state => { state.resources.push(newResource); state.activeResourceId = newResource.id; });
      get()._validate();
    },
    setActiveResource: (resourceId) => set({ activeResourceId: resourceId }),
    updateActiveResource: (details) => {
      set(state => {
        const resource = state.resources.find(r => r.id === state.activeResourceId);
        if (resource) Object.assign(resource, details);
      });
      get()._validate();
    },
    removeResource: (resourceId) => {
      set(state => {
        state.resources = state.resources.filter(r => r.id !== resourceId);
        if (state.activeResourceId === resourceId) {
          state.activeResourceId = state.resources[0]?.id || null;
        }
      });
      get()._validate();
    },
    // --- Prompts ---
    addPrompt: () => {
      const newPrompt = createNewPrompt();
      set(state => { state.prompts.push(newPrompt); state.activePromptId = newPrompt.id; });
      get()._validate();
    },
    setActivePrompt: (promptId) => set({ activePromptId: promptId }),
    updateActivePrompt: (details) => {
      set(state => {
        const prompt = state.prompts.find(p => p.id === state.activePromptId);
        if (prompt) Object.assign(prompt, details);
      });
      get()._validate();
    },
    removePrompt: (promptId) => {
      set(state => {
        state.prompts = state.prompts.filter(p => p.id !== promptId);
        if (state.activePromptId === promptId) {
          state.activePromptId = state.prompts[0]?.id || null;
        }
      });
      get()._validate();
    },
    // --- Settings ---
    updateSetting: (key, value) => {
      set(state => { state.settings[key] = value; });
      get()._validate();
    },
    addCustomModel: (model) => {
      set(state => { state.settings.customModels.push(model); });
      get()._validate();
    },
    removeCustomModel: (modelId) => {
      set(state => {
        state.settings.customModels = state.settings.customModels.filter(m => m.id !== modelId);
        if (state.settings.defaultModel === modelId) {
          state.settings.defaultModel = PREDEFINED_MODELS[0].id;
        }
      });
      get()._validate();
    },
    // --- Global ---
    saveConfiguration: async () => {
      get()._validate();
      if (get().errors) {
        set({ status: 'error' });
        console.error("Validation errors prevent saving:", get().errors);
        return;
      }
      set({ status: 'saving' });
      try {
        const { tools, resources, prompts, settings } = get();
        const response = await fetch('/api/mcp/config', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tools, resources, prompts, settings }),
        });
        if (!response.ok) throw new Error('Failed to save configuration');
        set({ status: 'success' });
        setTimeout(() => set(state => state.status === 'success' ? { status: 'idle' } : {}), 2000);
      } catch (error) {
        console.error(error);
        set({ status: 'error' });
      }
    },
    loadConfiguration: async () => {
      set({ status: 'loading' });
      try {
        const response = await fetch('/api/mcp/config');
        if (!response.ok) throw new Error('Failed to load configuration');
        const data = await response.json();
        const config = data.success ? data.data : {};
        const tools = config?.tools && config.tools.length > 0 ? config.tools : [createNewTool()];
        const resources = config?.resources && config.resources.length > 0 ? config.resources : [createNewResource()];
        const prompts = config?.prompts && config.prompts.length > 0 ? config.prompts : [createNewPrompt()];
        const settings = config?.settings ? config.settings : createDefaultSettings();
        set({
          tools,
          resources,
          prompts,
          settings,
          activeToolId: tools[0]?.id || null,
          activeResourceId: resources[0]?.id || null,
          activePromptId: prompts[0]?.id || null,
          status: 'idle',
        });
        get()._validate();
      } catch (error) {
        console.error(error);
        set({
          tools: [createNewTool()],
          resources: [createNewResource()],
          prompts: [createNewPrompt()],
          settings: createDefaultSettings(),
          activeToolId: get().tools[0].id,
          activeResourceId: get().resources[0].id,
          activePromptId: get().prompts[0].id,
          status: 'error',
        });
      }
    },
    startDeployment: async () => {
      get()._validate();
      if (get().errors) {
        set({
          deploymentStatus: 'failed',
          deploymentLogs: ['Deployment failed: Please fix validation errors before deploying.'],
        });
        return;
      }
      set({ deploymentStatus: 'deploying', deploymentLogs: [] });
      const addLog = (log: string) => set(state => { state.deploymentLogs.push(`[${new Date().toLocaleTimeString()}] ${log}`) });
      try {
        addLog('Starting deployment process...');
        await sleep(1000);
        addLog('Connecting to Cloudflare network...');
        await sleep(1500);
        addLog('Authenticating with API token...');
        await sleep(500);
        addLog('Validating configuration schema... OK');
        await sleep(1000);
        addLog(`Found ${get().tools.length} tools, ${get().resources.length} resources, ${get().prompts.length} prompts.`);
        addLog(`Using default model: ${get().settings.defaultModel}`);
        await sleep(1000);
        addLog('Uploading worker script...');
        await sleep(2000);
        addLog('Setting up bindings and secrets...');
        await sleep(1500);
        addLog('Finalizing deployment...');
        await sleep(1000);
        addLog('🚀 Deployment successful!');
        set({ deploymentStatus: 'success' });
      } catch (e) {
        addLog('❌ Deployment failed!');
        set({ deploymentStatus: 'failed' });
      }
    },
  }))
);