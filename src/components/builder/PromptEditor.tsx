import { useMcpStore } from '@/store/mcpStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { EmptyState } from '../layout/EmptyState';
import { MessageSquare } from 'lucide-react';
export function PromptEditor() {
  const activePromptId = useMcpStore(state => state.activePromptId);
  const prompt = useMcpStore(state => state.prompts.find(p => p.id === state.activePromptId));
  const updateActivePrompt = useMcpStore(state => state.updateActivePrompt);
  const errors = useMcpStore(state => state.errors);
  const promptIndex = useMcpStore(state => state.prompts.findIndex(p => p.id === activePromptId));
  if (!prompt) {
    return (
      <EmptyState
        Icon={MessageSquare}
        title="No Prompt Selected"
        description="Select a prompt from the list on the left, or create a new one to get started."
      />
    );
  }
  const promptErrors = errors?.issues.filter(issue => issue.path[0] === 'prompts' && issue.path[1] === promptIndex);
  const nameError = promptErrors?.find(e => e.path[2] === 'name')?.message;
  const contentError = promptErrors?.find(e => e.path[2] === 'content')?.message;
  return (
    <Card className="bg-glass h-full flex flex-col">
      <CardHeader>
        <CardTitle>Prompt Editor</CardTitle>
        <CardDescription>Craft the guidance and instructions for your AI agent.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-auto p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="prompt-name">Prompt Name</Label>
          <Input
            id="prompt-name"
            placeholder="e.g., SystemPrompt, E-commerceAssistant"
            value={prompt.name}
            onChange={(e) => updateActivePrompt({ name: e.target.value })}
            className={cn("w-full md:w-1/2", nameError && 'border-destructive focus-visible:ring-destructive')}
          />
          {nameError && <p className="text-sm text-destructive">{nameError}</p>}
        </div>
        <div className="space-y-2 flex-1 flex flex-col">
          <Label htmlFor="prompt-content">Content</Label>
          <Textarea
            id="prompt-content"
            placeholder="You are a helpful assistant that helps users find products in our catalog..."
            value={prompt.content}
            onChange={(e) => updateActivePrompt({ content: e.target.value })}
            className={cn("flex-1 resize-none", contentError && 'border-destructive focus-visible:ring-destructive')}
          />
          {contentError && <p className="text-sm text-destructive">{contentError}</p>}
        </div>
      </CardContent>
    </Card>
  );
}