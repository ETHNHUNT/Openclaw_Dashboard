# OpenClaw Dashboard

A modern, tactical mission control dashboard for OpenClaw AI operations. Built with React, TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Features

### Core Functionality
- **Mission Command Center** - Kanban-style task management with drag-and-drop
- **Real-time Analytics** - Live metrics and performance tracking
- **Agent Squad Management** - Monitor and coordinate AI agents
- **Memory Explorer** - Browse and view workspace memory files
- **Activity Monitoring** - Real-time system logs and notifications
- **System Health** - Live CPU, memory, and heartbeat monitoring

### Components

#### 📊 Dashboard Tab
- Overview metrics (total missions, active, completed, high priority)
- Completion progress tracking
- Agent status display
- Recent activity feed
- Live system logs

#### 🎯 Missions Tab
- Full Kanban board with Planning → In Progress → Done columns
- Task creation, editing, and deletion
- Priority-based filtering (High/Medium/Low)
- Search functionality
- Task detail modal with commenting system
- Quick advance tasks between columns

#### 💾 Memory Tab
- File explorer for `/workspace/memory` directory
- File viewer with markdown rendering
- Search and filter capabilities

#### 📈 Analytics Tab
- Completion rate tracking
- Priority distribution charts
- Performance metrics
- Status breakdown visualization
- Time-based insights

#### 🛡️ Security Tab
- System health overview
- Agent status monitoring
- Clearance level display

#### ⚙️ Settings Tab
- Appearance customization
- Auto-refresh configuration
- Notification preferences
- Performance tuning
- Heartbeat service settings

### Advanced Features
- **Notification Center** - In-app notification system with read/unread tracking
- **Comment System** - Collaborative task comments
- **Recent Activity Feed** - Real-time activity logging
- **Quick Start Guide** - Onboarding for new users
- **Settings Persistence** - LocalStorage-based configuration

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 + TypeScript
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js + Express
- **Database**: SQLite with Prisma ORM
- **API**: RESTful endpoints
- **Services**: Heartbeat monitoring, file system access

### Database Schema
```prisma
model Task {
  id        String   @id @default(uuid())
  title     String
  desc      String?
  status    String   @default("Planning")
  priority  String   @default("Medium")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  comments  Comment[]
}

model Comment {
  id        String   @id @default(uuid())
  text      String
  taskId    String
  task      Task     @relation(fields: [taskId], references: [id])
  createdAt DateTime @default(now())
}

model SystemLog {
  id        String   @id @default(uuid())
  level     String
  message   String
  module    String
  timestamp DateTime @default(now())
}
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
cd dashboard
npm install

cd server
npm install
```

### Running Locally
```bash
# Terminal 1: Start backend
cd dashboard/server
npm run dev

# Terminal 2: Start frontend
cd dashboard
npm run dev
```

Open http://localhost:5173 (frontend) and http://localhost:3001 (backend API).

### Building for Production
```bash
cd dashboard
npm run build

# Backend will serve static files from public/ folder
cd server
npm run build
npm start
```

## 📡 API Endpoints

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Comments
- `GET /api/tasks/:id/comments` - Get task comments
- `POST /api/tasks/:id/comments` - Add comment
- `DELETE /api/comments/:id` - Delete comment

### Logs
- `GET /api/logs` - Get system logs
- `POST /api/logs` - Create log entry

### System
- `GET /api/health` - System health metrics
- `GET /api/stats` - Dashboard statistics
- `GET /api/agents` - Parse MEMORY.md for agent team

### Files
- `GET /api/files` - List memory files
- `GET /api/files/:name` - Read file content

## 🎨 Design System

### Color Palette
```css
--eth-accent: #00d9ff (cyan)
--eth-950: #0a0e14 (darkest)
--eth-900: #121820
--eth-800: #1a222d
--eth-700: #2a3441
--eth-600: #3a4655
--eth-500: #6b7c92
--eth-300: #a8b5c8
```

### Typography
- Headers: Bold, uppercase, tracking-widest
- Body: Medium, normal case
- Mono: System logs, IDs, timestamps

## 🔒 Security
- No authentication (Level 4 clearance by default)
- Path traversal protection on file access
- Input validation with Zod schemas

## 📦 Deployment

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
EXPOSE 3001
```

### Environment Variables
```bash
DATABASE_URL="file:./dev.db"
PORT=3001
NODE_ENV=production
```

## 🤝 Contributing
This dashboard is part of the OpenClaw ecosystem. Contributions welcome!

## 📄 License
MIT

## 🙏 Credits
Built with ❤️ by ETHNHUNT using:
- [React](https://react.dev)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma](https://www.prisma.io)
- [Vite](https://vitejs.dev)
