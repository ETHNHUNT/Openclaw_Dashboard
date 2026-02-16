import { Search, Home, FileText, Settings, Zap, Shield, Database, BarChart3, Copy, Calendar } from 'lucide-react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs"

const navItems = [
  { icon: Home, label: 'Dashboard' },
  { icon: FileText, label: 'Missions' },
  { icon: Copy, label: 'Templates' },
  { icon: Calendar, label: 'Timeline' },
  { icon: Database, label: 'Memory' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Shield, label: 'Security' },
  { icon: Zap, label: 'Systems' },
  { icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-eth-900 border-r border-eth-700 h-screen flex flex-col shrink-0">
      {/* Branding */}
      <div className="p-6 border-b border-eth-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-eth-accent/20 rounded-lg flex items-center justify-center">
            <Search className="text-eth-accent" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wider leading-none">ETHNHUNT</h1>
            <p className="text-[10px] text-eth-accent font-mono mt-1">AI CHIEF OF STAFF</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <TabsList className="flex flex-col h-auto bg-transparent space-y-1 w-full p-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <TabsTrigger 
                key={item.label} 
                value={item.label}
                className="w-full justify-start gap-3 px-4 py-3 h-auto text-sm font-medium data-[state=active]:bg-eth-accent/10 data-[state=active]:text-eth-accent data-[state=active]:border-eth-accent/30 border border-transparent rounded-xl transition-all hover:bg-eth-800 hover:text-eth-300"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      {/* Status Footer */}
      <div className="p-6 border-t border-eth-700 bg-eth-900/50">
        <div className="flex items-center gap-2 text-[10px] text-eth-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <span className="font-mono tracking-widest uppercase">Agent Online</span>
        </div>
        <div className="mt-4 flex flex-col gap-1">
           <div className="flex justify-between text-[9px] font-mono text-eth-600 uppercase">
              <span>Uptime</span>
              <span>12:42:01</span>
           </div>
           <div className="h-1 bg-eth-800 rounded-full overflow-hidden">
              <div className="h-full bg-eth-accent w-3/4" />
           </div>
        </div>
      </div>
    </aside>
  );
}
