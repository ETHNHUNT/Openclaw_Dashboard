import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { z } from 'zod';
import 'dotenv/config'; // Load env
import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import prisma from './prisma';
import { startHeartbeat } from './heartbeat';

const app = express();
const PORT = process.env.PORT || 3001;

console.log('Server starting...'); // Debug log

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// GET / (Health Check Root)
app.get('/', (req, res) => {
  res.json({
    message: 'OpenClaw Dashboard API',
    status: 'running',
    docs: '/api/health',
    version: '0.6.0'
  });
});

// Serve static files from the 'public' folder in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(process.cwd(), 'public');
  app.use(express.static(publicPath));
  
  // Handle SPA routing
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// Zod Schemas
const TaskSchema = z.object({
  title: z.string().min(1),
  desc: z.string().optional(),
  status: z.enum(['Planning', 'In Progress', 'Done']).optional(),
  priority: z.enum(['High', 'Medium', 'Low']).optional(),
  assignedTo: z.string().optional(),
});

const LogSchema = z.object({
  level: z.enum(['info', 'warn', 'error', 'success']),
  message: z.string().min(1),
  module: z.string().min(1),
});

const CommentSchema = z.object({
  text: z.string().min(1),
  taskId: z.string(),
});

// Routes

// GET /api/tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { comments: true }
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks
app.post('/api/tasks', async (req, res) => {
  try {
    const data = TaskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: {
        title: data.title,
        desc: data.desc || null,
        status: data.status || 'Planning',
        priority: data.priority || 'Medium',
        assignedTo: data.assignedTo || null,
      }
    });
    res.status(201).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: (error as any).errors });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  }
});

// PATCH /api/tasks/:id
app.patch('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = TaskSchema.partial().parse(req.body);
    const task = await prisma.task.update({
      where: { id },
      data
    });
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// --- LOGS API ---

// GET /api/logs
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await prisma.systemLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50
    });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// POST /api/logs
app.post('/api/logs', async (req, res) => {
  try {
    const data = LogSchema.parse(req.body);
    const log = await prisma.systemLog.create({
      data: {
        level: data.level,
        message: data.message,
        module: data.module
      }
    });
    res.status(201).json(log);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: (error as any).errors });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Failed to create log' });
    }
  }
});

// GET /api/health
app.get('/api/health', (req, res) => {
  const cpus = os.cpus();
  const load = os.loadavg();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memUsage = Math.round(((totalMem - freeMem) / totalMem) * 100);
  
  const cpuUsage = cpus.length > 0 ? Math.round(((load[0] || 0) / cpus.length) * 100) : 0;

  res.json({
    status: 'ok',
    cpu: Math.min(cpuUsage, 100),
    memory: memUsage,
    uptime: Math.round(os.uptime()),
    timestamp: new Date()
  });
});

// GET /api/stats - Dashboard statistics
app.get('/api/stats', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    const logs = await prisma.systemLog.findMany({
      take: 100,
      orderBy: { timestamp: 'desc' }
    });

    const stats = {
      tasks: {
        total: tasks.length,
        byStatus: {
          planning: tasks.filter(t => t.status === 'Planning').length,
          inProgress: tasks.filter(t => t.status === 'In Progress').length,
          done: tasks.filter(t => t.status === 'Done').length,
        },
        byPriority: {
          high: tasks.filter(t => t.priority === 'High').length,
          medium: tasks.filter(t => t.priority === 'Medium').length,
          low: tasks.filter(t => t.priority === 'Low').length,
        },
        completionRate: tasks.length > 0 
          ? Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100)
          : 0,
      },
      logs: {
        total: logs.length,
        byLevel: {
          info: logs.filter(l => l.level === 'info').length,
          warn: logs.filter(l => l.level === 'warn').length,
          error: logs.filter(l => l.level === 'error').length,
          success: logs.filter(l => l.level === 'success').length,
        },
      },
      system: {
        uptime: Math.round(os.uptime()),
        memory: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100),
      },
    };

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// --- FILESYSTEM API ---
const WORKSPACE_ROOT = '/home/codespace/.openclaw/workspace';

// GET /api/files - List files in memory folder
app.get('/api/files', async (req, res) => {
  try {
    const memoryPath = path.join(WORKSPACE_ROOT, 'memory');
    const files = await fs.readdir(memoryPath);
    const fileData = await Promise.all(files.filter(f => f.endsWith('.md')).map(async (f) => {
      const stats = await fs.stat(path.join(memoryPath, f));
      return {
        name: f,
        path: f,
        size: stats.size,
        updatedAt: stats.mtime
      };
    }));
    res.json(fileData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// GET /api/files/:name - Read a specific file
app.get('/api/files/:name', async (req, res) => {
  try {
    const fileName = req.params.name;
    // Basic path traversal protection
    if (fileName.includes('..') || fileName.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    const filePath = path.join(WORKSPACE_ROOT, 'memory', fileName);
    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ name: fileName, content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

// GET /api/agents - Parse MEMORY.md for team structure
app.get('/api/agents', async (req, res) => {
  try {
    let content = '';
    try {
      content = await fs.readFile(path.join(WORKSPACE_ROOT, 'MEMORY.md'), 'utf-8');
    } catch (e) {
      console.warn('MEMORY.md not found in root, checking memory folder');
      content = await fs.readFile(path.join(WORKSPACE_ROOT, 'memory', 'MEMORY.md'), 'utf-8');
    }

    const teamSection = content.split('## Team Structure (Locked)')[1]?.split('##')[0];
    if (!teamSection) return res.json([]);

    const agents = [];
    const lines = teamSection.split('\n').map(l => l.trim()).filter(l => l.startsWith('- **'));
    
    for (const line of lines) {
      // Regex to handle:
      // - **FORGE** - Coding Specialist (grok-code-fast-1)
      const match = line.match(/- \*\*(.+?)\*\*(?: \(me\))? - (.+) \((.+)\)/);
      
      if (match) {
        agents.push({
          id: match[1],
          name: match[1],
          role: match[2],
          model: match[3],
          status: 'Online',
          avatar: ''
        });
      }
    }
    res.json(agents);
  } catch (error) {
    console.error(error);
    res.json([]); 
  }
});

// --- COMMENTS API ---

// GET /api/tasks/:id/comments
app.get('/api/tasks/:id/comments', async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { taskId: id },
      orderBy: { createdAt: 'asc' },
    });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST /api/tasks/:id/comments
app.post('/api/tasks/:id/comments', async (req, res) => {
  const { id } = req.params;
  try {
    const data = CommentSchema.parse(req.body);
    const comment = await prisma.comment.create({
      data: {
        text: data.text,
        taskId: id,
      }
    });
    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: (error as any).errors });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Failed to create comment' });
    }
  }
});

// DELETE /api/comments/:id
app.delete('/api/comments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.comment.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  startHeartbeat();
});
