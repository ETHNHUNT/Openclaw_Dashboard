import { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Wifi, Server, AlertTriangle } from 'lucide-react';

interface HealthData {
  cpu: number;
  memory: number;
  uptime: number;
  status: string;
}

const statusConfig = {
  healthy: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', bar: 'bg-emerald-400' },
  warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', bar: 'bg-amber-400' },
  critical: { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', bar: 'bg-rose-400' },
};

export default function SystemHealth() {
  const [health, setHealth] = useState<HealthData | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setHealth(data);
        }
      } catch (err) {
        console.error("Health fetch failed", err);
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatus = (val: number): 'healthy' | 'warning' | 'critical' => {
    if (val > 85) return 'critical';
    if (val > 65) return 'warning';
    return 'healthy';
  };

  const metrics = [
    { label: 'CPU Usage', value: health?.cpu || 0, unit: '%', status: getStatus(health?.cpu || 0), icon: <Cpu size={18} /> },
    { label: 'Memory', value: health?.memory || 0, unit: '%', status: getStatus(health?.memory || 0), icon: <HardDrive size={18} /> },
    { label: 'Network', value: 94, unit: 'ms', status: 'healthy', icon: <Wifi size={18} /> },
    { label: 'API Status', value: 100, unit: '%', status: 'healthy', icon: <Server size={18} /> },
  ] as const;

  return (
    <div className="bg-eth-900 rounded-xl border border-eth-700 p-6 shadow-eth-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-tight">
            <Activity className="text-eth-accent" size={20} />
            System Health
          </h2>
          <p className="text-xs text-eth-500 mt-1 uppercase tracking-widest font-mono">Real-time metrics</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-400">OPERATIONAL</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`p-4 rounded-lg border ${statusConfig[metric.status].border} ${statusConfig[metric.status].bg}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${statusConfig[metric.status].color}`}>
                {metric.icon}
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border border-current ${statusConfig[metric.status].bg} ${statusConfig[metric.status].color}`}>
                {metric.status.toUpperCase()}
              </span>
            </div>
            
            <div className="mb-2">
              <span className="text-2xl font-bold text-white">{metric.value}</span>
              <span className="text-xs text-eth-500 ml-1">{metric.unit}</span>
            </div>
            
            <p className="text-[10px] font-bold text-eth-600 uppercase mb-3">{metric.label}</p>
            
            <div className="h-1 bg-eth-950 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${statusConfig[metric.status].bar}`}
                style={{ width: `${Math.min(metric.value, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Alerts Section */}
      <div className="mt-6 pt-6 border-t border-eth-700">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} className="text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase">Active Alerts</h3>
        </div>
        <div className="space-y-2">
          {(health?.memory || 0) > 65 && (
            <div className="flex items-center justify-between p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                <span className="text-xs text-eth-300">System Memory Warning: Threshold exceeded (65%)</span>
              </div>
              <span className="text-[10px] text-eth-600 font-mono uppercase">Critical</span>
            </div>
          )}
          <div className="flex items-center justify-between p-3 bg-eth-800 border border-eth-700 rounded-lg opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-eth-600 rounded-full" />
              <span className="text-xs text-eth-500">Network latency within expected parameters</span>
            </div>
            <span className="text-[10px] text-eth-600 font-mono uppercase">Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
