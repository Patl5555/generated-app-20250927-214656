import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cog } from 'lucide-react';
import { ModelSelection } from '@/components/settings/ModelSelection';
export function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col items-center p-0 md:p-6">
      <Card className="w-full max-w-4xl bg-glass">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Cog className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                Model Configuration
              </CardTitle>
              <CardDescription className="mt-2">
                Manage the Language Model (LLM) settings for your MCP server.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ModelSelection />
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        Built with ❤️ at Cloudflare
      </footer>
    </div>
  );
}