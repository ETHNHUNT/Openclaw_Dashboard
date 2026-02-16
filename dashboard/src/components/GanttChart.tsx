import { useState, useEffect } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Task {
  id: string;
  title: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const priorityHeight: Record<string, number> = {
  High: 24,
  Medium: 20,
  Low: 16,
};

const priorityColors: Record<string, string> = {
  High: 'fill-red-500',
  Medium: 'fill-amber-500',
  Low: 'fill-cyan-500',
};

const statusColors: Record<string, string> = {
  Planning: 'bg-slate-500/30 border-slate-500',
  'In Progress': 'bg-blue-500/30 border-blue-500',
  Done: 'bg-green-500/30 border-green-500',
};

export default function GanttChart() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    switch (view) {
      case 'week':
        start.setDate(now.getDate() - now.getDay());
        end.setDate(start.getDate() + 7);
        break;
      case 'day':
        end.setDate(now.getDate() + 1);
        break;
      default: // month
        start.setDate(1);
        end.setMonth(now.getMonth() + 1, 0);
    }

    return { start, end };
  };

  const getDaysInRange = () => {
    const { start, end } = getDateRange();
    const days = [];
    const current = new Date(start);

    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const getTaskPosition = (task: Task, days: Date[]) => {
    const createdDate = new Date(task.createdAt);
    const updatedDate = new Date(task.updatedAt);

    let startIndex = days.findIndex(d => d.toDateString() === createdDate.toDateString());
    let endIndex = days.findIndex(d => d.toDateString() === updatedDate.toDateString());

    if (startIndex === -1) startIndex = 0;
    if (endIndex === -1) endIndex = Math.min(days.length - 1, startIndex + 3);

    return {
      startIndex: Math.max(0, startIndex),
      endIndex: Math.min(days.length - 1, endIndex),
      daysSpanned: Math.max(1, endIndex - startIndex + 1),
    };
  };

  const days = getDaysInRange();
  const dayWidth = view === 'day' ? 120 : view === 'week' ? 40 : 20;

  if (loading) {
    return (
      <Card className="bg-eth-900 border-eth-700">
        <CardHeader className="pb-6 border-b border-eth-700/50">
          <CardTitle>GANTT CHART</CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="text-center text-eth-500">Loading timeline...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-eth-900 border-eth-700">
      <CardHeader className="pb-6 border-b border-eth-700/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Calendar className="text-eth-accent" size={28} />
              PROJECT TIMELINE
            </CardTitle>
            <CardDescription className="text-eth-500 mt-2">
              Gantt chart view of task progress over time
            </CardDescription>
          </div>
          <Tabs value={view} onValueChange={(v: any) => setView(v)} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-3 bg-eth-800">
              <TabsTrigger value="day" className="text-xs">Day</TabsTrigger>
              <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
              <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="pt-8">
        <div className="overflow-x-auto">
          {/* Header with dates */}
          <div className="min-w-max">
            <div className="flex gap-1 mb-6">
              <div className="w-48 shrink-0">
                <p className="text-xs font-bold text-eth-600 uppercase tracking-widest px-4 py-2">
                  Task Name
                </p>
              </div>
              <div className="flex gap-1">
                {days.map((day, idx) => (
                  <div key={idx} style={{ width: dayWidth }}>
                    <div className="text-[10px] font-mono text-eth-600 text-center py-2 border-b border-eth-700">
                      {view === 'day'
                        ? day.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                        : day.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Task rows */}
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="text-center py-12 text-eth-500">
                  No tasks to display
                </div>
              ) : (
                tasks.map((task) => {
                  const pos = getTaskPosition(task, days);
                  const startOffset = pos.startIndex * dayWidth;

                  return (
                    <div key={task.id} className="flex gap-1 items-center">
                      {/* Task name */}
                      <div className="w-48 shrink-0">
                        <div className="px-4 py-2 text-sm font-medium text-white truncate hover:text-eth-accent transition-colors cursor-help" title={task.title}>
                          {task.title.substring(0, 20)}
                        </div>
                      </div>

                      {/* Timeline bar */}
                      <div className="relative" style={{ width: days.length * dayWidth, height: 32 }}>
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex gap-1 pointer-events-none">
                          {days.map((_, idx) => (
                            <div
                              key={idx}
                              style={{ width: dayWidth }}
                              className="border-r border-eth-700/20"
                            />
                          ))}
                        </div>

                        {/* Task bar */}
                        <div
                          className={`absolute h-6 rounded-md border transition-all hover:opacity-100 opacity-80 ${
                            statusColors[task.status]
                          }`}
                          style={{
                            left: startOffset,
                            width: pos.daysSpanned * dayWidth - 4,
                            top: '3px',
                          }}
                          title={`${task.title} - ${task.status}`}
                        >
                          <div className="px-2 py-1 flex items-center gap-1 h-full">
                            <div className={`w-1.5 h-1.5 rounded-full ${priorityColors[task.priority]}`} />
                            <span className="text-[10px] font-bold text-white truncate">
                              {task.status === 'Done' ? '✓' : task.status.charAt(0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Legend */}
            <div className="mt-8 pt-6 border-t border-eth-700 flex gap-8">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-eth-600 font-bold uppercase">Status:</span>
                <div className="flex gap-4">
                  {Object.entries(statusColors).map(([status, color]) => (
                    <div key={status} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded border ${color}`} />
                      <span className="text-xs text-eth-500">{status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-eth-600 font-bold uppercase">Priority:</span>
                <div className="flex gap-4">
                  {Object.entries(priorityColors).map(([priority, color]) => (
                    <div key={priority} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${color}`} />
                      <span className="text-xs text-eth-500">{priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline stats */}
        <div className="mt-8 grid grid-cols-4 gap-4 pt-6 border-t border-eth-700">
          <div className="p-4 bg-eth-800 rounded-lg">
            <p className="text-xs text-eth-600 font-bold uppercase">Total Tasks</p>
            <p className="text-2xl font-bold text-eth-accent mt-2">{tasks.length}</p>
          </div>
          <div className="p-4 bg-eth-800 rounded-lg">
            <p className="text-xs text-eth-600 font-bold uppercase">Completed</p>
            <p className="text-2xl font-bold text-green-400 mt-2">
              {tasks.filter(t => t.status === 'Done').length}
            </p>
          </div>
          <div className="p-4 bg-eth-800 rounded-lg">
            <p className="text-xs text-eth-600 font-bold uppercase">In Progress</p>
            <p className="text-2xl font-bold text-blue-400 mt-2">
              {tasks.filter(t => t.status === 'In Progress').length}
            </p>
          </div>
          <div className="p-4 bg-eth-800 rounded-lg">
            <p className="text-xs text-eth-600 font-bold uppercase">Upcoming</p>
            <p className="text-2xl font-bold text-slate-400 mt-2">
              {tasks.filter(t => t.status === 'Planning').length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
