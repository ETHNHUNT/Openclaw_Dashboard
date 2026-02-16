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
      className: 'text-blue-500',
    },
    {
      title: 'Active',
      value: stats.activeTasks,
      icon: Activity,
      className: 'text-amber-500',
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      icon: CheckCircle2,
      className: 'text-emerald-500',
    },
    {
      title: 'High Priority',
      value: stats.highPriorityCount,
      icon: AlertCircle,
      className: 'text-rose-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <Card key={idx}>
                <CardContent className="p-6 flex items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <div className="text-2xl font-bold">
                      {metric.value}
                    </div>
                  </div>
                  <div className={`p-2 bg-secondary rounded-full ${metric.className}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            )
        })}
      </div>

      {/* PROGRESS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedTasks} of {stats.totalTasks} missions completed
            </p>
            <Progress value={stats.completionRate} className="mt-4 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mission Status
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium">Active Missions</span>
                </div>
                <span className="text-sm text-muted-foreground">{stats.activeTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                  <span className="text-sm font-medium">High Priority</span>
                </div>
                <span className="text-sm text-muted-foreground">{stats.highPriorityCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <span className="text-sm text-muted-foreground">{stats.completedTasks}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
