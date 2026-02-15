import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  module: string;
  message: string;
  level: 'info' | 'warn' | 'error' | 'success';
}

const levelColors = {
  info: 'text-eth-500',
  warn: 'text-amber-400',
  error: 'text-rose-400',
  success: 'text-emerald-400',
};

export default function ActivityLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/logs');
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        console.error("Log fetch failed", err);
      }
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3 font-mono h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2 text-eth-accent">
          <Terminal size={12} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Live Tactical Intel</span>
        </div>
        <div className="h-[1px] flex-1 bg-eth-700/50 mx-3" />
      </div>

      <div className="flex-1 space-y-3 overflow-auto pr-2 custom-scrollbar">
        {logs.map((log) => (
          <div key={log.id} className="text-[10px] leading-relaxed border-l border-eth-700/50 pl-3 relative group">
            <div className="absolute -left-[3px] top-1 w-[5px] h-[5px] rounded-full bg-eth-700 group-hover:bg-eth-accent transition-colors" />
            <div className="flex items-start gap-2">
              <span className="text-eth-600 shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className={`font-bold shrink-0 ${levelColors[log.level as keyof typeof levelColors] || 'text-eth-500'}`}>
                [{log.module}]
              </span>
              <span className="text-eth-300">{log.message}</span>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-eth-600 text-[10px] italic">Waiting for incoming telemetry...</div>
        )}
      </div>
    </div>
  );
}
