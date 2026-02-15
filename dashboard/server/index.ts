import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import 'dotenv/config'; // Load env

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Zod Schemas
const TaskSchema = z.object({
  title: z.string().min(1),
  desc: z.string().optional(),
  status: z.enum(['Planning', 'In Progress', 'Done']).optional(),
  priority: z.enum(['High', 'Medium', 'Low']).optional(),
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
    const { level, message, module } = req.body;
    const log = await prisma.systemLog.create({
      data: { level, message, module }
    });
    res.status(201).json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create log' });
  }
});

import os from 'os';

// ... other routes ...

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

import fs from 'fs/promises';
import path from 'path';

// --- FILESYSTEM API ---
const WORKSPACE_ROOT = '/home/codespace/.openclaw/workspace-main';

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
    const filePath = path.join(WORKSPACE_ROOT, 'memory', fileName);
    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ name: fileName, content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
