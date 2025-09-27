import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ToolBuilder } from "@/components/builder/ToolBuilder";
import { CodePreview } from "@/components/builder/CodePreview";
import { ToolList } from "@/components/builder/ToolList";
export function HomePage() {
  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 h-full min-h-0">
      <ToolList />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={55} minSize={30}>
          <ToolBuilder />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={45} minSize={30}>
          <CodePreview />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}