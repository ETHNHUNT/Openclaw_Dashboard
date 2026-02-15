import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';
import WorkspaceExplorer from './components/WorkspaceExplorer';
import UserManager from './components/UserManager';
import ActivityLog from './components/ActivityLog';
import SystemHealth from './components/SystemHealth';
import { Search, Bell, Shield, Activity } from 'lucide-react';
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

function App() {
  return (
    <Tabs defaultValue="Dashboard" className="flex min-h-screen bg-eth-950 text-eth-300" orientation="vertical">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-eth-900/80 border-b border-eth-700 px-8 flex items-center justify-between shrink-0 backdrop-blur z-20">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-eth-500" size={16} />
              <Input 
                placeholder="Search missions, data, or logs..."
                className="pl-10 h-9 bg-eth-800 border-eth-700 rounded-full text-sm text-white focus-visible:ring-eth-accent placeholder:text-eth-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="text-eth-500 hover:text-white relative hover:bg-eth-800">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse-eth" />
              </Button>
              <Button variant="ghost" size="icon" className="text-eth-500 hover:text-white hover:bg-eth-800">
                <Shield size={20} />
              </Button>
            </div>
            
            <div className="h-8 w-[1px] bg-eth-700" />

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-white leading-none uppercase tracking-tight">VIPIN</p>
                <p className="text-[10px] text-eth-accent font-mono tracking-tighter uppercase">Level 4 Clearance</p>
              </div>
              <Avatar className="h-9 w-9 bg-gradient-to-br from-eth-accent to-cyan-600 rounded-lg flex items-center justify-center text-eth-950 font-bold text-lg cursor-pointer hover:opacity-90 transition-opacity">
                V
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-hidden bg-eth-950">
          {/* DASHBOARD TAB */}
          <TabsContent value="Dashboard" className="mt-0 h-full w-full flex animate-in fade-in duration-500 data-[state=inactive]:hidden focus-visible:outline-none">
            {/* LEFT: Agent Squad */}
            <div className="w-80 border-r border-eth-700/50 p-6 overflow-auto shrink-0 bg-eth-900/20">
              <h2 className="text-[10px] font-bold text-eth-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Shield className="text-eth-accent" size={12} />
                Active Agent Squad
              </h2>
              <UserManager />
            </div>

            {/* CENTER: Mission Command */}
            <div className="flex-1 p-6 overflow-auto bg-eth-950 border-r border-eth-700/50">
               <h2 className="text-[10px] font-bold text-eth-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Activity className="text-eth-accent" size={12} />
                Mission Command Center
              </h2>
              <KanbanBoard />
            </div>

            {/* RIGHT: Live Audit */}
            <div className="w-80 p-6 overflow-auto shrink-0 bg-eth-900/20">
              <h2 className="text-[10px] font-bold text-eth-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Activity className="text-eth-accent" size={12} />
                Live Tactical Intel
              </h2>
              <ActivityLog />
              <div className="mt-8">
                <SystemHealth />
              </div>
            </div>
          </TabsContent>

          {/* MISSIONS TAB */}
          <TabsContent value="Missions" className="mt-0 h-full w-full flex animate-in slide-in-from-bottom-4 duration-500 data-[state=inactive]:hidden focus-visible:outline-none">
             <div className="w-80 border-r border-eth-700/50 p-6 overflow-auto shrink-0 bg-eth-900/20">
                <UserManager />
             </div>
             <div className="flex-1 p-8 overflow-auto">
                <KanbanBoard />
             </div>
          </TabsContent>

          {/* MEMORY TAB */}
          <TabsContent value="Memory" className="mt-0 h-full w-full flex animate-in slide-in-from-bottom-4 duration-500 data-[state=inactive]:hidden focus-visible:outline-none">
            <div className="w-80 border-r border-eth-700/50 p-6 overflow-auto shrink-0 bg-eth-900/20">
               <UserManager />
            </div>
            <div className="flex-1 p-8 overflow-auto">
              <WorkspaceExplorer />
            </div>
          </TabsContent>

          {/* SYSTEMS TAB */}
          <TabsContent value="Systems" className="mt-0 h-full w-full flex animate-in slide-in-from-bottom-4 duration-500 data-[state=inactive]:hidden focus-visible:outline-none p-8">
             <div className="max-w-4xl mx-auto w-full">
                <SystemHealth />
             </div>
          </TabsContent>
          
           {/* SECURITY TAB */}
           <TabsContent value="Security" className="mt-0 h-full w-full flex animate-in slide-in-from-bottom-4 duration-500 data-[state=inactive]:hidden focus-visible:outline-none p-8">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full h-fit">
                <SystemHealth />
                <UserManager />
              </div>
          </TabsContent>
          
          <TabsContent value="Settings" className="mt-0 h-full animate-in slide-in-from-bottom-4 duration-500 data-[state=inactive]:hidden focus-visible:outline-none">
             <div className="flex items-center justify-center h-64 text-eth-600 font-mono text-xs tracking-widest">
                SETTINGS_MODULE_LOCKED // UNDER_CONSTRUCTION
             </div>
          </TabsContent>
        </div>
      </main>
    </Tabs>
  );
}

export default App;
