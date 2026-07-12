import React, { useState } from 'react';
import { useListExperience, useAdminCreateExperience, useAdminUpdateExperience, useAdminDeleteExperience } from '@workspace/api-client-react';
import type { Experience } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

interface ExpForm {
  company: string;
  role: string;
  department: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
  achievements: string;
  technologies: string;
  sortOrder: number;
}

const empty: ExpForm = {
  company: '', role: '', department: '', location: '',
  startDate: '', endDate: '', current: false,
  responsibilities: '', achievements: '', technologies: '', sortOrder: 0,
};

const toData = (f: ExpForm) => ({
  company: f.company.trim(),
  role: f.role.trim(),
  department: f.department.trim() || null,
  location: f.location.trim() || null,
  startDate: f.startDate.trim(),
  endDate: f.endDate.trim() || null,
  current: f.current,
  responsibilities: f.responsibilities.split('\n').map(s => s.trim()).filter(Boolean),
  achievements: f.achievements.split('\n').map(s => s.trim()).filter(Boolean),
  technologies: f.technologies.split(',').map(s => s.trim()).filter(Boolean),
  sortOrder: f.sortOrder,
});

export default function AdminExperience() {
  const { data: experience, refetch } = useListExperience();
  const create = useAdminCreateExperience();
  const update = useAdminUpdateExperience();
  const del = useAdminDeleteExperience();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ExpForm>(empty);

  const ff = (key: keyof ExpForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  const openAdd = () => { setForm(empty); setEditingId(null); setShowForm(true); };
  const openEdit = (exp: Experience) => {
    setForm({
      company: exp.company, role: exp.role, department: exp.department || '',
      location: exp.location || '', startDate: exp.startDate, endDate: exp.endDate || '',
      current: exp.current ?? false,
      responsibilities: (exp.responsibilities ?? []).join('\n'),
      achievements: (exp.achievements ?? []).join('\n'),
      technologies: (exp.technologies ?? []).join(', '),
      sortOrder: exp.sortOrder,
    });
    setEditingId(exp.id);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const handleSave = () => {
    const data = toData(form);
    if (!data.company || !data.role || !data.startDate) {
      toast({ title: 'Company, role and start date are required', variant: 'destructive' });
      return;
    }
    if (editingId !== null) {
      update.mutate({ id: editingId, data }, {
        onSuccess: () => { toast({ title: 'Experience updated' }); refetch(); closeForm(); },
        onError: () => toast({ title: 'Failed to update', variant: 'destructive' }),
      });
    } else {
      create.mutate({ data }, {
        onSuccess: () => { toast({ title: 'Experience added' }); refetch(); closeForm(); },
        onError: () => toast({ title: 'Failed to add', variant: 'destructive' }),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this experience?')) return;
    del.mutate({ id }, {
      onSuccess: () => { toast({ title: 'Experience deleted' }); refetch(); },
      onError: () => toast({ title: 'Failed to delete', variant: 'destructive' }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-3xl font-bold font-mono">Experience</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded font-medium hover:bg-primary/90 text-sm">
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-primary/50 rounded-lg p-6 space-y-4">
          <h3 className="font-bold font-mono text-primary">{editingId ? 'Edit Experience' : 'Add Experience'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Company *</label>
              <input value={form.company} onChange={ff('company')} placeholder="e.g. JSW Steel Ltd."
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Role *</label>
              <input value={form.role} onChange={ff('role')} placeholder="e.g. IT Intern"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Department</label>
              <input value={form.department} onChange={ff('department')} placeholder="e.g. IT Department"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Location</label>
              <input value={form.location} onChange={ff('location')} placeholder="e.g. Mumbai, India"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Start Date *</label>
              <input value={form.startDate} onChange={ff('startDate')} placeholder="e.g. May 2026"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">End Date</label>
              <input value={form.endDate} onChange={ff('endDate')} placeholder="e.g. July 2026 (leave blank if current)"
                disabled={form.current}
                className="w-full bg-background border border-border rounded p-2 text-sm disabled:opacity-50" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.current} onChange={e => setForm(p => ({ ...p, current: e.target.checked, endDate: e.target.checked ? '' : p.endDate }))}
              className="w-4 h-4 accent-primary" />
            <span className="text-sm font-medium">Currently working here</span>
          </label>
          <div className="space-y-1">
            <label className="text-sm font-medium">Responsibilities (one per line)</label>
            <textarea value={form.responsibilities} onChange={ff('responsibilities')} rows={4}
              placeholder="Developed internal automation tools&#10;Managed server configurations"
              className="w-full bg-background border border-border rounded p-2 text-sm resize-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Key Achievements (one per line)</label>
            <textarea value={form.achievements} onChange={ff('achievements')} rows={3}
              placeholder="Reduced deployment time by 40%"
              className="w-full bg-background border border-border rounded p-2 text-sm resize-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Technologies Used (comma-separated)</label>
            <input value={form.technologies} onChange={ff('technologies')} placeholder="Python, SQL, Linux, Docker"
              className="w-full bg-background border border-border rounded p-2 text-sm" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={create.isPending || update.isPending}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
              <Check className="w-4 h-4" /> {editingId ? 'Update' : 'Add'}
            </button>
            <button onClick={closeForm} className="flex items-center gap-2 border border-border px-4 py-2 rounded text-sm hover:bg-muted">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {(experience || []).sort((a, b) => a.sortOrder - b.sortOrder).map(exp => (
          <div key={exp.id} className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-foreground">{exp.role}</h3>
                <p className="text-sm text-primary font-medium">{exp.company}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {exp.startDate} → {exp.current ? 'Present' : (exp.endDate || '—')}
                  {exp.location && ` • ${exp.location}`}
                </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(exp)} className="p-2 hover:text-primary transition-colors text-muted-foreground">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(exp.id)} className="p-2 hover:text-destructive transition-colors text-muted-foreground">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {(!experience || experience.length === 0) && !showForm && (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
            No experience added yet.
          </div>
        )}
      </div>
    </div>
  );
}
