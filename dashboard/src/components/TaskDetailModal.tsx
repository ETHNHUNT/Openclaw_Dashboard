import { useState, useEffect } from 'react';
import { X, MessageSquare, Send, Trash2, Clock, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Task {
  id: string;
  title: string;
  desc: string | null;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
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
  High: 'bg-red-500/20 text-red-300 border-red-500/30',
  Medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Low: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
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
      <DialogContent className="max-w-3xl max-h-[90vh] bg-eth-900 border-eth-700 text-white overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 border-b border-eth-700 bg-eth-900/80 backdrop-blur shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className={`${priorityColors[task.priority]} text-xs font-bold px-3 py-1`}>
                  {task.priority.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="border-eth-600 text-eth-400 text-xs px-3 py-1">
                  {task.status}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-bold text-white leading-tight">
                {task.title}
              </DialogTitle>
              <p className="text-xs text-eth-500 mt-2 font-mono">ID: {task.id}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-eth-600 hover:text-white shrink-0">
              <X size={20} />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* DESCRIPTION */}
          <div>
            <h3 className="text-sm font-bold text-eth-accent uppercase tracking-widest mb-3">Description</h3>
            <p className="text-eth-300 text-sm leading-relaxed">
              {task.desc || 'No description provided.'}
            </p>
          </div>

          <Separator className="bg-eth-700" />

          {/* METADATA */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-eth-800/50 rounded-lg border border-eth-700/50">
              <Clock className="text-eth-accent" size={18} />
              <div>
                <p className="text-[10px] text-eth-500 uppercase tracking-widest mb-0.5">Created</p>
                <p className="text-sm text-white font-medium">{formatDate(task.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-eth-800/50 rounded-lg border border-eth-700/50">
              <Clock className="text-eth-accent" size={18} />
              <div>
                <p className="text-[10px] text-eth-500 uppercase tracking-widest mb-0.5">Last Updated</p>
                <p className="text-sm text-white font-medium">{formatDate(task.updatedAt)}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-eth-700" />

          {/* COMMENTS */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="text-eth-accent" size={18} />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                Comments ({comments.length})
              </h3>
            </div>

            <div className="space-y-3 mb-4 max-h-[300px] overflow-auto pr-2">
              {comments.length === 0 ? (
                <p className="text-eth-500 text-sm text-center py-8 italic">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-eth-800/50 rounded-lg border border-eth-700/50 p-4 group hover:border-eth-accent/30 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-eth-accent/20 rounded-full flex items-center justify-center">
                          <User className="text-eth-accent" size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">VIPIN</p>
                          <p className="text-[10px] text-eth-500 font-mono">{formatDate(comment.createdAt)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="h-7 w-7 text-eth-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                    <p className="text-sm text-eth-300 leading-relaxed pl-10">{comment.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* ADD COMMENT */}
            <div className="space-y-3">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="bg-eth-800 border-eth-700 text-white placeholder:text-eth-500 focus-visible:ring-eth-accent resize-none"
                rows={3}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || loading}
                  className="bg-eth-accent text-eth-950 font-bold hover:bg-eth-accent/90"
                >
                  <Send size={16} className="mr-2" />
                  {loading ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
