import { Brain, GitCommit, ExternalLink, FileText, Shield, Zap } from 'lucide-react';

interface MemoryEvent {
  id: string;
  timestamp: string;
  type: 'analysis' | 'discovery' | 'alert' | 'action';
  title: string;
  description: string;
  source?: string;
}

const memoryEvents: MemoryEvent[] = [
  {
    id: 'E-8921',
    timestamp: '2m ago',
    type: 'discovery',
    title: 'New Pattern Detected',
    description: 'Unusual transaction clustering identified in block #18,421,093',
    source: '0x7a2...f4b1',
  },
  {
    id: 'E-8920',
    timestamp: '5m ago',
    type: 'analysis',
    title: 'Smart Contract Decompiled',
    description: 'Proxy contract analysis completed for 0x3f...9c2d',
    source: 'Etherscan API',
  },
  {
    id: 'E-8919',
    timestamp: '12m ago',
    type: 'alert',
    title: 'High-Value Transfer',
    description: '14,500 ETH moved through mixer protocol',
    source: 'Chainalysis',
  },
  {
    id: 'E-8918',
    timestamp: '18m ago',
    type: 'action',
    title: 'Monitoring Activated',
    description: 'Started tracking 23 new wallet addresses',
    source: 'User Request',
  },
  {
    id: 'E-8917',
    timestamp: '25m ago',
    type: 'analysis',
    title: 'Behavioral Analysis',
    description: 'Transaction timing patterns match known entity profile',
    source: 'Internal ML',
  },
  {
    id: 'E-8916',
    timestamp: '31m ago',
    type: 'discovery',
    title: 'Bridge Connection Found',
    description: 'Cross-chain movement detected via LayerZero protocol',
    source: '0x9b...1a4e',
  },
  {
    id: 'E-8915',
    timestamp: '45m ago',
    type: 'alert',
    title: 'Flash Loan Detected',
    description: 'Multi-pool arbitrage executed in single block',
    source: 'Mempool Monitor',
  },
  {
    id: 'E-8914',
    timestamp: '1h ago',
    type: 'action',
    title: 'Report Generated',
    description: 'Weekly investigative summary ready for review',
    source: 'Auto-Scheduler',
  },
];

const typeConfig = {
  analysis: { icon: Brain, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  discovery: { icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  alert: { icon: Shield, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  action: { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
};

export default function MemoryFeed() {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Brain className="text-cyan-400" size={20} />
            Memory Feed
          </h2>
          <p className="text-sm text-slate-500 mt-1">Recent events and discoveries</p>
        </div>
        <button className="text-xs text-cyan-400 hover:text-cyan-300 font-mono">
          View All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {memoryEvents.map((event) => {
          const TypeIcon = typeConfig[event.type].icon;
          return (
            <div
              key={event.id}
              className="p-3 rounded-lg border border-slate-800 bg-slate-800/50 hover:bg-slate-800 transition-all duration-200 group"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${typeConfig[event.type].bg} ${typeConfig[event.type].border} border`}>
                  <TypeIcon className={typeConfig[event.type].color} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-slate-500">{event.id}</span>
                    <span className="text-xs text-slate-600">{event.timestamp}</span>
                  </div>
                  <h3 className="text-sm font-medium text-white mb-1">{event.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{event.description}</p>
                  {event.source && (
                    <div className="flex items-center gap-1 mt-2">
                      <GitCommit size={10} className="text-slate-600" />
                      <span className="text-xs text-slate-600 font-mono">{event.source}</span>
                    </div>
                  )}
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-cyan-400">
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
}
