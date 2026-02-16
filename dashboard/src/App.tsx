import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';
import TaskTemplates from './components/TaskTemplates';
import GanttChart from './components/GanttChart';
import WorkspaceExplorer from './components/WorkspaceExplorer';
import UserManager from './components/UserManager';
import ActivityLog from './components/ActivityLog';
import SystemHealth from './components/SystemHealth';
import Settings from './components/Settings';
import Analytics from './components/Analytics';
import NotificationCenter from './components/NotificationCenter';
import KeyboardShortcutsDialog from './components/KeyboardShortcutsDialog';
import DashboardOverview from './components/DashboardOverview';
import RecentActivityFeed from './components/RecentActivityFeed';
import { Search, Bell } from 'lucide-react';
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from 'react';

function App() {
  const tabsRef = useRef<any>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Navigation shortcuts
      if (!e.ctrlKey && !e.altKey && !e.metaKey) {
        switch (e.key.toLowerCase()) {
          case '?':
            e.preventDefault();
            const shortcutsBtn = document.querySelector('[title="Keyboard shortcuts (Press ?)"]') as HTMLButtonElement;
            shortcutsBtn?.click();
            break;
          case 'm':
            e.preventDefault();
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'Missions' }));
            break;
          case 'a':
            e.preventDefault();
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'Analytics' }));
            break;
          case 's':
            e.preventDefault();
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'Settings' }));
            break;
          case 'h':
            e.preventDefault();
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'Systems' }));
            break;
          case 'n':
            e.preventDefault();
            const newTaskBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('NEW TASK')) as HTMLButtonElement;
            newTaskBtn?.click();
            break;
          case 'escape':
            break;
        }
      }

      // Export/Import shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'e':
            e.preventDefault();
            const exportBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.getAttribute('title')?.includes('Export')) as HTMLButtonElement;
            exportBtn?.click();
            break;
          case 'i':
            e.preventDefault();
            const importBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.getAttribute('title')?.includes('Import')) as HTMLButtonElement;
            importBtn?.click();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    // Listen for navigation events
    const handleNavigate = (e: any) => {
      const tabValue = e.detail;
      const tabTrigger = Array.from(document.querySelectorAll('[role="tab"]')).find(tab => tab.textContent?.trim() === tabValue) as HTMLButtonElement;
      tabTrigger?.click();
    };

    window.addEventListener('navigate', handleNavigate);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('navigate', handleNavigate);
    };
  }, []);

  return (
    <Tabs defaultValue="Dashboard" className="flex min-h-screen bg-background text-foreground" orientation="vertical">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-sm font-semibold">Dashboard</h2>
          </div>

          <div className="flex items-center gap-2">
             <div className="relative w-64 mr-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search..."
                className="pl-9 h-8 bg-muted/50 border-transparent focus:bg-background focus:border-input text-sm"
              />
            </div>
            <KeyboardShortcutsDialog />
            <NotificationCenter />
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-hidden bg-muted/30 p-6">
          {/* DASHBOARD TAB */}
          <TabsContent value="Dashboard" className="mt-0 h-full w-full animate-in fade-in duration-300 data-[state=inactive]:hidden focus-visible:outline-none overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              <DashboardOverview />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6">
                  <UserManager />
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RecentActivityFeed />
                    <div className="space-y-6">
                      <ActivityLog />
                      <SystemHealth />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* MISSIONS TAB */}
          <TabsContent value="Missions" className="mt-0 h-full w-full flex animate-in fade-in duration-300 data-[state=inactive]:hidden focus-visible:outline-none">
             <div className="w-72 border-r border-border p-4 overflow-auto shrink-0 bg-background">
                <UserManager />
             </div>
             <div className="flex-1 p-6 overflow-auto">
                <KanbanBoard />
             </div>
          </TabsContent>

          {/* TEMPLATES TAB */}
          <TabsContent value="Templates" className="mt-0 h-full w-full animate-in fade-in duration-300 data-[state=inactive]:hidden focus-visible:outline-none overflow-auto">
             <div className="max-w-6xl mx-auto">
                <TaskTemplates />
             </div>
          </TabsContent>

          {/* TIMELINE TAB */}
          <TabsContent value="Timeline" className="mt-0 h-full w-full animate-in fade-in duration-300 data-[state=inactive]:hidden focus-visible:outline-none overflow-auto">
             <div className="max-w-full">
                <GanttChart />
             </div>
          </TabsContent>

          {/* MEMORY TAB */}
          <TabsContent value="Memory" className="mt-0 h-full w-full flex animate-in fade-in duration-300 data-[state=inactive]:hidden focus-visible:outline-none">
            <div className="w-72 border-r border-border p-4 overflow-auto shrink-0 bg-background">
               <UserManager />
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <WorkspaceExplorer />
            </div>
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="Analytics" className="mt-0 h-full w-full animate-in fade-in duration-300 data-[state=inactive]:hidden focus-visible:outline-none overflow-auto">
            <div className="max-w-7xl mx-auto">
              <Analytics />
            </div>
          </TabsContent>

          {/* SYSTEMS TAB */}
          <TabsContent value="Systems" className="mt-0 h-full w-full animate-in fade-in duration-300 data-[state=inactive]:hidden focus-visible:outline-none">
             <div className="max-w-4xl mx-auto w-full">
                <SystemHealth />
             </div>
          </TabsContent>
          
           {/* SECURITY TAB */}
           <TabsContent value="Security" className="mt-0 h-full w-full animate-in fade-in duration-300 data-[state=inactive]:hidden focus-visible:outline-none">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl mx-auto">
                <SystemHealth />
                <UserManager />
              </div>
          </TabsContent>
          
          <TabsContent value="Settings" className="mt-0 h-full animate-in fade-in duration-300 data-[state=inactive]:hidden focus-visible:outline-none overflow-auto">
             <div className="max-w-4xl mx-auto">
                <Settings />
             </div>
          </TabsContent>
        </div>
      </main>
    </Tabs>
  );
}

export default App;
