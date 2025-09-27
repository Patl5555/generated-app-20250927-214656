import React, { useState } from 'react';
import { useMcpStore } from '@/store/mcpStore';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash2 } from 'lucide-react';
import { PREDEFINED_MODELS } from '@/store/mcpStore';
export function ModelSelection() {
  const { settings, updateSetting, addCustomModel, removeCustomModel } = useMcpStore(state => ({
    settings: state.settings,
    updateSetting: state.updateSetting,
    addCustomModel: state.addCustomModel,
    removeCustomModel: state.removeCustomModel,
  }));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelId, setNewModelId] = useState('');
  const handleAddModel = () => {
    if (newModelName.trim() && newModelId.trim()) {
      addCustomModel({ name: newModelName.trim(), id: newModelId.trim() });
      setNewModelName('');
      setNewModelId('');
      setDialogOpen(false);
    }
  };
  return (
    <div className="space-y-8">
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Default Model</CardTitle>
          <CardDescription>Select the default model to be used for generating responses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Label htmlFor="default-model-select">Model</Label>
            <Select
              value={settings.defaultModel}
              onValueChange={(value) => updateSetting('defaultModel', value)}
            >
              <SelectTrigger id="default-model-select" className="w-full">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Predefined Models</SelectLabel>
                  {PREDEFINED_MODELS.map(model => (
                    <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                  ))}
                </SelectGroup>
                {settings.customModels.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Custom Models</SelectLabel>
                    {settings.customModels.map(model => (
                      <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-muted/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Custom Models</CardTitle>
            <CardDescription>Add and manage your own custom model endpoints.</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Model
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Custom Model</DialogTitle>
                <DialogDescription>
                  Enter the details for your custom model.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="model-name" className="text-right">Name</Label>
                  <Input id="model-name" value={newModelName} onChange={(e) => setNewModelName(e.target.value)} className="col-span-3" placeholder="e.g., My Fine-Tuned Llama" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="model-id" className="text-right">ID / Endpoint</Label>
                  <Input id="model-id" value={newModelId} onChange={(e) => setNewModelId(e.target.value)} className="col-span-3" placeholder="e.g., custom/my-llama-v1" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddModel}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settings.customModels.length > 0 ? (
              settings.customModels.map(model => (
                <div key={model.id} className="flex items-center justify-between p-3 rounded-lg border bg-background">
                  <div>
                    <p className="font-semibold">{model.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">{model.id}</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the "{model.name}" custom model.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => removeCustomModel(model.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                <p>No custom models added yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}