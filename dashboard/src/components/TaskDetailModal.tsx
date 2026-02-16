import { useState, useEffect } from 'react';
import { X, MessageSquare, Send, Trash2, Clock, User, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Task {
  id: string;
  title: string;
  desc: string | null;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string | null;
}

interface Comment {
  id: string;
  text: string;
  taskId: string;
  createdAt: string;
}

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const priorityColors: Record<string, string> = {
  High: 'bg-destructive/10 text-destructive border-destructive/20',
  Medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  Low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

const statusColors: Record<string, string> = {
  Planning: 'bg-muted text-muted-foreground border-border',
  'In Progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Done: 'bg-green-500/10 text-green-500 border-green-500/20',
};

export default function TaskDetailModal({ task, isOpen, onClose, onRefresh }: TaskDetailModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      fetchComments();
    }
  }, [task, isOpen]);

  const fetchComments = async () => {
    if (!task) return;
    try {
      const res = await fetch(`/api/tasks/${task.id}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  const handleAddComment = async () => {
    if (!task || !newComment.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment, taskId: task.id }),
      });
      if (res.ok) {
        setNewComment('');
        fetchComments();
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
      fetchComments();
      onRefresh();
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  if (!task) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden bg-background border-border shadow-lg sm:rounded-xl">
        <DialogHeader className="p-6 pb-4 border-b border-border bg-muted/10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`${priorityColors[task.priority]} font-medium border px-2 py-0.5 text-[10px] uppercase tracking-wider`}>
                  {task.priority}
                </Badge>
                <Badge variant="outline" className={`${statusColors[task.status]} font-medium border px-2 py-0.5 text-[10px] uppercase tracking-wider`}>
                  {task.status}
                </Badge>
              </div>
              <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
                {task.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col md:flex-row h-[600px]">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto border-r border-border">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</h3>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {task.desc || <span className="text-muted-foreground italic">No description provided.</span>}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">Created</span>
                  </div>
                  <p className="text-sm font-medium">{formatDate(task.createdAt)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">Updated</span>
                  </div>
                  <p className="text-sm font-medium">{formatDate(task.updatedAt)}</p>
                </div>
              </div>

              {task.assignedTo && (
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50 flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {task.assignedTo.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Assigned to</p>
                    <p className="text-sm font-medium text-foreground">{task.assignedTo}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Comments */}
          <div className="w-full md:w-80 bg-muted/5 flex flex-col">
            <div className="p-4 border-b border-border bg-muted/10">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                Activity
                <span className="ml-auto text-xs font-normal text-muted-foreground">{comments.length} comments</span>
              </h3>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-xs">No activity yet</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="group flex gap-3">
                      <Avatar className="h-6 w-6 mt-1 shrink-0">
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">VN</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Vipin</span>
                          <span className="text-[10px] text-muted-foreground">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-xs text-foreground/90 leading-relaxed bg-muted/50 p-2 rounded-md rounded-tl-none">
                          {comment.text}
                        </p>
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-[10px] text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-background">
              <div className="relative">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] pr-10 resize-none text-sm bg-muted/30 focus:bg-background transition-colors"
                />
                <Button
                  size="icon"
                  className="absolute bottom-2 right-2 h-7 w-7"
                  disabled={!newComment.trim() || loading}
                  onClick={handleAddComment}
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
