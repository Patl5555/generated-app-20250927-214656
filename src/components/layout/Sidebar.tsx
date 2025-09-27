import { NavLink } from 'react-router-dom';
import { Wrench, Database, MessageSquare, Rocket, BookOpen, Github, Cog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
const mainNavItems = [
  { to: '/', icon: Wrench, label: 'Tool Builder' },
  { to: '/resources', icon: Database, label: 'Resources' },
  { to: '/prompts', icon: MessageSquare, label: 'Prompts' },
  { to: '/deploy', icon: Rocket, label: 'Deployment' },
];
const secondaryNavItems = [
  { to: '/manual', icon: BookOpen, label: 'Interactive Manual' },
  { to: '/settings', icon: Cog, label: 'Settings' },
];
export function Sidebar() {
  return (
    <aside className="hidden w-[280px] border-r bg-background/50 backdrop-blur-sm md:flex md:flex-col justify-between">
      <div>
        <div className="flex h-16 items-center border-b px-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-gradient font-bold">Context Architect</span>
          </NavLink>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                      isActive && 'bg-primary/10 text-primary font-semibold'
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="p-4 border-t">
        <nav>
          <ul className="space-y-1">
            {secondaryNavItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                      isActive && 'bg-primary/10 text-primary font-semibold'
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="https://github.com/cloudflare/workers-ai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
                    <Github className="h-5 w-5" />
                    View on GitHub
                  </a>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Contribute to the project!</p>
                </TooltipContent>
              </Tooltip>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}