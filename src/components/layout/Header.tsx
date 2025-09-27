import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useMcpStore } from '@/store/mcpStore';
import { Loader2, Check, AlertTriangle, Save } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';
export function Header() {
  const status = useMcpStore(state => state.status);
  const saveConfiguration = useMcpStore(state => state.saveConfiguration);
  const errors = useMcpStore(state => state.errors);
  const isSaving = status === 'saving';
  const hasErrors = !!errors;
  const getSaveButtonContent = () => {
    switch (status) {
      case 'saving':
        return <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>;
      case 'success':
        return <><Check className="mr-2 h-4 w-4" /> Saved</>;
      case 'error':
        return <><AlertTriangle className="mr-2 h-4 w-4" /> Save Failed</>;
      default:
        return <><Save className="mr-2 h-4 w-4" /> Save</>;
    }
  };
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/50 backdrop-blur-sm px-6">
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="text-sm text-muted-foreground">Server Status: <span className="text-green-400 font-semibold">Online</span></span>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <Button
                onClick={saveConfiguration}
                disabled={isSaving || hasErrors}
                className={`transition-all duration-200 ${hasErrors ? 'bg-destructive/80 hover:bg-destructive' : ''}`}
              >
                {getSaveButtonContent()}
              </Button>
            </div>
          </TooltipTrigger>
          {hasErrors && (
            <TooltipContent>
              <p>Please fix validation errors before saving.</p>
            </TooltipContent>
          )}
        </Tooltip>
        <Button
          asChild
          className="bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity duration-200 hover:-translate-y-0.5 transform"
        >
          <Link to="/deploy">Deploy</Link>
        </Button>
        <ThemeToggle className="relative" />
      </div>
    </header>
  );
}