import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
import { HomePage } from '@/pages/HomePage';
import { ResourcesPage } from '@/pages/ResourcesPage';
import { PromptsPage } from '@/pages/PromptsPage';
import { DeployPage } from '@/pages/DeployPage';
import { AppLayout } from '@/components/layout/AppLayout';
import { InteractiveManualPage } from '@/pages/InteractiveManualPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { App } from './App';
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/resources",
        element: <ResourcesPage />,
      },
      {
        path: "/prompts",
        element: <PromptsPage />,
      },
      {
        path: "/deploy",
        element: <DeployPage />,
      },
      {
        path: "/manual",
        element: <InteractiveManualPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ]
  }
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App router={router} />
    </ErrorBoundary>
  </StrictMode>,
);