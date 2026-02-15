import { Target, Clock, CheckCircle } from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  status: 'active' | 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
  progress: number;
  eta: string;
}

const missions: Mission[] = [
  { id: 'M-001', title: 'Blockchain Analysis', status: 'active', priority: 'high', progress: 73, eta: '2h 15m' },
  { id: 'M-002', title: 'Wallet Tracking', status: 'active', priority: 'medium', progress: 45, eta: '4h 30m' },
  { id: 'M-003', title: 'Pattern Recognition', status: 'pending', priority: 'high', progress: 0, eta: 'Queued' },
  { id: 'M-004', title: 'Smart Contract Audit', status: 'completed', priority: 'medium', progress: 100, eta: 'Done' },
  { id: 'M-005', title: 'Transaction Forensics', status: 'active', priority: 'high', progress: 89, eta: '45m' },
  { id: 'M-006', title: 'Network Mapping', status: 'pending', priority: 'low', progress: 0, eta: 'Queued' },
];

const statusConfig = {
  active: { icon: Target, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  completed: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
};

const priorityConfig = {
  high: 'text-rose-400',
  medium: 'text-amber-400',
  low: 'text-slate-400',
};

export default function MissionStatus() {
  const activeCount = missions.filter(m => m.status === 'active').length;
  const pendingCount = missions.filter(m => m.status === 'pending').length;
  const completedCount = missions.filter(m => m.status === 'completed').length;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="text-cyan-400" size={20} />
            Mission Status
          </h2>
          <p className="text-sm text-slate-500 mt-1">Active investigations and operations</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full" />
            <span className="text-slate-400">{activeCount} Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full" />
            <span className="text-slate-400">{pendingCount} Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            <span className="text-slate-400">{completedCount} Done</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {missions.map((mission) => {
          const StatusIcon = statusConfig[mission.status].icon;
          return (
            <div
              key={mission.id}
              className={`p-4 rounded-lg border ${statusConfig[mission.status].border} ${statusConfig[mission.status].bg} transition-all duration-200 hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StatusIcon className={statusConfig[mission.status].color} size={16} />
                  <span className="text-xs font-mono text-slate-500">{mission.id}</span>
                </div>
                <span className={`text-xs font-medium ${priorityConfig[mission.priority]}`}>
                  {mission.priority.toUpperCase()}
                </span>
              </div>
              
              <h3 className="text-sm font-medium text-white mb-2">{mission.title}</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Progress</span>
                  <span className="text-slate-300">{mission.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      mission.status === 'completed' ? 'bg-emerald-400' : 'bg-cyan-400'
                    }`}
                    style={{ width: `${mission.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">ETA</span>
                  <span className="text-slate-300 font-mono">{mission.eta}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
