import { ResourceList } from "@/components/builder/ResourceList";
import { ResourceBuilder } from "@/components/builder/ResourceBuilder";
export function ResourcesPage() {
  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 h-full min-h-0">
      <ResourceList />
      <div className="flex-1">
        <ResourceBuilder />
      </div>
    </div>
  );
}