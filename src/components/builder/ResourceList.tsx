import { useMcpStore } from "@/store/mcpStore";
import { Button } from "@/components/ui/button";
import { Plus, Database, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
export function ResourceList() {
  const resources = useMcpStore((state) => state.resources);
  const activeResourceId = useMcpStore((state) => state.activeResourceId);
  const { addResource, setActiveResource, removeResource } = useMcpStore();
  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Resources</h2>
        <Button size="sm" variant="outline" onClick={addResource}>
          <Plus className="h-4 w-4 mr-2" />
          New
        </Button>
      </div>
      <ScrollArea className="h-32 md:h-[calc(100vh-160px)]">
        <div className="space-y-2">
          {resources.map((resource) => (
            <div key={resource.id} className="flex items-center group">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left",
                  activeResourceId === resource.id && "bg-primary/10 text-primary"
                )}
                onClick={() => setActiveResource(resource.id)}
              >
                <Database className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate flex-1">{resource.name}</span>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the "{resource.name}" resource.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => removeResource(resource.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}