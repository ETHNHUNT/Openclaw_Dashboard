# Changelog

All notable changes to the OpenClaw Dashboard will be documented in this file.

## [0.5.0] - 2026-02-16

### Added
- **Gantt Chart Timeline** - Visual project timeline and scheduling
  - Day/Week/Month view modes
  - Color-coded by task status (Planning/In Progress/Done)
  - Priority indicators (high/medium/low dots)
  - Task duration visualization (date created to updated)
  - Interactive hover tooltips
  - Task statistics dashboard (total, completed, in progress, upcoming)
  - Legend with status and priority indicators
  - Grid overlay for accurate alignment
  - Responsive horizontal scrolling

### Features
- Timeline automatically calculates task duration from created to updated dates
- Multiple view scales for different planning horizons
- Status summary cards (Total, Completed, In Progress, Upcoming)
- Priority dots indicate task urgency at a glance
- Date headers update based on selected view (day/week/month)

### UI Updates
- **Sidebar:** Added Timeline tab with Calendar icon
- **Tab Navigation:** New Timeline tab between Templates and Memory
- **Gantt Component:** 294 lines of visualization code

### Technical
- Day/Week/Month view calculations
- Date range normalization
- Task position calculation with visual mapping
- Status and priority color coding
- Canvas-friendly SVG-inspired design

### Bundle Size
- **v0.4.0:** 448.37 kB (gzip: 130.39 kB)
- **v0.5.0:** 455.33 kB (gzip: 131.83 kB)
- **Increase:** +6.96 kB (+1.5%)

## [0.4.0] - 2026-02-16

### Added
- **Task Templates** - Reusable task blueprints
  - Create, edit, delete custom templates
  - Quick task creation from templates
  - Store template configurations (priority, status, description)
  - Persistent localStorage storage
  - Template management dashboard

- **Keyboard Shortcuts** - Global keyboard navigation
  - **Navigation:** M (Missions), A (Analytics), S (Settings), H (Systems)
  - **Tasks:** N (New Task), D (Duplicate), E (Edit), Delete
  - **Export/Import:** Ctrl+E (Export), Ctrl+I (Import)
  - **General:** ? (Show shortcuts), Esc (Close dialogs)
  - Visual keyboard shortcuts dialog with categories
  - Smart detection (doesn't interfere with form inputs)

- **Task Duplication** - Quickly copy existing tasks
  - Duplicate button on each task card
  - Copies title (with "Copy" suffix), description, priority
  - Creates new task in Planning status
  - Keyboard shortcut: D
  - Visual feedback notification on duplicate

- **KeyboardShortcutsDialog Component**
  - Searchable, categorized shortcuts list
  - Keyboard key styling
  - Accessible via ? key or icon button
  - Global reference guide

### Enhanced
- **Sidebar** - Added Templates navigation tab
- **App.tsx** - Global keyboard event listener system
- **Top Header** - Added keyboard shortcuts button next to notifications
- **KanbanBoard** - Added duplicate button on task cards (left of delete button)

### Technical
- Global keyboard event system with navigation dispatch
- Templates stored in localStorage (JSON)
- Event-driven architecture for shortcuts
- Keyboard state awareness (ignores when typing)

### Bundle Size
- **v0.3.0:** 435.23 kB (gzip: 127.80 kB)
- **v0.4.0:** 448.37 kB (gzip: 130.39 kB)
- **Increase:** +13.14 kB (+3%)

## [0.3.0] - 2026-02-16

### Added
- **Drag-and-Drop Task Management** - Full drag-and-drop support using @dnd-kit
  - Drag tasks between columns (Planning → In Progress → Done)
  - Drag to reorder tasks within columns
  - Visual drag overlay and drop zones
  - Auto-save on drop with API updates
  - Touch-friendly mobile support

- **Task Assignment** - Assign tasks to specific agents
  - Database schema extension (assignedTo field)
  - Agent dropdown in task creation modal
  - Assignment badges on task cards
  - Filter by assigned agent

- **Export/Import Tasks** - Data portability
  - Export all tasks to JSON file
  - Import tasks from JSON file
  - Filename includes timestamp
  - Validation on import

- **Theme Toggle** - Dark/Light/Auto mode support
  - ThemeProvider with React Context
  - Persistent theme storage (localStorage)
  - Auto mode follows system preference
  - Integrated with Settings page
  - Real-time theme switching

- **Advanced Filtering** - Enhanced task filtering
  - Filter by status (Planning/In Progress/Done)
  - Filter by priority (High/Medium/Low)
  - Search by title or description
  - Multiple filters work together
  - Filter state persists during session

- **GripVertical Icon** - Visual drag handles on task cards

### Enhanced
- **KanbanBoard** - Complete rewrite with drag-and-drop
  - Import/Export buttons in toolbar
  - Status filter dropdown
  - Improved layout and spacing
  - Better mobile responsiveness

- **Settings Page** - Theme toggle now functional
  - Connected to ThemeProvider
  - Real-time theme updates
  - Auto/Light/Dark options work

- **Database Schema** - Added assignedTo column to Task model
  - Migration: 20260216201134_add_assigned_to

### Technical
- Added `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- ThemeProvider component with context API
- Updated Prisma schema and migrations
- Enhanced API validation for assignedTo field

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

### v0.5.0 (Planned)
- [ ] Real-time collaboration via WebSockets
- [ ] Custom fields for tasks
- [ ] Gantt chart view
- [ ] Task dependencies
- [ ] Task comments with @mentions
- [ ] Bulk operations (multi-select, bulk update)

### v0.6.0 (Future)
- [ ] Authentication system
- [ ] Role-based access control
- [ ] Multi-user support
- [ ] Activity audit trail
- [ ] Task history/versioning

### v1.0.0 (Production)
- [ ] Complete feature parity
- [ ] Performance optimization
- [ ] Comprehensive testing
- [ ] Documentation site
- [ ] CI/CD pipeline
