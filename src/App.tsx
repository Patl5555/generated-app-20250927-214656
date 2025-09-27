import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useMcpStore } from './store/mcpStore';
import { Loader2 } from 'lucide-react';
// This component will now be the root of our application.
// It's responsible for handling initial data loading before the UI is rendered.
export function App({ router }: { router: any }) {
  const loadConfiguration = useMcpStore((state) => state.loadConfiguration);
  const status = useMcpStore((state) => state.status);
  useEffect(() => {
    // On initial app load, fetch the configuration from the server.
    loadConfiguration();
  }, [loadConfiguration]);
  // Display a loading screen while the initial configuration is being fetched.
  // This prevents the user from seeing a flicker of the default/empty state.
  if (status === 'loading') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-muted text-foreground">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading Configuration...</p>
        </div>
      </div>
    );
  }
  // Once loading is complete (either success or error), render the main application router.
  return <RouterProvider router={router} />;
}