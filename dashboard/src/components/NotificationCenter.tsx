import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle2, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const iconMap = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

const colorMap = {
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    icon: 'text-emerald-400',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    icon: 'text-amber-400',
  },
  error: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    icon: 'text-rose-400',
  },
  info: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    icon: 'text-cyan-400',
  },
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('dashboard_notifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        })));
      } catch (e) {
        console.error('Failed to parse notifications', e);
      }
    }

    // Listen for custom notification events
    const handleNotification = (e: CustomEvent<Notification>) => {
      addNotification(e.detail);
    };

    window.addEventListener('notification' as any, handleNotification);
    return () => window.removeEventListener('notification' as any, handleNotification);
  }, []);

  const addNotification = (notif: Omit<Notification, 'id' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Date.now().toString(),
      read: false,
    };

    setNotifications(prev => {
      const updated = [newNotif, ...prev].slice(0, 50); // Keep max 50
      localStorage.setItem('dashboard_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('dashboard_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('dashboard_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('dashboard_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('dashboard_notifications');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-eth-500 hover:text-white relative hover:bg-eth-800">
          <Bell size={20} />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse-eth" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:w-[400px] bg-eth-900 border-eth-700 text-white p-0">
        <SheetHeader className="p-6 border-b border-eth-700">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white flex items-center gap-2">
              <Bell className="text-eth-accent" size={20} />
              Notifications
            </SheetTitle>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-eth-accent hover:text-eth-accent/80 h-7"
                >
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs text-eth-500 hover:text-eth-300 h-7"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="h-[calc(100vh-88px)] overflow-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Bell className="text-eth-600 mb-4" size={48} />
              <p className="text-eth-500 text-sm font-medium">No notifications</p>
              <p className="text-eth-600 text-xs mt-1">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const Icon = iconMap[notif.type];
              const colors = colorMap[notif.type];

              return (
                <Card
                  key={notif.id}
                  className={`${colors.bg} border ${colors.border} ${
                    notif.read ? 'opacity-60' : ''
                  } transition-all hover:scale-[1.01]`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-eth-900/50`}>
                        <Icon className={colors.icon} size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`text-sm font-bold ${colors.text}`}>{notif.title}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeNotification(notif.id)}
                            className="h-6 w-6 text-eth-600 hover:text-white shrink-0"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                        <p className="text-xs text-eth-300 leading-relaxed mb-2">{notif.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-eth-600 font-mono">
                            {notif.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {!notif.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notif.id)}
                              className="text-[10px] text-eth-accent hover:text-eth-accent/80 h-6 px-2"
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Helper function to trigger notifications from anywhere in the app
export function sendNotification(
  type: 'success' | 'warning' | 'error' | 'info',
  title: string,
  message: string
) {
  const event = new CustomEvent('notification', {
    detail: {
      type,
      title,
      message,
      timestamp: new Date(),
    },
  });
  window.dispatchEvent(event);
}
