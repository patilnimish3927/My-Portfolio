import React, { useState } from 'react';
import { useListProjects, useAdminCreateProject, useAdminUpdateProject, useAdminDeleteProject } from '@workspace/api-client-react';
import type { Project } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, X, Check, Star } from 'lucide-react';

interface ProjectForm {
  title: string;
  description: string;
  longDescription: string;
  techStack: string;
  features: string;
  githubUrl: string;
  liveUrl: string;
  imageUrls: string;
  featured: boolean;
  sortOrder: number;
}

const empty: ProjectForm = {
  title: '', description: '', longDescription: '', techStack: '', features: '',
  githubUrl: '', liveUrl: '', imageUrls: '', featured: false, sortOrder: 0,
};

const toData = (f: ProjectForm) => ({
  title: f.title.trim(),
  description: f.description.trim(),
  longDescription: f.longDescription.trim() || null,
  techStack: f.techStack.split(',').map(s => s.trim()).filter(Boolean),
  features: f.features.split('\n').map(s => s.trim()).filter(Boolean),
  githubUrl: f.githubUrl.trim() || null,
  liveUrl: f.liveUrl.trim() || null,
  imageUrls: f.imageUrls.split('\n').map(s => s.trim()).filter(Boolean),
  featured: f.featured,
  sortOrder: f.sortOrder,
});

export default function AdminProjects() {
  const { data: projects, refetch } = useListProjects();
  const createProject = useAdminCreateProject();
  const updateProject = useAdminUpdateProject();
  const deleteProject = useAdminDeleteProject();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectForm>(empty);

  const f = (key: keyof ProjectForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  const openAdd = () => { setForm(empty); setEditingId(null); setShowForm(true); };
  const openEdit = (p: Project) => {
    setForm({
      title: p.title, description: p.description, longDescription: p.longDescription || '',
      techStack: p.techStack.join(', '), features: (p.features || []).join('\n'),
      githubUrl: p.githubUrl || '', liveUrl: p.liveUrl || '',
      imageUrls: (p.imageUrls || []).join('\n'), featured: p.featured, sortOrder: p.sortOrder,
    });
    setEditingId(p.id);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const handleSave = () => {
    const data = toData(form);
    if (!data.title || !data.description) {
      toast({ title: 'Title and description are required', variant: 'destructive' });
      return;
    }
    if (editingId !== null) {
      updateProject.mutate({ id: editingId, data }, {
        onSuccess: () => { toast({ title: 'Project updated' }); refetch(); closeForm(); },
        onError: () => toast({ title: 'Failed to update project', variant: 'destructive' }),
      });
    } else {
      createProject.mutate({ data }, {
        onSuccess: () => { toast({ title: 'Project added' }); refetch(); closeForm(); },
        onError: () => toast({ title: 'Failed to add project', variant: 'destructive' }),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this project?')) return;
    deleteProject.mutate({ id }, {
      onSuccess: () => { toast({ title: 'Project deleted' }); refetch(); },
      onError: () => toast({ title: 'Failed to delete project', variant: 'destructive' }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-3xl font-bold font-mono">Projects</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded font-medium hover:bg-primary/90 text-sm">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-primary/50 rounded-lg p-6 space-y-4">
          <h3 className="font-bold font-mono text-primary">{editingId ? 'Edit Project' : 'Add Project'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Title *</label>
              <input value={form.title} onChange={f('title')} placeholder="Project name"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: Number(e.target.value) }))}
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Short Description *</label>
            <textarea value={form.description} onChange={f('description')} rows={2} placeholder="Brief description shown on card"
              className="w-full bg-background border border-border rounded p-2 text-sm resize-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Long Description</label>
            <textarea value={form.longDescription} onChange={f('longDescription')} rows={3} placeholder="Detailed description (optional)"
              className="w-full bg-background border border-border rounded p-2 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Tech Stack (comma-separated)</label>
              <input value={form.techStack} onChange={f('techStack')} placeholder="React, Node.js, PostgreSQL"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Features (one per line)</label>
              <textarea value={form.features} onChange={f('features')} rows={3} placeholder="Feature 1&#10;Feature 2"
                className="w-full bg-background border border-border rounded p-2 text-sm resize-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">GitHub URL</label>
              <input value={form.githubUrl} onChange={f('githubUrl')} placeholder="https://github.com/..."
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Live URL</label>
              <input value={form.liveUrl} onChange={f('liveUrl')} placeholder="https://..."
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Image URLs (one per line)</label>
            <textarea value={form.imageUrls} onChange={f('imageUrls')} rows={2} placeholder="https://example.com/img.png"
              className="w-full bg-background border border-border rounded p-2 text-sm resize-none" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
              className="w-4 h-4 accent-primary" />
            <span className="text-sm font-medium">Featured project</span>
          </label>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={createProject.isPending || updateProject.isPending}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
              <Check className="w-4 h-4" /> {editingId ? 'Update' : 'Add Project'}
            </button>
            <button onClick={closeForm} className="flex items-center gap-2 border border-border px-4 py-2 rounded text-sm hover:bg-muted">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {(projects || []).sort((a, b) => a.sortOrder - b.sortOrder).map(project => (
          <div key={project.id} className="bg-card border border-border rounded-lg p-5 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground">{project.title}</h3>
                {project.featured && <Star className="w-4 h-4 text-primary fill-primary" />}
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {project.techStack.map((t, i) => (
                  <span key={i} className="text-xs bg-muted border border-border px-2 py-0.5 rounded font-mono">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => openEdit(project)} className="p-2 hover:text-primary transition-colors text-muted-foreground">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(project.id)} className="p-2 hover:text-destructive transition-colors text-muted-foreground">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {(!projects || projects.length === 0) && !showForm && (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
            No projects yet. Click "Add Project" to get started.
          </div>
        )}
      </div>
    </div>
  );
}
