import React, { useState } from 'react';
import { useListSkills, useAdminCreateSkill, useAdminUpdateSkill, useAdminDeleteSkill } from '@workspace/api-client-react';
import type { Skill } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

interface SkillForm {
  name: string;
  category: string;
  level: number;
  icon: string;
  sortOrder: number;
}

const empty: SkillForm = { name: '', category: '', level: 80, icon: '', sortOrder: 0 };

const CATEGORIES = ['Programming', 'Frontend', 'Backend', 'Databases', 'AI & ML', 'Tools', 'Other'];

export default function AdminSkills() {
  const { data: skills, refetch } = useListSkills();
  const createSkill = useAdminCreateSkill();
  const updateSkill = useAdminUpdateSkill();
  const deleteSkill = useAdminDeleteSkill();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SkillForm>(empty);

  const openAdd = () => { setForm(empty); setEditingId(null); setShowForm(true); };
  const openEdit = (s: Skill) => {
    setForm({ name: s.name, category: s.category, level: s.level, icon: s.icon || '', sortOrder: s.sortOrder });
    setEditingId(s.id);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const handleSave = () => {
    const data = {
      name: form.name.trim(),
      category: form.category.trim(),
      level: form.level,
      icon: form.icon.trim() || null,
      sortOrder: form.sortOrder,
    };
    if (!data.name || !data.category) {
      toast({ title: 'Name and category are required', variant: 'destructive' });
      return;
    }
    if (editingId !== null) {
      updateSkill.mutate({ id: editingId, data }, {
        onSuccess: () => { toast({ title: 'Skill updated' }); refetch(); closeForm(); },
        onError: () => toast({ title: 'Failed to update skill', variant: 'destructive' }),
      });
    } else {
      createSkill.mutate({ data }, {
        onSuccess: () => { toast({ title: 'Skill added' }); refetch(); closeForm(); },
        onError: () => toast({ title: 'Failed to add skill', variant: 'destructive' }),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this skill?')) return;
    deleteSkill.mutate({ id }, {
      onSuccess: () => { toast({ title: 'Skill deleted' }); refetch(); },
      onError: () => toast({ title: 'Failed to delete skill', variant: 'destructive' }),
    });
  };

  const grouped = (skills || []).reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-3xl font-bold font-mono">Technical Arsenal</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded font-medium hover:bg-primary/90 text-sm">
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-card border border-primary/50 rounded-lg p-6 space-y-4">
          <h3 className="font-bold font-mono text-primary">{editingId ? 'Edit Skill' : 'Add New Skill'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Skill Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Python" className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Category *</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-background border border-border rounded p-2 text-sm">
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Level (0–100): {form.level}%</label>
              <input type="range" min={0} max={100} value={form.level}
                onChange={e => setForm(p => ({ ...p, level: Number(e.target.value) }))}
                className="w-full accent-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: Number(e.target.value) }))}
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={createSkill.isPending || updateSkill.isPending}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
              <Check className="w-4 h-4" /> {editingId ? 'Update' : 'Add Skill'}
            </button>
            <button onClick={closeForm} className="flex items-center gap-2 border border-border px-4 py-2 rounded text-sm hover:bg-muted">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Skills grouped by category */}
      {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([category, items]) => (
        <div key={category} className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-6 py-3 bg-muted border-b border-border">
            <h3 className="font-mono font-bold text-primary">{category}</h3>
          </div>
          <div className="divide-y divide-border">
            {items.sort((a, b) => a.sortOrder - b.sortOrder).map(skill => (
              <div key={skill.id} className="flex items-center gap-4 px-6 py-3">
                <div className="flex-1">
                  <span className="font-medium text-sm">{skill.name}</span>
                  <div className="w-48 h-1.5 bg-background rounded-full mt-1 border border-border overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
                <span className="text-xs font-mono text-muted-foreground w-10 text-right">{skill.level}%</span>
                <button onClick={() => openEdit(skill)} className="p-1.5 hover:text-primary transition-colors text-muted-foreground">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(skill.id)} className="p-1.5 hover:text-destructive transition-colors text-muted-foreground">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {(!skills || skills.length === 0) && !showForm && (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
          No skills yet. Click "Add Skill" to get started.
        </div>
      )}
    </div>
  );
}
