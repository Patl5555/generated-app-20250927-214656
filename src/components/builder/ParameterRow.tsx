import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useMcpStore, Parameter } from '@/store/mcpStore';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
type ParameterRowProps = {
  parameter: Parameter;
  toolIndex: number;
  paramIndex: number;
};
export function ParameterRow({ parameter, toolIndex, paramIndex }: ParameterRowProps) {
  const { updateParameter, removeParameter, errors } = useMcpStore(state => ({
    updateParameter: state.updateParameter,
    removeParameter: state.removeParameter,
    errors: state.errors,
  }));
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: parameter.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const paramErrors = errors?.issues.filter(issue =>
    issue.path[0] === 'tools' &&
    issue.path[1] === toolIndex &&
    issue.path[2] === 'parameters' &&
    issue.path[3] === paramIndex
  );
  const nameError = paramErrors?.find(e => e.path[4] === 'name')?.message;
  const descriptionError = paramErrors?.find(e => e.path[4] === 'description')?.message;
  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/50 transition-all hover:bg-muted hover:shadow-md">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="cursor-grab mt-2 touch-none" {...attributes} {...listeners}>
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Drag to reorder</p>
        </TooltipContent>
      </Tooltip>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild><Label htmlFor={`param-name-${parameter.id}`}>Name</Label></TooltipTrigger>
            <TooltipContent><p>The parameter name, used as a key in the JSON object.</p></TooltipContent>
          </Tooltip>
          <Input
            id={`param-name-${parameter.id}`}
            placeholder="e.g., location"
            value={parameter.name}
            onChange={(e) => updateParameter(parameter.id, { name: e.target.value })}
            className={cn(nameError && 'border-destructive focus-visible:ring-destructive')}
          />
          {nameError && <p className="text-sm text-destructive">{nameError}</p>}
        </div>
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild><Label htmlFor={`param-type-${parameter.id}`}>Type</Label></TooltipTrigger>
            <TooltipContent><p>The data type of the parameter.</p></TooltipContent>
          </Tooltip>
          <Select
            value={parameter.type}
            onValueChange={(value: Parameter['type']) => updateParameter(parameter.id, { type: value })}
          >
            <SelectTrigger id={`param-type-${parameter.id}`}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild><Label htmlFor={`param-desc-${parameter.id}`}>Description</Label></TooltipTrigger>
            <TooltipContent><p>A clear description for the AI to understand the parameter.</p></TooltipContent>
          </Tooltip>
          <Input
            id={`param-desc-${parameter.id}`}
            placeholder="e.g., The city and state"
            value={parameter.description}
            onChange={(e) => updateParameter(parameter.id, { description: e.target.value })}
            className={cn(descriptionError && 'border-destructive focus-visible:ring-destructive')}
          />
          {descriptionError && <p className="text-sm text-destructive">{descriptionError}</p>}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 pt-2">
        <Tooltip>
          <TooltipTrigger asChild><Label htmlFor={`param-req-${parameter.id}`} className="text-xs">Required</Label></TooltipTrigger>
          <TooltipContent><p>Is this parameter mandatory for the tool to run?</p></TooltipContent>
        </Tooltip>
        <Switch
          id={`param-req-${parameter.id}`}
          checked={parameter.required}
          onCheckedChange={(checked) => updateParameter(parameter.id, { required: checked })}
        />
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive mt-2"
            onClick={() => removeParameter(parameter.id)}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete parameter</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}