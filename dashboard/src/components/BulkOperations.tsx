import { useState } from 'react';
import { Trash2, Archive, CheckSquare, AlertCircle, Copy as CopyIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Task {
  id: string;
  title: string;
  priority: string;
  status: string;
}

interface BulkOperationsProps {
  tasks: Task[];
  selectedIds: Set<string>;
  onClearSelection: () => void;
  onRefresh: () => void;
}

export default function BulkOperations({
  tasks,
  selectedIds,
  onClearSelection,
  onRefresh,
}: BulkOperationsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'delete' | 'archive' | 'complete' | 'duplicate' | null>(null);

  if (selectedIds.size === 0) return null;

  const selectedTasks = tasks.filter(t => selectedIds.has(t.id));

  const handleDelete = async () => {
    for (const id of selectedIds) {
      try {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error(`Failed to delete task ${id}`, err);
      }
    }
    onRefresh();
    onClearSelection();
    setIsDialogOpen(false);
  };

  const handleComplete = async () => {
    for (const id of selectedIds) {
      try {
        await fetch(`/api/tasks/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Done' }),
        });
      } catch (err) {
        console.error(`Failed to update task ${id}`, err);
      }
    }
    onRefresh();
    onClearSelection();
    setIsDialogOpen(false);
  };

  const handleDuplicate = async () => {
    for (const id of selectedIds) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        try {
          await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: `${task.title} (Copy)`,
              priority: task.priority,
              status: 'Planning',
            }),
          });
        } catch (err) {
          console.error(`Failed to duplicate task ${id}`, err);
        }
      }
    }
    onRefresh();
    onClearSelection();
    setIsDialogOpen(false);
  };

  const confirmDelete = () => {
    setActionType('delete');
    setIsDialogOpen(true);
  };

  const confirmComplete = () => {
    setActionType('complete');
    setIsDialogOpen(true);
  };

  const confirmDuplicate = () => {
    setActionType('duplicate');
    setIsDialogOpen(true);
  };

  const executeAction = () => {
    if (actionType === 'delete') handleDelete();
    else if (actionType === 'complete') handleComplete();
    else if (actionType === 'duplicate') handleDuplicate();
  };

  const dialogMessages: Record<string, { title: string; desc: string }> = {
    delete: {
      title: '⚠️ Delete Selected Tasks',
      desc: `Are you sure you want to permanently delete ${selectedIds.size} task(s)? This cannot be undone.`,
    },
    complete: {
      title: '✓ Mark as Complete',
      desc: `Mark ${selectedIds.size} task(s) as Done?`,
    },
    duplicate: {
      title: '📋 Duplicate Selected Tasks',
      desc: `Create copies of ${selectedIds.size} task(s)? They will be set to Planning status.`,
    },
  };

  const msg = dialogMessages[actionType || 'delete'];

  return (
    <>
      {/* Floating toolbar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <Card className="bg-eth-800 border-eth-accent/50 shadow-lg shadow-eth-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm font-bold text-white">
                  {selectedIds.size} {selectedIds.size === 1 ? 'task' : 'tasks'} selected
                </p>
                <p className="text-xs text-eth-500">
                  {selectedTasks.filter(t => t.status === 'Done').length} completed,{' '}
                  {selectedTasks.filter(t => t.status === 'In Progress').length} in progress
                </p>
              </div>

              <div className="h-8 w-[1px] bg-eth-700" />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                  onClick={confirmComplete}
                  title="Mark as complete"
                >
                  <CheckSquare size={16} />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  onClick={confirmDuplicate}
                  title="Duplicate selected"
                >
                  <CopyIcon size={16} />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={confirmDelete}
                  title="Delete selected"
                >
                  <Trash2 size={16} />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-eth-500 hover:text-white"
                  onClick={onClearSelection}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-eth-900 border-eth-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-eth-accent">{msg?.title}</DialogTitle>
            <DialogDescription className="text-eth-500">{msg?.desc}</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <div className="bg-eth-800/50 border border-eth-700 rounded-lg p-4 max-h-[200px] overflow-y-auto">
              <p className="text-xs font-bold text-eth-600 uppercase mb-2">Affected Tasks:</p>
              <div className="space-y-2">
                {selectedTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-eth-accent" />
                    <span className="text-eth-300 truncate">{task.title}</span>
                    <Badge variant="outline" className="text-[10px] border-eth-600 bg-eth-700/50">
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              CANCEL
            </Button>
            <Button
              className={`${
                actionType === 'delete'
                  ? 'bg-red-500 hover:bg-red-600'
                  : actionType === 'complete'
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-eth-accent hover:bg-eth-accent-dark'
              } text-white font-bold`}
              onClick={executeAction}
            >
              {actionType === 'delete'
                ? 'DELETE'
                : actionType === 'complete'
                ? 'COMPLETE'
                : 'DUPLICATE'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
