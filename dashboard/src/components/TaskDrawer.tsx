import { useState, useEffect, useRef } from 'react';
import { X, MessageSquare, Send, Trash2, Clock, Calendar, ChevronRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

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

interface TaskDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const priorityConfig: Record<string, { badge: string }> = {
  High: { badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
  Medium: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  Low: { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
};

export default function TaskDrawer({ task, isOpen, onClose, onRefresh }: TaskDrawerProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (task && isOpen) {
      fetchComments();
    }
  }, [task, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

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

  if (!isOpen || !task) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString([], {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg h-full bg-[#09090b] border-l border-white/10 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out slide-in-from-right">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-900/50 backdrop-blur-md">
          <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-wider font-medium">
            <span className="flex items-center gap-1">
               ID <span className="font-mono text-zinc-500">#{task.id.slice(0, 4)}</span>
            </span>
            <ChevronRight size={12} />
            <span className="text-white">{task.status}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-white rounded-full">
            <X size={20} />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto" ref={scrollRef}>
          <div className="p-6 space-y-8">
            
            {/* Title & Meta */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white leading-tight">
                {task.title}
              </h2>
              <div className="flex items-center gap-3">
                <Badge className={`rounded-full border ${priorityConfig[task.priority]?.badge} px-3`}>
                  {task.priority} Priority
                </Badge>
                {task.assignedTo && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-white/5">
                    <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-[8px] font-bold text-white">
                      {task.assignedTo.charAt(0)}
                    </div>
                    <span className="text-xs text-zinc-300">{task.assignedTo}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Description</h3>
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                {task.desc || <span className="italic text-zinc-600">No description provided.</span>}
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/30 border border-white/5">
                <Calendar className="text-zinc-500" size={16} />
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase">Created</p>
                  <p className="text-xs text-zinc-300 font-medium">{formatDate(task.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/30 border border-white/5">
                <Clock className="text-zinc-500" size={16} />
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase">Updated</p>
                  <p className="text-xs text-zinc-300 font-medium">{formatDate(task.updatedAt)}</p>
                </div>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Activity Stream */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare size={14} />
                  Activity
                </h3>
                <span className="text-xs text-zinc-600">{comments.length} comments</span>
              </div>

              <div className="space-y-4 pl-4 border-l border-white/10 ml-2">
                {comments.length === 0 ? (
                  <p className="text-sm text-zinc-600 italic py-4">No activity yet.</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="relative group">
                      <div className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-zinc-800 border-2 border-[#09090b]" />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-300">Vipin</span>
                          <span className="text-[10px] text-zinc-600">{formatDate(comment.createdAt)}</span>
                        </div>
                        <div className="bg-zinc-800/40 p-3 rounded-lg rounded-tl-none border border-white/5 text-sm text-zinc-300 hover:border-white/10 transition-colors">
                          {comment.text}
                        </div>
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-[10px] text-red-400 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Input */}
        <div className="p-4 border-t border-white/5 bg-zinc-900/80 backdrop-blur-md">
          <div className="relative">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] bg-zinc-950 border-zinc-800 focus:border-zinc-600 pr-12 resize-none rounded-xl"
            />
            <Button
              size="icon"
              className="absolute bottom-3 right-3 h-8 w-8 bg-white text-black hover:bg-zinc-200 rounded-lg transition-transform hover:scale-105"
              disabled={!newComment.trim() || loading}
              onClick={handleAddComment}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
