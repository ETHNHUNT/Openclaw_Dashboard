import { useState, useEffect } from 'react';
import { Target, Clock, TrendingUp, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DashboardStats {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  completionRate: number;
  highPriorityCount: number;
  recentlyCompleted: number;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    highPriorityCount: 0,
    recentlyCompleted: 0,
  });

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const tasks = await res.json();
        
        const total = tasks.length;
        const active = tasks.filter((t: any) => t.status === 'In Progress').length;
        const completed = tasks.filter((t: any) => t.status === 'Done').length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        const highPriority = tasks.filter((t: any) => t.priority === 'High').length;
        
        // Recently completed (last 24h)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recent = tasks.filter((t: any) => 
          t.status === 'Done' && new Date(t.updatedAt) > oneDayAgo
        ).length;

        setStats({
          totalTasks: total,
          activeTasks: active,
          completedTasks: completed,
          completionRate,
          highPriorityCount: highPriority,
          recentlyCompleted: recent,
        });
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const metrics = [
    {
      title: 'Total Missions',
      value: stats.totalTasks,
      icon: Target,
      className: 'text-blue-400',
      gradient: 'from-blue-500/20 to-blue-600/5',
    },
    {
      title: 'Active',
      value: stats.activeTasks,
      icon: Activity,
      className: 'text-amber-400',
      gradient: 'from-amber-500/20 to-amber-600/5',
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      icon: CheckCircle2,
      className: 'text-emerald-400',
      gradient: 'from-emerald-500/20 to-emerald-600/5',
    },
    {
      title: 'High Priority',
      value: stats.highPriorityCount,
      icon: AlertCircle,
      className: 'text-rose-400',
      gradient: 'from-rose-500/20 to-rose-600/5',
    },
  ];

  return (
    <div className="space-y-6">
      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className="flash-card relative overflow-hidden rounded-xl p-6 group">
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      {metric.title}
                    </p>
                    <div className="text-3xl font-bold text-white tracking-tight">
                      {metric.value}
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-zinc-900/50 border border-white/5 ${metric.className} shadow-lg`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            )
        })}
      </div>

      {/* PROGRESS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-xl p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-white">Completion Velocity</h3>
              <p className="text-xs text-zinc-500">Task completion rate over time</p>
            </div>
            <TrendingUp className="h-4 w-4 text-zinc-400" />
          </div>
          <div>
            <div className="flex items-end gap-2 mb-2">
              <div className="text-4xl font-bold text-white">{stats.completionRate}%</div>
              <div className="text-xs text-emerald-400 mb-1.5 font-medium flex items-center">
                +12% <span className="text-zinc-500 ml-1 font-normal">vs last week</span>
              </div>
            </div>
            <Progress value={stats.completionRate} className="h-2 bg-zinc-800" />
            <div className="mt-4 flex justify-between text-xs text-zinc-500 font-mono">
              <span>{stats.completedTasks} Done</span>
              <span>{stats.totalTasks} Total</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-white">Mission Status</h3>
              <p className="text-xs text-zinc-500">Current workload distribution</p>
            </div>
            <Clock className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between group cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)] group-hover:scale-125 transition-transform"></div>
                <span className="text-sm text-zinc-300">Active Missions</span>
              </div>
              <span className="text-sm font-mono text-white bg-zinc-800 px-2 py-0.5 rounded">{stats.activeTasks}</span>
            </div>
            <div className="flex items-center justify-between group cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.5)] group-hover:scale-125 transition-transform"></div>
                <span className="text-sm text-zinc-300">High Priority</span>
              </div>
              <span className="text-sm font-mono text-white bg-zinc-800 px-2 py-0.5 rounded">{stats.highPriorityCount}</span>
            </div>
            <div className="flex items-center justify-between group cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover:scale-125 transition-transform"></div>
                <span className="text-sm text-zinc-300">Completed</span>
              </div>
              <span className="text-sm font-mono text-white bg-zinc-800 px-2 py-0.5 rounded">{stats.completedTasks}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
