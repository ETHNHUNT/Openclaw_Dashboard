import { useState, useEffect } from 'react';
import { MoreVertical, Plus, Layers, MessageSquare, Search, Trash2, GripVertical, Download, Upload, Copy as CopyIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import TaskDetailModal from './TaskDetailModal';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Task {
  id: string;
  title: string;
  desc: string | null;
  status: string;
  priority: string;
  assignedTo?: string | null;
  comments: any[];
  createdAt: string;
  updatedAt: string;
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

interface SortableTaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onDuplicate: (task: Task) => void;
  onClick: (task: Task) => void;
}

function SortableTaskCard({ task, onDelete, onDuplicate, onClick }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        onClick={() => onClick(task)}
        className={`${priorityBgColors[task.priority] || priorityBgColors['Medium']} bg-eth-800 border border-eth-700 hover:border-eth-accent/50 hover:shadow-eth-md transition-all group cursor-pointer`}
      >
        <CardHeader className="p-5 pb-3 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                <GripVertical size={16} className="text-eth-600 hover:text-eth-accent" />
              </div>
              <Badge
                variant="outline"
                className={`text-xs font-bold px-2.5 py-1 border ${priorityColors[task.priority] || priorityColors['Medium']}`}
              >
                {task.priority.toUpperCase()}
              </Badge>
            </div>
            <span className="text-xs font-mono text-eth-600 group-hover:text-eth-accent/60 transition-colors">
              {task.id.slice(0, 8)}
            </span>
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-eth-accent transition-colors leading-tight">
            {task.title}
          </h4>
          {task.assignedTo && (
            <Badge variant="outline" className="border-eth-accent/30 text-eth-accent text-xs w-fit">
              Assigned: {task.assignedTo}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-5 pt-0 pb-4">
          <p className="text-sm text-eth-400 line-clamp-2 leading-relaxed">{task.desc}</p>
        </CardContent>
        <div className="px-5 pb-4 flex items-center justify-between border-t border-eth-700/30 pt-4">
          <div className="flex items-center gap-4 text-xs text-eth-600">
            <div className="flex items-center gap-1.5">
              <MessageSquare size={12} className="text-eth-accent/60" />
              <span>{task.comments?.length || 0}</span>
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-eth-600 hover:text-eth-accent hover:bg-eth-accent/10"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(task);
              }}
              title="Duplicate task (D)"
            >
              <CopyIcon size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-eth-600 hover:text-red-400 hover:bg-red-400/10"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              title="Delete task"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', desc: '', priority: 'Medium', assignedTo: '' });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [agents, setAgents] = useState<any[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/agents');
      if (res.ok) {
        const data = await res.json();
        setAgents(data);
      }
    } catch (err) {
      console.error('Failed to fetch agents', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchAgents();
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
        setNewTask({ title: '', desc: '', priority: 'Medium', assignedTo: '' });
        setIsAddModalOpen(false);
        fetchTasks();
      }
    } catch (err) {
      console.error('Add task failed', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleDuplicateTask = async (task: Task) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${task.title} (Copy)`,
          desc: task.desc,
          priority: task.priority,
          assignedTo: task.assignedTo,
          status: 'Planning',
        }),
      });
      if (res.ok) {
        fetchTasks();
        window.dispatchEvent(new CustomEvent('notification', {
          detail: { type: 'success', message: `Task duplicated: ${task.title}` }
        }));
      }
    } catch (err) {
      console.error('Duplication failed', err);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `openclaw-tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        for (const task of imported) {
          await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: task.title,
              desc: task.desc,
              priority: task.priority,
              status: task.status,
              assignedTo: task.assignedTo,
            }),
          });
        }
        fetchTasks();
      } catch (err) {
        console.error('Import failed', err);
        alert('Failed to import tasks. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    // If dragging over a column container
    if (columns.includes(overId)) {
      if (activeTask.status !== overId) {
        setTasks((tasks) =>
          tasks.map((t) => (t.id === activeId ? { ...t, status: overId } : t))
        );
      }
      return;
    }

    // If dragging over another task
    if (overTask && activeTask.status === overTask.status) {
      const oldIndex = tasks.findIndex((t) => t.id === activeId);
      const newIndex = tasks.findIndex((t) => t.id === overId);
      setTasks((tasks) => arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // Update task status on server
    try {
      await fetch(`/api/tasks/${activeTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: activeTask.status }),
      });
    } catch (err) {
      console.error('Failed to update task status', err);
      fetchTasks(); // Revert on error
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.desc || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
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

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <div className="h-full">
      <Card className="bg-transparent border-none shadow-none">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 pb-6 border-b border-eth-700/50">
          <div>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Layers className="text-eth-accent" size={28} />
              MISSION BOARD
            </CardTitle>
            <CardDescription className="text-eth-500 mt-2">
              Drag-and-drop task orchestration & execution
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <div className="relative flex-1 md:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-eth-500" size={16} />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-eth-800 border-eth-700 text-white"
              />
            </div>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[120px] bg-eth-800 border-eth-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-eth-800 border-eth-700 text-white">
                <SelectItem value="All">All Priority</SelectItem>
                <SelectItem value="High">🔴 High</SelectItem>
                <SelectItem value="Medium">🟡 Medium</SelectItem>
                <SelectItem value="Low">🔵 Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-eth-800 border-eth-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-eth-800 border-eth-700 text-white">
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={handleExport}
              className="border-eth-700 text-eth-accent hover:bg-eth-800"
              title="Export tasks"
            >
              <Download size={18} />
            </Button>

            <label className="cursor-pointer">
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              <Button
                variant="outline"
                size="icon"
                className="border-eth-700 text-eth-accent hover:bg-eth-800"
                title="Import tasks"
                asChild
              >
                <span>
                  <Upload size={18} />
                </span>
              </Button>
            </label>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-eth-accent hover:bg-eth-accent-dark text-eth-900 font-bold gap-2">
                  <Plus size={18} />
                  NEW TASK
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
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="bg-eth-800 border-eth-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Description</Label>
                    <Textarea
                      id="desc"
                      placeholder="Mission details..."
                      value={newTask.desc}
                      onChange={(e) => setNewTask({ ...newTask, desc: e.target.value })}
                      className="bg-eth-800 border-eth-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(v) => setNewTask({ ...newTask, priority: v })}
                      >
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
                    <div className="space-y-2">
                      <Label htmlFor="assignedTo">Assign To</Label>
                      <Select
                        value={newTask.assignedTo}
                        onValueChange={(v) => setNewTask({ ...newTask, assignedTo: v })}
                      >
                        <SelectTrigger className="bg-eth-800 border-eth-700">
                          <SelectValue placeholder="Select agent" />
                        </SelectTrigger>
                        <SelectContent className="bg-eth-800 border-eth-700 text-white">
                          <SelectItem value="">Unassigned</SelectItem>
                          {agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.name}>
                              {agent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                    CANCEL
                  </Button>
                  <Button className="bg-eth-accent text-eth-900 font-bold" onClick={handleAddTask}>
                    DEPLOY MISSION
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {columns.map((col) => {
                const columnTasks = filteredTasks.filter((t) => t.status === col);
                return (
                  <div key={col} className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6 px-1 pb-4 border-b border-eth-700">
                      <h3 className="text-sm font-bold text-eth-accent uppercase tracking-widest flex items-center gap-2">
                        {col}
                        <Badge variant="secondary" className="bg-eth-800 text-eth-accent border-eth-accent/30 ml-2">
                          {columnTasks.length}
                        </Badge>
                      </h3>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-eth-600 hover:text-eth-accent">
                        <MoreVertical size={16} />
                      </Button>
                    </div>

                    <SortableContext items={columnTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3 flex-1">
                        {columnTasks.map((task) => (
                          <SortableTaskCard
                            key={task.id}
                            task={task}
                            onDelete={handleDeleteTask}
                            onDuplicate={handleDuplicateTask}
                            onClick={handleTaskClick}
                          />
                        ))}
                        {columnTasks.length === 0 && (
                          <div className="p-8 text-center border-2 border-dashed border-eth-700 rounded-lg">
                            <p className="text-eth-600 text-sm">Drop tasks here</p>
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </div>
                );
              })}
            </div>

            <DragOverlay>
              {activeTask ? (
                <Card className="bg-eth-800 border-eth-accent opacity-90 cursor-grabbing">
                  <CardHeader className="p-5 pb-3">
                    <h4 className="text-base font-bold text-white">{activeTask.title}</h4>
                  </CardHeader>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
        </CardContent>
      </Card>

      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onRefresh={fetchTasks}
      />
    </div>
  );
}
