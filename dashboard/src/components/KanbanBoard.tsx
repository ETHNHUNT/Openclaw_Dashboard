import { useState, useEffect } from 'react';
import { MoreVertical, Plus, Layers, MessageSquare, Search, Trash2, GripVertical, Download, Upload, Copy as CopyIcon, Calendar as CalendarIcon, Filter, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import TaskDrawer from './TaskDrawer';
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

// Flash UI Style Badges
const priorityConfig: Record<string, { color: string, badge: string }> = {
  High: { color: 'text-white', badge: 'bg-red-500/10 text-red-400 border border-red-500/20' },
  Medium: { color: 'text-white', badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  Low: { color: 'text-white', badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
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
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      {/* Flash UI Artifact Card Style */}
      <div
        onClick={() => onClick(task)}
        className={`
          flash-card group relative overflow-hidden rounded-xl
          ${isDragging ? 'ring-1 ring-white/30 shadow-2xl scale-105' : ''}
        `}
      >
        {/* Header/Grab Area */}
        <div className="flex justify-between items-start p-4 pb-2">
          <div className="flex items-center gap-2">
             <Badge className={`flash-badge ${priorityConfig[task.priority]?.badge}`}>
                {task.priority}
             </Badge>
          </div>
          
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-white transition-colors">
            <GripVertical size={14} />
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          <h4 className="text-sm font-medium text-white leading-snug line-clamp-2 mb-1">
            {task.title}
          </h4>
          {task.desc && (
            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              {task.desc}
            </p>
          )}
        </div>

        {/* Footer / Meta */}
        <div className="px-4 py-3 border-t border-zinc-800/50 bg-zinc-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
             {task.assignedTo ? (
                <div className="flex items-center gap-1.5">
                   <div className="w-4 h-4 rounded-full bg-zinc-700 flex items-center justify-center text-[8px] font-bold text-white">
                      {task.assignedTo.charAt(0)}
                   </div>
                   <span className="text-[10px] text-zinc-400">{task.assignedTo}</span>
                </div>
             ) : (
                <span className="text-[10px] text-zinc-600">Unassigned</span>
             )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             {task.comments?.length > 0 && (
                <div className="flex items-center gap-1 text-zinc-500 mr-2">
                  <MessageSquare size={12} />
                  <span className="text-[10px]">{task.comments.length}</span>
                </div>
             )}
            <button
              className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(task);
              }}
            >
              <CopyIcon size={12} />
            </button>
            <button
              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', desc: '', priority: 'Medium', assignedTo: '' });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [agents, setAgents] = useState<any[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
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
      }
    } catch (err) {
      console.error('Duplication failed', err);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
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

    // Moving between columns
    if (columns.includes(overId)) {
      if (activeTask.status !== overId) {
        setTasks((tasks) =>
          tasks.map((t) => (t.id === activeId ? { ...t, status: overId } : t))
        );
      }
      return;
    }

    // Reordering in same column
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

    try {
      await fetch(`/api/tasks/${activeTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: activeTask.status }),
      });
    } catch (err) {
      console.error('Failed to update task status', err);
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.desc || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Flash UI Toolbar - Glass Effect */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4" />
            <Input
              placeholder="Search missions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-zinc-900/50 border-zinc-800 text-sm focus:border-zinc-700 rounded-xl"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 px-4 gap-2 bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 rounded-xl">
                <Filter size={14} className="text-zinc-400" />
                <span className="text-zinc-300">{priorityFilter === 'All' ? 'Filter' : priorityFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-300">
              <DropdownMenuItem onClick={() => setPriorityFilter('All')}>All Priorities</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter('High')}>High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter('Medium')}>Medium</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter('Low')}>Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
           <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-10 px-6 gap-2 font-medium bg-white text-black hover:bg-zinc-200 rounded-full shadow-lg shadow-white/10 transition-all hover:scale-105">
                <Plus size={16} />
                New Mission
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:rounded-2xl">
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
                <DialogDescription className="text-zinc-400">Add a new task to your board.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Details..."
                    value={newTask.desc}
                    onChange={(e) => setNewTask({ ...newTask, desc: e.target.value })}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(v) => setNewTask({ ...newTask, priority: v })}
                    >
                      <SelectTrigger className="bg-zinc-900 border-zinc-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Assignee</Label>
                    <Select
                      value={newTask.assignedTo}
                      onValueChange={(v) => setNewTask({ ...newTask, assignedTo: v })}
                    >
                      <SelectTrigger className="bg-zinc-900 border-zinc-800">
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="">Unassigned</SelectItem>
                        {agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.name}>{agent.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">Cancel</Button>
                <Button onClick={handleAddTask} className="bg-white text-black hover:bg-zinc-200 rounded-full">Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full overflow-hidden px-1">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col);
            return (
              <div key={col} className="flex flex-col h-full">
                {/* Column Header - Minimalist */}
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">
                      {col}
                    </h3>
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-xs text-zinc-400 font-mono">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <SortableContext items={columnTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4 pb-12">
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
                        <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-700 border border-dashed border-zinc-800/50 rounded-xl bg-zinc-900/20">
                          <p className="text-xs uppercase tracking-wide">No Tasks</p>
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </div>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="flash-card p-4 rounded-xl shadow-2xl scale-105 border-white/20 cursor-grabbing">
              <h4 className="text-sm font-medium text-white">{activeTask.title}</h4>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskDrawer
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onRefresh={fetchTasks}
      />
    </div>
  );
}
