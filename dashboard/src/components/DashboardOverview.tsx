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
      icon: <Target className="text-eth-accent" size={20} />,
      color: 'text-eth-accent',
      bg: 'bg-eth-accent/10',
      border: 'border-eth-accent/30',
    },
    {
      title: 'Active',
      value: stats.activeTasks,
      icon: <Activity className="text-amber-400" size={20} />,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      icon: <CheckCircle2 className="text-emerald-400" size={20} />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
    },
    {
      title: 'High Priority',
      value: stats.highPriorityCount,
      icon: <AlertCircle className="text-rose-400" size={20} />,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <Card key={idx} className={`${metric.bg} border ${metric.border}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-eth-900/50 rounded-lg">
                  {metric.icon}
                </div>
                <span className={`text-3xl font-bold ${metric.color}`}>
                  {metric.value}
                </span>
              </div>
              <p className="text-xs font-bold text-eth-500 uppercase tracking-widest">
                {metric.title}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PROGRESS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-eth-900 border-eth-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <TrendingUp className="text-eth-accent" size={16} />
              Completion Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{stats.completionRate}%</span>
                <span className="text-xs text-eth-500">
                  {stats.completedTasks} / {stats.totalTasks} missions
                </span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />
              <p className="text-xs text-eth-500">
                {stats.recentlyCompleted} completed in the last 24 hours
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-eth-900 border-eth-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Clock className="text-eth-accent" size={16} />
              Mission Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <span className="text-sm text-eth-300">Active Missions</span>
                </div>
                <span className="text-sm font-bold text-white">{stats.activeTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-rose-400 rounded-full"></div>
                  <span className="text-sm text-eth-300">High Priority</span>
                </div>
                <span className="text-sm font-bold text-white">{stats.highPriorityCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm text-eth-300">Completed</span>
                </div>
                <span className="text-sm font-bold text-white">{stats.completedTasks}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
