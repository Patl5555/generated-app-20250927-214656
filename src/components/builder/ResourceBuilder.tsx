import { useMcpStore, Resource } from '@/store/mcpStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { EmptyState } from '../layout/EmptyState';
import { Database } from 'lucide-react';
export function ResourceBuilder() {
  const activeResourceId = useMcpStore(state => state.activeResourceId);
  const resource = useMcpStore(state => state.resources.find(r => r.id === state.activeResourceId));
  const updateActiveResource = useMcpStore(state => state.updateActiveResource);
  const errors = useMcpStore(state => state.errors);
  const resourceIndex = useMcpStore(state => state.resources.findIndex(r => r.id === activeResourceId));

  if (!resource) {
    return (
      <EmptyState
        Icon={Database}
        title="No Resource Selected"
        description="Select a resource from the list on the left, or create a new one to get started."
      />
    );
  }
  const resourceErrors = errors?.issues.filter(issue => issue.path[0] === 'resources' && issue.path[1] === resourceIndex);
  const nameError = resourceErrors?.find(e => e.path[2] === 'name')?.message;
  const detailsError = resourceErrors?.find(e => e.path[2] === 'details')?.message;
  return (
    <Card className="bg-glass h-full flex flex-col">
      <CardHeader>
        <CardTitle>Resource Definition</CardTitle>
        <CardDescription>Define a data source that your AI agent can access.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="resource-name">Resource Name</Label>
          <Input
            id="resource-name"
            placeholder="e.g., ProductCatalogDB"
            value={resource.name}
            onChange={(e) => updateActiveResource({ name: e.target.value })}
            className={cn(nameError && 'border-destructive focus-visible:ring-destructive')}
          />
          {nameError && <p className="text-sm text-destructive">{nameError}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="resource-type">Resource Type</Label>
          <Select
            value={resource.type}
            onValueChange={(value: Resource['type']) => updateActiveResource({ type: value })}
          >
            <SelectTrigger id="resource-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="API">API</SelectItem>
              <SelectItem value="Database">Database</SelectItem>
              <SelectItem value="File">File</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="resource-details">Details / Configuration</Label>
          <Textarea
            id="resource-details"
            placeholder="Enter API endpoint, database connection string, or file path..."
            value={resource.details}
            onChange={(e) => updateActiveResource({ details: e.target.value })}
            className={cn("min-h-[120px] font-mono", detailsError && 'border-destructive focus-visible:ring-destructive')}
          />
          {detailsError && <p className="text-sm text-destructive">{detailsError}</p>}
        </div>
      </CardContent>
    </Card>
  );
}