import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, CheckCircle, AlertTriangle, Loader2, Copy } from 'lucide-react';
import { useMcpStore } from '@/store/mcpStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
export function DeployPage() {
  const { deploymentStatus, deploymentLogs, startDeployment, errors } = useMcpStore(state => ({
    deploymentStatus: state.deploymentStatus,
    deploymentLogs: state.deploymentLogs,
    startDeployment: state.startDeployment,
    errors: state.errors,
  }));
  const logContainerRef = useRef<HTMLDivElement>(null);
  const hasErrors = !!errors;
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [deploymentLogs]);
  const mockServerUrl = 'https://mcp-server-b7a.workers.dev';
  const handleCopy = () => {
    navigator.clipboard.writeText(mockServerUrl);
    toast.success('Server URL copied to clipboard!');
  };
  const getStatusBadge = () => {
    switch (deploymentStatus) {
      case 'deploying':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Deploying</Badge>;
      case 'success':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="mr-2 h-4 w-4" />Success</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertTriangle className="mr-2 h-4 w-4" />Failed</Badge>;
      default:
        return <Badge variant="outline">Idle</Badge>;
    }
  };
  return (
    <div className="flex-1 flex flex-col items-center p-0 md:p-6">
      <Card className="w-full max-w-4xl bg-glass">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Rocket className="h-6 w-6 text-primary" />
                Deployment & Monitoring
              </CardTitle>
              <CardDescription className="mt-2">
                Deploy your MCP server to the Cloudflare global network.
              </CardDescription>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Live Logs</h3>
            <Card className="bg-muted/50 h-64">
              <ScrollArea className="h-full w-full rounded-md p-4">
                <div ref={logContainerRef} className="font-mono text-sm text-muted-foreground space-y-2">
                  {deploymentLogs.length > 0 ? (
                    deploymentLogs.map((log, index) => <p key={index}>{log}</p>)
                  ) : (
                    <p>Deployment logs will appear here...</p>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
          {deploymentStatus === 'success' && (
            <Card className="bg-green-500/10 border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  Deployment Successful!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Your MCP server is now live.</p>
                <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                  <span className="font-mono text-sm flex-1 truncate">{mockServerUrl}</span>
                  <Button variant="ghost" size="icon" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {deploymentStatus === 'failed' && (
            <Card className="bg-destructive/10 border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Deployment Failed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Please check the logs for more details. If the issue persists, review your configuration for errors.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={startDeployment}
            disabled={deploymentStatus === 'deploying' || hasErrors}
            className="w-full md:w-auto bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity duration-200 hover:-translate-y-0.5 transform"
          >
            {deploymentStatus === 'deploying' ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deploying...</>
            ) : (
              'Start Deployment'
            )}
          </Button>
          {hasErrors && <p className="ml-4 text-sm text-destructive">Please fix validation errors before deploying.</p>}
        </CardFooter>
      </Card>
    </div>
  );
}