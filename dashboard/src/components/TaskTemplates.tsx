import { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, Edit2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  taskTitle: string;
  taskDesc: string;
  priority: string;
  status: string;
  createdAt: string;
}

export default function TaskTemplates() {
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    taskTitle: '',
    taskDesc: '',
    priority: 'Medium',
    status: 'Planning',
  });

  // Load templates from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('task_templates');
    if (stored) {
      setTemplates(JSON.parse(stored));
    }
  }, []);

  const saveTemplates = (updated: TaskTemplate[]) => {
    setTemplates(updated);
    localStorage.setItem('task_templates', JSON.stringify(updated));
  };

  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.taskTitle) return;
    
    const template: TaskTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      description: newTemplate.description,
      taskTitle: newTemplate.taskTitle,
      taskDesc: newTemplate.taskDesc,
      priority: newTemplate.priority,
      status: newTemplate.status,
      createdAt: new Date().toISOString(),
    };

    const updated = editingId
      ? templates.map(t => t.id === editingId ? template : t)
      : [...templates, template];
    
    saveTemplates(updated);
    setNewTemplate({
      name: '',
      description: '',
      taskTitle: '',
      taskDesc: '',
      priority: 'Medium',
      status: 'Planning',
    });
    setEditingId(null);
    setIsAddModalOpen(false);
  };

  const handleEditTemplate = (template: TaskTemplate) => {
    setNewTemplate({
      name: template.name,
      description: template.description,
      taskTitle: template.taskTitle,
      taskDesc: template.taskDesc,
      priority: template.priority,
      status: template.status,
    });
    setEditingId(template.id);
    setIsAddModalOpen(true);
  };

  const handleDeleteTemplate = (id: string) => {
    saveTemplates(templates.filter(t => t.id !== id));
  };

  const handleUseTemplate = async (template: TaskTemplate) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: template.taskTitle,
          desc: template.taskDesc,
          priority: template.priority,
          status: template.status,
        }),
      });
      if (res.ok) {
        // Dispatch event to refresh tasks
        window.dispatchEvent(new CustomEvent('tasksUpdated'));
        alert(`Task created from template: ${template.name}`);
      }
    } catch (err) {
      console.error('Failed to create task from template', err);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingId(null);
    setNewTemplate({
      name: '',
      description: '',
      taskTitle: '',
      taskDesc: '',
      priority: 'Medium',
      status: 'Planning',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-eth-900 border-eth-700">
        <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-eth-700/50">
          <div>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Copy className="text-eth-accent" size={28} />
              TASK TEMPLATES
            </CardTitle>
            <CardDescription className="text-eth-500 mt-2">
              Reusable mission templates for quick task creation
            </CardDescription>
          </div>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-eth-accent hover:bg-eth-accent-dark text-eth-900 font-bold gap-2">
                <Plus size={18} />
                NEW TEMPLATE
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-eth-900 border-eth-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-eth-accent">
                  {editingId ? 'Edit Template' : 'Create Task Template'}
                </DialogTitle>
                <DialogDescription className="text-eth-500">
                  Define a reusable task template for future missions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    placeholder="e.g. Weekly Audit"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    className="bg-eth-800 border-eth-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-desc">Template Description</Label>
                  <Input
                    id="template-desc"
                    placeholder="Brief description of when to use this template"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    className="bg-eth-800 border-eth-700"
                  />
                </div>

                <div className="border-t border-eth-700 pt-4">
                  <h4 className="text-sm font-bold text-eth-accent mb-4">Task Configuration</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input
                      id="task-title"
                      placeholder="Task title to use"
                      value={newTemplate.taskTitle}
                      onChange={(e) => setNewTemplate({ ...newTemplate, taskTitle: e.target.value })}
                      className="bg-eth-800 border-eth-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="task-desc">Task Description</Label>
                    <Textarea
                      id="task-desc"
                      placeholder="Default task description"
                      value={newTemplate.taskDesc}
                      onChange={(e) => setNewTemplate({ ...newTemplate, taskDesc: e.target.value })}
                      className="bg-eth-800 border-eth-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTemplate.priority}
                        onValueChange={(v) => setNewTemplate({ ...newTemplate, priority: v })}
                      >
                        <SelectTrigger className="bg-eth-800 border-eth-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-eth-800 border-eth-700 text-white">
                          <SelectItem value="High">🔴 High</SelectItem>
                          <SelectItem value="Medium">🟡 Medium</SelectItem>
                          <SelectItem value="Low">🔵 Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Initial Status</Label>
                      <Select
                        value={newTemplate.status}
                        onValueChange={(v) => setNewTemplate({ ...newTemplate, status: v })}
                      >
                        <SelectTrigger className="bg-eth-800 border-eth-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-eth-800 border-eth-700 text-white">
                          <SelectItem value="Planning">📋 Planning</SelectItem>
                          <SelectItem value="In Progress">⚙️ In Progress</SelectItem>
                          <SelectItem value="Done">✅ Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={handleCloseModal}>
                  CANCEL
                </Button>
                <Button className="bg-eth-accent text-eth-900 font-bold gap-2" onClick={handleAddTemplate}>
                  <Save size={16} />
                  {editingId ? 'UPDATE TEMPLATE' : 'CREATE TEMPLATE'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="pt-8">
          {templates.length === 0 ? (
            <div className="text-center py-12">
              <Copy className="mx-auto text-eth-600 mb-4" size={40} />
              <p className="text-eth-500 mb-4">No templates yet</p>
              <p className="text-eth-600 text-sm">Create your first template to speed up mission creation</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="bg-eth-800 border-eth-700 hover:border-eth-accent/50 transition-all">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white">{template.name}</CardTitle>
                        <p className="text-sm text-eth-500 mt-2">{template.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <p className="text-eth-600">Task:</p>
                      <p className="text-white font-medium">{template.taskTitle}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs font-bold border-eth-600 ${
                          template.priority === 'High'
                            ? 'bg-red-500/10 text-red-400'
                            : template.priority === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-cyan-500/10 text-cyan-400'
                        }`}
                      >
                        {template.priority}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs font-bold border-eth-600 bg-eth-700/50 text-eth-300"
                      >
                        {template.status}
                      </Badge>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-eth-700">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-eth-700 text-eth-accent hover:bg-eth-700 gap-1"
                        onClick={() => handleUseTemplate(template)}
                      >
                        <Copy size={14} />
                        Use
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-eth-700 text-eth-400 hover:text-eth-accent hover:bg-eth-700"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-eth-700 text-red-400 hover:bg-red-400/10"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
