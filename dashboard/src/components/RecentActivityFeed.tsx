import { useState, useEffect } from 'react';
import { Clock, TrendingUp, AlertCircle, CheckCircle2, Zap, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface RecentActivity {
  id: string;
  type: 'task_created' | 'task_updated' | 'task_completed' | 'comment_added' | 'milestone';
  message: string;
  timestamp: Date;
  priority?: string;
}

export default function RecentActivityFeed() {
  const [activities, setActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    // Load from localStorage or create initial data
    const stored = localStorage.getItem('dashboard_recent_activity');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setActivities(parsed.map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp),
        })));
      } catch (e) {
        console.error('Failed to parse activities', e);
      }
    }

    // Listen for custom activity events
    const handleActivity = (e: CustomEvent<RecentActivity>) => {
      addActivity(e.detail);
    };

    window.addEventListener('activity' as any, handleActivity);
    return () => window.removeEventListener('activity' as any, handleActivity);
  }, []);

  const addActivity = (activity: Omit<RecentActivity, 'id'>) => {
    const newActivity: RecentActivity = {
      ...activity,
      id: Date.now().toString(),
    };

    setActivities(prev => {
      const updated = [newActivity, ...prev].slice(0, 30); // Keep max 30
      localStorage.setItem('dashboard_recent_activity', JSON.stringify(updated));
      return updated;
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'task_created':
        return <TrendingUp className="text-cyan-400" size={16} />;
      case 'task_updated':
        return <AlertCircle className="text-amber-400" size={16} />;
      case 'task_completed':
        return <CheckCircle2 className="text-emerald-400" size={16} />;
      case 'comment_added':
        return <Zap className="text-eth-accent" size={16} />;
      case 'milestone':
        return <Award className="text-amber-400" size={16} />;
      default:
        return <Clock className="text-eth-500" size={16} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'task_created':
        return 'text-cyan-400';
      case 'task_updated':
        return 'text-amber-400';
      case 'task_completed':
        return 'text-emerald-400';
      case 'comment_added':
        return 'text-eth-accent';
      case 'milestone':
        return 'text-amber-400';
      default:
        return 'text-eth-500';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="bg-eth-900 border-eth-700 h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <Clock className="text-eth-accent" size={18} />
            Recent Activity
          </CardTitle>
          <Badge variant="outline" className="border-eth-accent/30 text-eth-accent text-xs">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto space-y-3 pr-2">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Clock className="text-eth-600 mb-2" size={32} />
            <p className="text-eth-500 text-xs">No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 bg-eth-800/40 rounded-lg border border-eth-700/50 hover:border-eth-accent/30 transition-all group"
            >
              <div className="p-2 bg-eth-900/50 rounded-lg shrink-0">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${getColor(activity.type)} leading-relaxed`}>
                  {activity.message}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-eth-600 font-mono">
                    {formatTime(activity.timestamp)}
                  </span>
                  {activity.priority && (
                    <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-eth-600 text-eth-500">
                      {activity.priority}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to log activity
export function logActivity(
  type: 'task_created' | 'task_updated' | 'task_completed' | 'comment_added' | 'milestone',
  message: string,
  priority?: string
) {
  const event = new CustomEvent('activity', {
    detail: {
      type,
      message,
      timestamp: new Date(),
      priority,
    },
  });
  window.dispatchEvent(event);
}
