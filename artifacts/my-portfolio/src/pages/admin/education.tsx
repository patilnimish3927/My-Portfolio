import React, { useState } from 'react';
import { useListEducation, useAdminCreateEducation, useAdminUpdateEducation, useAdminDeleteEducation } from '@workspace/api-client-react';
import type { Education } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

interface EduForm {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number | '';
  current: boolean;
  grade: string;
  description: string;
  sortOrder: number;
}

const empty: EduForm = {
  institution: '', degree: '', field: '', startYear: new Date().getFullYear(),
  endYear: '', current: false, grade: '', description: '', sortOrder: 0,
};

const toData = (f: EduForm) => ({
  institution: f.institution.trim(),
  degree: f.degree.trim(),
  field: f.field.trim(),
  startYear: f.startYear,
  endYear: f.endYear !== '' ? Number(f.endYear) : null,
  current: f.current,
  grade: f.grade.trim() || null,
  description: f.description.trim() || null,
  sortOrder: f.sortOrder,
});

export default function AdminEducation() {
  const { data: education, refetch } = useListEducation();
  const create = useAdminCreateEducation();
  const update = useAdminUpdateEducation();
  const del = useAdminDeleteEducation();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EduForm>(empty);

  const openAdd = () => { setForm(empty); setEditingId(null); setShowForm(true); };
  const openEdit = (e: Education) => {
    setForm({
      institution: e.institution, degree: e.degree, field: e.field,
      startYear: e.startYear, endYear: e.endYear ?? '', current: e.current ?? false,
      grade: e.grade || '', description: e.description || '', sortOrder: e.sortOrder,
    });
    setEditingId(e.id);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const handleSave = () => {
    const data = toData(form);
    if (!data.institution || !data.degree || !data.field) {
      toast({ title: 'Institution, degree and field are required', variant: 'destructive' });
      return;
    }
    if (editingId !== null) {
      update.mutate({ id: editingId, data }, {
        onSuccess: () => { toast({ title: 'Education updated' }); refetch(); closeForm(); },
        onError: () => toast({ title: 'Failed to update', variant: 'destructive' }),
      });
    } else {
      create.mutate({ data }, {
        onSuccess: () => { toast({ title: 'Education added' }); refetch(); closeForm(); },
        onError: () => toast({ title: 'Failed to add', variant: 'destructive' }),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this education entry?')) return;
    del.mutate({ id }, {
      onSuccess: () => { toast({ title: 'Education deleted' }); refetch(); },
      onError: () => toast({ title: 'Failed to delete', variant: 'destructive' }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-3xl font-bold font-mono">Education</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded font-medium hover:bg-primary/90 text-sm">
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-primary/50 rounded-lg p-6 space-y-4">
          <h3 className="font-bold font-mono text-primary">{editingId ? 'Edit Education' : 'Add Education'}</h3>
          <div className="space-y-1">
            <label className="text-sm font-medium">Institution *</label>
            <input value={form.institution} onChange={e => setForm(p => ({ ...p, institution: e.target.value }))}
              placeholder="e.g. Savitribai Phule Pune University"
              className="w-full bg-background border border-border rounded p-2 text-sm" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Degree *</label>
              <input value={form.degree} onChange={e => setForm(p => ({ ...p, degree: e.target.value }))}
                placeholder="e.g. B.E."
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Field *</label>
              <input value={form.field} onChange={e => setForm(p => ({ ...p, field: e.target.value }))}
                placeholder="e.g. Computer Engineering (AI & ML)"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Start Year *</label>
              <input type="number" value={form.startYear} onChange={e => setForm(p => ({ ...p, startYear: Number(e.target.value) }))}
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">End Year</label>
              <input type="number" value={form.endYear} onChange={e => setForm(p => ({ ...p, endYear: e.target.value ? Number(e.target.value) : '' }))}
                disabled={form.current} placeholder="Leave blank if ongoing"
                className="w-full bg-background border border-border rounded p-2 text-sm disabled:opacity-50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Grade / CGPA</label>
              <input value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))}
                placeholder="e.g. 8.5 CGPA"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: Number(e.target.value) }))}
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.current} onChange={e => setForm(p => ({ ...p, current: e.target.checked }))}
              className="w-4 h-4 accent-primary" />
            <span className="text-sm font-medium">Currently studying here</span>
          </label>
          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2}
              placeholder="Optional notes about this education"
              className="w-full bg-background border border-border rounded p-2 text-sm resize-none" />
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
        {(education || []).sort((a, b) => a.sortOrder - b.sortOrder).map(edu => (
          <div key={edu.id} className="bg-card border border-border rounded-lg p-5 flex items-start justify-between">
            <div>
              <h3 className="font-bold text-foreground">{edu.institution}</h3>
              <p className="text-sm text-primary">{edu.degree} — {edu.field}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {edu.startYear} → {edu.current ? 'Present' : (edu.endYear || '—')}
                {edu.grade && ` • ${edu.grade}`}
              </p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(edu)} className="p-2 hover:text-primary transition-colors text-muted-foreground">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(edu.id)} className="p-2 hover:text-destructive transition-colors text-muted-foreground">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {(!education || education.length === 0) && !showForm && (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
            No education entries yet.
          </div>
        )}
      </div>
    </div>
  );
}
