import React, { useState } from 'react';
import { useListAchievements, useAdminCreateAchievement, useAdminUpdateAchievement, useAdminDeleteAchievement } from '@workspace/api-client-react';
import type { Achievement } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

interface AchForm {
  title: string;
  description: string;
  date: string;
  icon: string;
  sortOrder: number;
}
const empty: AchForm = { title: '', description: '', date: '', icon: '', sortOrder: 0 };

export default function AdminAchievements() {
  const { data: achievements, refetch } = useListAchievements();
  const create = useAdminCreateAchievement();
  const update = useAdminUpdateAchievement();
  const del = useAdminDeleteAchievement();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AchForm>(empty);

  const f = (key: keyof AchForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  const openAdd = () => { setForm(empty); setEditingId(null); setShowForm(true); };
  const openEdit = (a: Achievement) => {
    setForm({ title: a.title, description: a.description, date: a.date || '', icon: a.icon || '', sortOrder: a.sortOrder });
    setEditingId(a.id);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const handleSave = () => {
    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date.trim() || null,
      icon: form.icon.trim() || null,
      sortOrder: form.sortOrder,
    };
    if (!data.title || !data.description) {
      toast({ title: 'Title and description are required', variant: 'destructive' });
      return;
    }
    if (editingId !== null) {
      update.mutate({ id: editingId, data }, {
        onSuccess: () => { toast({ title: 'Achievement updated' }); refetch(); closeForm(); },
        onError: () => toast({ title: 'Failed to update', variant: 'destructive' }),
      });
    } else {
      create.mutate({ data }, {
        onSuccess: () => { toast({ title: 'Achievement added' }); refetch(); closeForm(); },
        onError: () => toast({ title: 'Failed to add', variant: 'destructive' }),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this achievement?')) return;
    del.mutate({ id }, {
      onSuccess: () => { toast({ title: 'Achievement deleted' }); refetch(); },
      onError: () => toast({ title: 'Failed to delete', variant: 'destructive' }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-3xl font-bold font-mono">Achievements</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded font-medium hover:bg-primary/90 text-sm">
          <Plus className="w-4 h-4" /> Add Achievement
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-primary/50 rounded-lg p-6 space-y-4">
          <h3 className="font-bold font-mono text-primary">{editingId ? 'Edit Achievement' : 'Add Achievement'}</h3>
          <div className="space-y-1">
            <label className="text-sm font-medium">Title *</label>
            <input value={form.title} onChange={f('title')} placeholder="e.g. Smart India Hackathon Finalist"
              className="w-full bg-background border border-border rounded p-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Description *</label>
            <textarea value={form.description} onChange={f('description')} rows={3}
              placeholder="Describe what you achieved and its significance"
              className="w-full bg-background border border-border rounded p-2 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Date</label>
              <input value={form.date} onChange={f('date')} placeholder="e.g. 2025"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: Number(e.target.value) }))}
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
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

      <div className="space-y-3">
        {(achievements || []).sort((a, b) => a.sortOrder - b.sortOrder).map(ach => (
          <div key={ach.id} className="bg-card border border-border rounded-lg p-5 flex items-start gap-4">
            <div className="text-primary text-lg mt-0.5">▹</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground">{ach.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{ach.description}</p>
              {ach.date && <p className="text-xs text-primary/70 mt-1 font-mono">{ach.date}</p>}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => openEdit(ach)} className="p-2 hover:text-primary transition-colors text-muted-foreground">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(ach.id)} className="p-2 hover:text-destructive transition-colors text-muted-foreground">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {(!achievements || achievements.length === 0) && !showForm && (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
            No achievements added yet.
          </div>
        )}
      </div>
    </div>
  );
}
