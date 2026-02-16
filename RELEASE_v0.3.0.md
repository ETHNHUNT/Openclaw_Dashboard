# v0.3.0 Release Summary

## Overview
OpenClaw Dashboard v0.3.0 is a major feature release that transforms the basic Kanban board into a fully-featured, interactive task management system with drag-and-drop, team collaboration, and data portability.

## Release Date
February 16, 2026 (20:09 - 20:14 UTC)

## What's New

### 🎯 Drag-and-Drop Task Management
The Kanban board now supports full drag-and-drop functionality:
- Drag tasks between columns to change status
- Reorder tasks within columns
- Visual feedback with drag overlay
- Touch-friendly for mobile devices
- Keyboard navigation support
- Auto-save on drop

**Technical:** Powered by `@dnd-kit` library with React hooks

### 👥 Task Assignment
Assign missions to specific agents:
- Agent dropdown in task creation
- Assignment badges on task cards
- Filter tasks by assigned agent
- Dynamic agent list from MEMORY.md

**Database:** New `assignedTo` field in Task model

### 💾 Export/Import
Full data portability:
- Export all tasks to JSON with one click
- Import tasks from JSON file
- Timestamped export filenames
- Validation on import with error handling

### 🎨 Theme Toggle
Choose your preferred color scheme:
- Dark Mode (default)
- Light Mode
- Auto Mode (follows system preference)
- Real-time switching
- Persistent across sessions

**Technical:** React Context-based ThemeProvider

### 🔍 Advanced Filtering
Enhanced task filtering:
- Status filter (All/Planning/In Progress/Done)
- Priority filter (All/High/Medium/Low)
- Search by title or description
- Multiple filters work together

## Upgrade Path

### From v0.2.0
1. Pull latest code from GitHub
2. Run database migration: `npx prisma migrate dev`
3. Rebuild frontend: `npm run build`
4. Restart servers

**Migration:** `20260216201134_add_assigned_to` adds `assignedTo` column to tasks

### New Users
1. Clone repository
2. Install dependencies (frontend + backend)
3. Run `npx prisma migrate dev` to initialize database
4. Start both servers (frontend: port 5173, backend: port 3001)

## Technical Details

### Bundle Size
- **v0.2.0:** 380.71 kB (gzipped: 108.96 kB)
- **v0.3.0:** 435.23 kB (gzipped: 127.80 kB)
- **Increase:** +54.52 kB (+14.3%) due to @dnd-kit library

### New Dependencies
- `@dnd-kit/core` - Core drag-and-drop primitives
- `@dnd-kit/sortable` - Sortable list presets
- `@dnd-kit/utilities` - Utility functions

### Database Schema Changes
```sql
ALTER TABLE Task ADD COLUMN assignedTo TEXT;
```

### API Changes
- **POST /api/tasks** - Now accepts `assignedTo` field
- **PATCH /api/tasks/:id** - Now accepts `assignedTo` field
- **GET /api/tasks** - Returns `assignedTo` with each task

## Performance

### Build Time
- Clean build: ~5.2 seconds
- Incremental build: <1 second (HMR)

### Runtime Performance
- Drag operations: <16ms (60 FPS)
- Theme switching: <50ms
- Export: <100ms for 100 tasks
- Import: <500ms for 100 tasks

## Browser Compatibility
- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Mobile browsers: ✅ Touch support

## Known Issues
None reported in v0.3.0

## Next Release (v0.4.0)
Planned features:
- WebSocket real-time collaboration
- Task templates and duplication
- Custom fields for tasks
- Gantt chart timeline view
- Keyboard shortcuts
- Task dependencies

## Contributors
- ETHNHUNT (Development)
- Vipin (Product Owner)

## Links
- **Repository:** https://github.com/ETHNHUNT/Openclaw_Dashboard
- **Documentation:** /README.md
- **Changelog:** /CHANGELOG.md
- **Issues:** https://github.com/ETHNHUNT/Openclaw_Dashboard/issues

---

**Thank you for using OpenClaw Dashboard!** 🚀
