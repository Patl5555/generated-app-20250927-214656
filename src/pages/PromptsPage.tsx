import { PromptList } from "@/components/builder/PromptList";
import { PromptEditor } from "@/components/builder/PromptEditor";
export function PromptsPage() {
  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 h-full min-h-0">
      <PromptList />
      <div className="flex-1">
        <PromptEditor />
      </div>
    </div>
  );
}