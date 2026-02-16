# Changelog

All notable changes to the OpenClaw Dashboard will be documented in this file.

## [0.2.0] - 2026-02-16

### Added
- **Settings Page** - Comprehensive configuration management
  - Appearance settings (theme selection)
  - Auto-refresh controls
  - Notification preferences
  - Performance tuning options
  - Heartbeat service configuration
  - LocalStorage persistence

- **Analytics Dashboard** - Real-time mission analytics
  - Metric cards (Total, Active, Completed, High Priority)
  - Completion rate tracking with progress visualization
  - Priority distribution charts
  - Performance metrics (avg completion time, active missions)
  - Status breakdown grid

- **Notification Center** - In-app notification system
  - Success/warning/error/info notification types
  - Unread count badge
  - Mark as read functionality
  - Mark all read and clear all options
  - Slide-out panel with Sheet component
  - LocalStorage persistence
  - Custom event-based API

- **Task Detail Modal** - Enhanced task management
  - Full task details view
  - Comment system (add, view, delete)
  - User avatars and timestamps
  - Metadata display (created/updated dates)
  - Priority and status badges

- **Comment System** - Collaborative task discussions
  - Add comments to tasks
  - View comment history
  - Delete comments
  - Timestamp tracking
  - API endpoints for CRUD operations

- **Dashboard Overview** - Homepage metrics
  - Quick stats cards
  - Completion progress tracker
  - Mission status summary
  - 24-hour activity tracking

- **Recent Activity Feed** - Real-time activity logging
  - Task created/updated/completed events
  - Comment activity
  - Milestone tracking
  - Relative timestamps ("2h ago")
  - Custom event system

- **Quick Start Guide** - Onboarding for new users
  - Step-by-step instructions
  - Visual icons and cards
  - Call-to-action button
  - Shows when no tasks exist

- **Stats API** - Enhanced backend analytics
  - `/api/stats` endpoint
  - Task statistics by status and priority
  - Log statistics by level
  - System metrics aggregation

### Enhanced
- **Sidebar Navigation** - Added Analytics tab
- **App Layout** - Restructured Dashboard tab with new components
- **KanbanBoard** - Integrated TaskDetailModal on click
- **API** - Added comment endpoints (`GET/POST /api/tasks/:id/comments`, `DELETE /api/comments/:id`)

### Technical
- Added `@dnd-kit` packages for future drag-and-drop
- Added Switch UI component from shadcn
- Enhanced TypeScript interfaces
- Improved error handling
- Added validation with Zod schemas

## [0.1.0] - 2026-02-15

### Initial Release
- Kanban board with task management
- Agent squad display
- Activity log monitoring
- System health dashboard
- Memory file explorer
- Workspace integration
- SQLite database with Prisma
- Express backend API
- Heartbeat service
- Docker deployment configuration

---

## Roadmap

### v0.3.0 (Planned)
- [ ] Drag-and-drop task reordering
- [ ] Task assignment to agents
- [ ] Real-time collaboration via WebSockets
- [ ] Export/import task data
- [ ] Dark/light theme toggle
- [ ] Advanced filtering and sorting

### v0.4.0 (Future)
- [ ] Authentication system
- [ ] Role-based access control
- [ ] Multi-user support
- [ ] Task templates
- [ ] Custom fields
- [ ] Gantt chart view

### v1.0.0 (Production)
- [ ] Complete feature parity
- [ ] Performance optimization
- [ ] Comprehensive testing
- [ ] Documentation site
- [ ] CI/CD pipeline
