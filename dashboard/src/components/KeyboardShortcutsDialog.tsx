import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Keyboard, X } from 'lucide-react';

interface Shortcut {
  keys: string;
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  // Navigation
  { keys: 'M', description: 'Go to Missions (Kanban)', category: 'Navigation' },
  { keys: 'A', description: 'Go to Analytics', category: 'Navigation' },
  { keys: 'S', description: 'Go to Settings', category: 'Navigation' },
  { keys: 'H', description: 'Go to Health', category: 'Navigation' },
  
  // Task Management
  { keys: 'N', description: 'New Task', category: 'Task Management' },
  { keys: 'D', description: 'Duplicate selected task', category: 'Task Management' },
  { keys: 'E', description: 'Edit selected task', category: 'Task Management' },
  { keys: 'Delete', description: 'Delete selected task', category: 'Task Management' },
  
  // General
  { keys: '?', description: 'Show keyboard shortcuts', category: 'General' },
  { keys: 'Esc', description: 'Close dialogs/modals', category: 'General' },
  { keys: 'Ctrl + E', description: 'Export tasks', category: 'General' },
  { keys: 'Ctrl + I', description: 'Import tasks', category: 'General' },
];

export default function KeyboardShortcutsDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-eth-600 hover:text-eth-accent"
          title="Keyboard shortcuts (Press ?)"
        >
          <Keyboard size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-eth-900 border-eth-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-eth-accent flex items-center gap-2">
            <Keyboard size={20} />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription className="text-eth-500">
            Quick commands to navigate and manage tasks
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-bold text-eth-accent uppercase tracking-widest mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter(s => s.category === category)
                  .map((shortcut, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-eth-400">{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-eth-800 border border-eth-700 rounded text-eth-accent text-xs font-mono">
                        {shortcut.keys}
                      </kbd>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-eth-700 text-xs text-eth-600">
          ℹ️ Shortcuts work globally across the dashboard
        </div>
      </DialogContent>
    </Dialog>
  );
}
