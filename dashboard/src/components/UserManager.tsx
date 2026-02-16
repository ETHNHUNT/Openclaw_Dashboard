import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  status: 'Online' | 'Busy' | 'Offline' | 'Idle';
  avatar: string;
}

const statusColors: Record<string, string> = {
  Online: 'bg-green-500',
  Busy: 'bg-rose-500',
  Offline: 'bg-eth-500',
  Idle: 'bg-amber-500',
};

export default function UserManager() {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch('/api/agents');
        if (res.ok) {
          const data = await res.json();
          // Add VIPIN (User) manually if not in MD, or assume MD is complete team
          // Assuming MD is complete for AI team. Adding VIPIN manually as lead.
          const user: Agent = { id: '0', name: 'VIPIN', role: 'Investigator', model: 'Human', status: 'Online', avatar: '' };
          setAgents([user, ...data]);
        }
      } catch (err) {
        console.error("Failed to fetch agents", err);
      }
    };
    fetchAgents();
    // Poll infrequently
    const interval = setInterval(fetchAgents, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {agents.map((agent) => (
        <div key={agent.id} className="flex items-center gap-4 p-3 rounded-lg bg-eth-800/40 border border-eth-700/50 hover:border-eth-accent/30 transition-all group cursor-default">
          <div className="relative">
            <Avatar className="h-10 w-10 border border-eth-700">
              <AvatarFallback className="bg-eth-700 text-eth-accent font-bold">{agent.name[0]}</AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-eth-900 ${statusColors[agent.status] || 'bg-gray-500'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white truncate group-hover:text-eth-accent transition-colors">{agent.name}</h3>
              <span className="text-[10px] font-mono text-eth-500">{agent.status.toUpperCase()}</span>
            </div>
            <p className="text-[11px] text-eth-500 font-medium uppercase tracking-tight truncate" title={agent.role}>{agent.role}</p>
            {agent.model !== 'Human' && (
              <p className="text-[9px] text-eth-600 font-mono mt-0.5 truncate">{agent.model}</p>
            )}
          </div>
        </div>
      ))}
      
      <button className="w-full py-2 border border-dashed border-eth-700 rounded-lg text-[10px] font-bold text-eth-600 hover:text-eth-accent hover:border-eth-accent/50 transition-all uppercase tracking-widest">
        + Deploy Sub-Agent
      </button>
    </div>
  );
}
