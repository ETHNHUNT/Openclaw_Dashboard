import { useState, useEffect } from 'react';
import { MoreVertical, Plus, Layers, MessageSquare, Search, Zap, Trash2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface Task {
  id: string;
  title: string;
  desc: string | null;
  status: string;
  priority: string;
  comments: any[];
}

const columns = ['Planning', 'In Progress', 'Done'];

const priorityColors: Record<string, string> = {
  High: 'bg-red-500/20 text-red-300 border-red-500/30',
  Medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Low: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
};

const priorityBgColors: Record<string, string> = {
  High: 'bg-red-500/10',
  Medium: 'bg-amber-500/10',
  Low: 'bg-cyan-500/10',
};

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', desc: '', priority: 'Medium' });

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTask = async () => {
    if (!newTask.title) return;
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        setNewTask({ title: '', desc: '', priority: 'Medium' });
        setIsAddModalOpen(false);
        fetchTasks();
      }
    } catch (err) {
      console.error("Add task failed", err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleAdvanceTask = async (task: Task) => {
    const nextStatus: Record<string, string> = {
      'Planning': 'In Progress',
      'In Progress': 'Done',
    };
    const status = nextStatus[task.status];
    if (!status) return;

    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchTasks();
    } catch (err) {
      console.error("Advance failed", err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (task.desc || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  if (loading && tasks.length === 0) {
    return (
      <Card className="bg-eth-900 border-eth-700 p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3 bg-eth-800" />
          <div className="grid grid-cols-3 gap-6">
             <Skeleton className="h-[400px] bg-eth-800 rounded-xl" />
             <Skeleton className="h-[400px] bg-eth-800 rounded-xl" />
             <Skeleton className="h-[400px] bg-eth-800 rounded-xl" />
          </div>
        </div>
      </Card>
    );
  }

  const stats = {
    active: filteredTasks.filter(t => t.status === 'In Progress').length,
    pending: filteredTasks.filter(t => t.status === 'Planning').length,
    completed: filteredTasks.filter(t => t.status === 'Done').length,
  };

  return (
    <div className="h-full">
      {/* KANBAN BOARD */}
      <Card className="bg-transparent border-none shadow-none">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 pb-6 border-b border-eth-700/50">
          <div>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Layers className="text-eth-accent" size={28} />
              MISSION BOARD
            </CardTitle>
            <CardDescription className="text-eth-500 mt-2">
              Kanban-style task orchestration & execution
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-eth-500" size={16} />
              <Input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-eth-800 border-eth-700 text-white placeholder:text-eth-500 focus-visible:ring-eth-accent focus-visible:border-eth-accent"
              />
            </div>
            
            <Select value={priorityFilter} onValueChange={(val: any) => setPriorityFilter(val)}>
              <SelectTrigger className="w-[140px] bg-eth-800 border-eth-700 text-white focus:ring-eth-accent focus:border-eth-accent">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-eth-800 border-eth-700 text-white">
                <SelectItem value="All">All Priority</SelectItem>
                <SelectItem value="High">🔴 High</SelectItem>
                <SelectItem value="Medium">🟡 Medium</SelectItem>
                <SelectItem value="Low">🔵 Low</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-eth-accent hover:bg-eth-accent-dark text-eth-900 font-bold gap-2 shrink-0 transition-all">
                  <Plus size={18} />
                  <span className="hidden sm:inline">NEW TASK</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-eth-900 border-eth-700 text-white">
                <DialogHeader>
                  <DialogTitle className="text-eth-accent">Deploy New Mission</DialogTitle>
                  <DialogDescription className="text-eth-500">
                    Define the mission parameters for the agent team.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Mission Title</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g. System Audit" 
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="bg-eth-800 border-eth-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Description</Label>
                    <Textarea 
                      id="desc" 
                      placeholder="Mission details..." 
                      value={newTask.desc}
                      onChange={(e) => setNewTask({...newTask, desc: e.target.value})}
                      className="bg-eth-800 border-eth-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newTask.priority} onValueChange={(v) => setNewTask({...newTask, priority: v})}>
                      <SelectTrigger className="bg-eth-800 border-eth-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-eth-800 border-eth-700 text-white">
                        <SelectItem value="High">🔴 High</SelectItem>
                        <SelectItem value="Medium">🟡 Medium</SelectItem>
                        <SelectItem value="Low">🔵 Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>CANCEL</Button>
                  <Button className="bg-eth-accent text-eth-900 font-bold" onClick={handleAddTask}>DEPLOY MISSION</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {columns.map((col) => (
              <div key={col} className="flex flex-col h-full">
                {/* COLUMN HEADER */}
                <div className="flex items-center justify-between mb-6 px-1 pb-4 border-b border-eth-700">
                  <h3 className="text-sm font-bold text-eth-accent uppercase tracking-widest flex items-center gap-2">
                    {col}
                    <Badge variant="secondary" className="bg-eth-800 text-eth-accent border-eth-accent/30 ml-2">
                      {filteredTasks.filter((t) => t.status === col).length}
                    </Badge>
                  </h3>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-eth-600 hover:text-eth-accent">
                    <MoreVertical size={16} />
                  </Button>
                </div>

                {/* TASKS COLUMN */}
                <div className="space-y-3 flex-1">
                  {filteredTasks
                    .filter((t) => t.status === col)
                    .map((task) => (
                      <Card 
                        key={task.id}
                        className={`${priorityBgColors[task.priority] || priorityBgColors['Medium']} bg-eth-800 border border-eth-700 hover:border-eth-accent/50 hover:shadow-eth-md transition-all group cursor-pointer`}
                      >
                        <CardHeader className="p-5 pb-3 space-y-3">
                          <div className="flex justify-between items-start">
                            <Badge 
                              variant="outline" 
                              className={`text-xs font-bold px-2.5 py-1 border ${priorityColors[task.priority] || priorityColors['Medium']}`}
                            >
                              {task.priority.toUpperCase()}
                            </Badge>
                            <span className="text-xs font-mono text-eth-600 group-hover:text-eth-accent/60 transition-colors">
                              {task.id.slice(0, 8)}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white group-hover:text-eth-accent transition-colors leading-tight">
                            {task.title}
                          </h4>
                        </CardHeader>
                        <CardContent className="p-5 pt-0 pb-4">
                          <p className="text-sm text-eth-400 line-clamp-2 leading-relaxed">
                            {task.desc}
                          </p>
                        </CardContent>
                        <div className="px-5 pb-4 flex items-center justify-between border-t border-eth-700/30 pt-4">
                          <div className="flex items-center gap-4 text-xs text-eth-600">
                            <div className="flex items-center gap-1.5">
                              <MessageSquare size={12} className="text-eth-accent/60" />
                              <span>{task.comments?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Layers size={12} className="text-eth-accent/60" />
                              <span>0</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-eth-600 hover:text-red-400 hover:bg-red-400/10"
                              onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                            >
                              <Trash2 size={14} />
                            </Button>
                            {task.status !== 'Done' && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 text-eth-600 hover:text-eth-accent hover:bg-eth-accent/10"
                                onClick={(e) => { e.stopPropagation(); handleAdvanceTask(task); }}
                              >
                                <ArrowRight size={14} />
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  <Button 
                    variant="outline" 
                    className="w-full py-6 border-dashed border-eth-700 text-eth-600 hover:border-eth-accent hover:text-eth-accent hover:bg-eth-800/50 transition-all font-semibold"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <Plus size={16} className="mr-2" /> ADD TASK
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
