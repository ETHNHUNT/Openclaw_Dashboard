import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity, Target, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  planning: number;
  inProgress: number;
  done: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  completionRate: number;
  avgCompletionTime: string;
}

export default function Analytics() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    planning: 0,
    inProgress: 0,
    done: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    completionRate: 0,
    avgCompletionTime: 'N/A',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks');
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
          calculateStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculateStats = (taskData: Task[]) => {
    const total = taskData.length;
    const planning = taskData.filter(t => t.status === 'Planning').length;
    const inProgress = taskData.filter(t => t.status === 'In Progress').length;
    const done = taskData.filter(t => t.status === 'Done').length;
    
    const highPriority = taskData.filter(t => t.priority === 'High').length;
    const mediumPriority = taskData.filter(t => t.priority === 'Medium').length;
    const lowPriority = taskData.filter(t => t.priority === 'Low').length;

    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    // Calculate average completion time for done tasks
    const completedTasks = taskData.filter(t => t.status === 'Done');
    let avgTime = 'N/A';
    if (completedTasks.length > 0) {
      const totalTime = completedTasks.reduce((acc, task) => {
        const created = new Date(task.createdAt).getTime();
        const updated = new Date(task.updatedAt).getTime();
        return acc + (updated - created);
      }, 0);
      const avgMs = totalTime / completedTasks.length;
      const avgHours = Math.round(avgMs / (1000 * 60 * 60));
      avgTime = avgHours < 24 ? `${avgHours}h` : `${Math.round(avgHours / 24)}d`;
    }

    setStats({
      total,
      planning,
      inProgress,
      done,
      highPriority,
      mediumPriority,
      lowPriority,
      completionRate,
      avgCompletionTime: avgTime,
    });
  };

  const metricCards = [
    {
      title: 'Total Missions',
      value: stats.total,
      icon: <Target className="text-eth-accent" size={24} />,
      trend: null,
      bg: 'bg-eth-accent/10',
      border: 'border-eth-accent/30',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: <Activity className="text-amber-400" size={24} />,
      trend: null,
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    },
    {
      title: 'Completed',
      value: stats.done,
      icon: <CheckCircle2 className="text-emerald-400" size={24} />,
      trend: stats.completionRate > 50 ? 'up' : stats.completionRate > 0 ? 'down' : null,
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
    },
    {
      title: 'Pending',
      value: stats.planning,
      icon: <Clock className="text-cyan-400" size={24} />,
      trend: null,
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <BarChart3 className="text-eth-accent" size={32} />
          MISSION ANALYTICS
        </h1>
        <p className="text-eth-500 text-sm">Real-time mission performance metrics and insights</p>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, idx) => (
          <Card key={idx} className={`${metric.bg} border ${metric.border}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-eth-900/50">
                  {metric.icon}
                </div>
                {metric.trend && (
                  <div className={`flex items-center gap-1 ${metric.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {metric.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-eth-500 text-xs font-bold uppercase tracking-widest">{metric.title}</p>
                <p className="text-4xl font-bold text-white">{metric.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* COMPLETION RATE */}
      <Card className="bg-eth-900 border-eth-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-3">
                <Target className="text-eth-accent" size={20} />
                Completion Rate
              </CardTitle>
              <CardDescription className="text-eth-500 mt-1">
                Overall mission success rate
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-eth-accent">{stats.completionRate}%</p>
              <p className="text-xs text-eth-500 mt-1">{stats.done} of {stats.total} missions</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={stats.completionRate} className="h-3" />
          <div className="flex items-center justify-between mt-3 text-xs text-eth-500">
            <span>0%</span>
            <span>Target: 80%</span>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>

      {/* PRIORITY DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-eth-900 border-eth-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <AlertCircle className="text-eth-accent" size={20} />
              Priority Distribution
            </CardTitle>
            <CardDescription className="text-eth-500">
              Breakdown by priority level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-eth-300 flex items-center gap-2">
                    <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                    High Priority
                  </span>
                  <span className="text-sm font-bold text-white">{stats.highPriority}</span>
                </div>
                <Progress 
                  value={stats.total > 0 ? (stats.highPriority / stats.total) * 100 : 0} 
                  className="h-2 bg-eth-800"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-eth-300 flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    Medium Priority
                  </span>
                  <span className="text-sm font-bold text-white">{stats.mediumPriority}</span>
                </div>
                <Progress 
                  value={stats.total > 0 ? (stats.mediumPriority / stats.total) * 100 : 0} 
                  className="h-2 bg-eth-800"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-eth-300 flex items-center gap-2">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                    Low Priority
                  </span>
                  <span className="text-sm font-bold text-white">{stats.lowPriority}</span>
                </div>
                <Progress 
                  value={stats.total > 0 ? (stats.lowPriority / stats.total) * 100 : 0} 
                  className="h-2 bg-eth-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-eth-900 border-eth-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Clock className="text-eth-accent" size={20} />
              Performance Metrics
            </CardTitle>
            <CardDescription className="text-eth-500">
              Time-based analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-eth-800/50 rounded-lg border border-eth-700/50">
              <div>
                <p className="text-xs text-eth-500 uppercase tracking-widest mb-1">Avg. Completion Time</p>
                <p className="text-2xl font-bold text-white">{stats.avgCompletionTime}</p>
              </div>
              <div className="p-3 bg-eth-accent/10 rounded-lg">
                <Clock className="text-eth-accent" size={24} />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-eth-800/50 rounded-lg border border-eth-700/50">
              <div>
                <p className="text-xs text-eth-500 uppercase tracking-widest mb-1">Active Missions</p>
                <p className="text-2xl font-bold text-white">{stats.inProgress + stats.planning}</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <Activity className="text-amber-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* STATUS BREAKDOWN */}
      <Card className="bg-eth-900 border-eth-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <BarChart3 className="text-eth-accent" size={20} />
            Status Breakdown
          </CardTitle>
          <CardDescription className="text-eth-500">
            Mission workflow distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-6 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
              <p className="text-5xl font-bold text-cyan-400 mb-2">{stats.planning}</p>
              <p className="text-xs text-eth-500 uppercase tracking-widest">Planning</p>
              <p className="text-xs text-eth-600 mt-1">
                {stats.total > 0 ? Math.round((stats.planning / stats.total) * 100) : 0}% of total
              </p>
            </div>

            <div className="text-center p-6 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <p className="text-5xl font-bold text-amber-400 mb-2">{stats.inProgress}</p>
              <p className="text-xs text-eth-500 uppercase tracking-widest">In Progress</p>
              <p className="text-xs text-eth-600 mt-1">
                {stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}% of total
              </p>
            </div>

            <div className="text-center p-6 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <p className="text-5xl font-bold text-emerald-400 mb-2">{stats.done}</p>
              <p className="text-xs text-eth-500 uppercase tracking-widest">Done</p>
              <p className="text-xs text-eth-600 mt-1">
                {stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}% of total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
