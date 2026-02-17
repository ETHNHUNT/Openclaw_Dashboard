import { LayoutDashboard, CheckSquare, Copy, Calendar, Database, BarChart3, Shield, Activity, Settings, Brain } from 'lucide-react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs"

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: CheckSquare, label: 'Missions' },
  { icon: Copy, label: 'Templates' },
  { icon: Calendar, label: 'Timeline' },
  { icon: Database, label: 'Memory' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Shield, label: 'Security' },
  { icon: Activity, label: 'Systems' },
  { icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 bg-sidebar border-r border-sidebar-border h-screen flex-col shrink-0">
      {/* Branding */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-glow">
            <Brain className="text-primary-foreground" size={18} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-sidebar-foreground tracking-tight">OpenClaw</h1>
            <p className="text-xs text-muted-foreground">Mission Control</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-2">
        <TabsList className="flex flex-col h-auto bg-transparent space-y-1 w-full p-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <TabsTrigger 
                key={item.label} 
                value={item.label}
                className="w-full justify-start gap-3 px-3 py-2 h-9 text-sm font-medium data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-accent-foreground text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all rounded-md"
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/50 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-violet-400 flex items-center justify-center text-white font-medium text-xs">
            VN
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Vipin Nandal</p>
            <p className="text-xs text-muted-foreground truncate">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
