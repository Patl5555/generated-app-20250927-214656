import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
interface EmptyStateProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}
export function EmptyState({ Icon, title, description }: EmptyStateProps) {
  return (
    <Card className="bg-glass flex-1 flex items-center justify-center h-full">
      <CardContent className="text-center p-6">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}