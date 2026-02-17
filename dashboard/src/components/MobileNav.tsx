import { LayoutDashboard, CheckSquare, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MobileNav() {
  const handleNavClick = (tabValue: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: tabValue }));
  };

  const handleNewTask = () => {
    const newTaskBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('New Mission')) as HTMLButtonElement;
    newTaskBtn?.click();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
      <div className="mx-4 mb-4 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-2 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl w-12 h-12"
          onClick={() => handleNavClick('Dashboard')}
        >
          <LayoutDashboard size={24} strokeWidth={1.5} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl w-12 h-12"
          onClick={() => handleNavClick('Missions')}
        >
          <CheckSquare size={24} strokeWidth={1.5} />
        </Button>

        <div className="relative -top-6">
          <Button 
            className="w-14 h-14 rounded-full bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/20 flex items-center justify-center border-4 border-[#09090b]"
            onClick={handleNewTask}
          >
            <Plus size={28} />
          </Button>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl w-12 h-12"
          onClick={() => handleNavClick('Timeline')}
        >
          <Calendar size={24} strokeWidth={1.5} />
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl w-12 h-12"
          onClick={() => handleNavClick('Settings')}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-[1px]">
            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-white">
              V
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
}
