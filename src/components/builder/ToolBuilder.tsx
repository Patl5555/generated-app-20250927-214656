import React from 'react';
import { useMcpStore } from '@/store/mcpStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wrench } from 'lucide-react';
import { ParameterRow } from './ParameterRow';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { EmptyState } from '../layout/EmptyState';
export function ToolBuilder() {
  const activeToolId = useMcpStore(state => state.activeToolId);
  const tool = useMcpStore(state => state.tools.find(t => t.id === state.activeToolId));
  const updateActiveToolDetails = useMcpStore(state => state.updateActiveToolDetails);
  const addParameter = useMcpStore(state => state.addParameter);
  const reorderParameters = useMcpStore(state => state.reorderParameters);
  const errors = useMcpStore(state => state.errors);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tool?.parameters.findIndex(p => p.id === active.id);
      const newIndex = tool?.parameters.findIndex(p => p.id === over.id);
      if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== -1 && newIndex !== -1) {
        reorderParameters(oldIndex, newIndex);
      }
    }
  }
  const toolIndex = useMcpStore(state => state.tools.findIndex(t => t.id === state.activeToolId));
  const toolErrors = errors?.issues.filter(issue => issue.path[0] === 'tools' && issue.path[1] === toolIndex);
  const nameError = toolErrors?.find(e => e.path[2] === 'name')?.message;
  const descriptionError = toolErrors?.find(e => e.path[2] === 'description')?.message;
  if (!tool) {
    return (
      <EmptyState
        Icon={Wrench}
        title="No Tool Selected"
        description="Select a tool from the list on the left, or create a new one to get started."
      />
    );
  }
  return (
    <Card className="bg-glass h-full flex flex-col">
      <CardHeader>
        <CardTitle>Tool Definition</CardTitle>
        <CardDescription>Define the function name, description, and parameters for your tool.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="tool-name">Tool Name</Label>
            <Input
              id="tool-name"
              placeholder="e.g., get_weather"
              value={tool.name}
              onChange={(e) => updateActiveToolDetails({ name: e.target.value })}
              className={cn(nameError && 'border-destructive focus-visible:ring-destructive')}
            />
            {nameError && <p className="text-sm text-destructive">{nameError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tool-description">Tool Description</Label>
            <Textarea
              id="tool-description"
              placeholder="A short description of what the tool does."
              value={tool.description}
              onChange={(e) => updateActiveToolDetails({ description: e.target.value })}
              className={cn("min-h-[40px]", descriptionError && 'border-destructive focus-visible:ring-destructive')}
            />
            {descriptionError && <p className="text-sm text-destructive">{descriptionError}</p>}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Parameters</h3>
          <div className="space-y-4">
            {tool.parameters.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={tool.parameters.map(p => p.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
                    {tool.parameters.map((param, index) => <ParameterRow key={param.id} parameter={param} toolIndex={toolIndex} paramIndex={index} />)}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                <p>No parameters defined for this tool.</p>
                <p className="text-sm">Click "Add Parameter" to get started.</p>
              </div>
            )}
          </div>
          <Button variant="outline" className="mt-6 w-full" onClick={addParameter}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Parameter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}