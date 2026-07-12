import React, { useState } from 'react';
import { useListCertificates, useAdminCreateCertificate, useAdminUpdateCertificate, useAdminDeleteCertificate } from '@workspace/api-client-react';
import type { Certificate } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, X, Check, Image } from 'lucide-react';

interface CertForm {
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
  imageUrl: string;
  sortOrder: number;
}
const empty: CertForm = { name: '', issuer: '', issueDate: '', credentialUrl: '', imageUrl: '', sortOrder: 0 };

export default function AdminCertificates() {
  const { data: certificates, refetch } = useListCertificates();
  const create = useAdminCreateCertificate();
  const update = useAdminUpdateCertificate();
  const del = useAdminDeleteCertificate();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CertForm>(empty);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const f = (key: keyof CertForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  const openAdd = () => { setForm(empty); setEditingId(null); setShowForm(true); };
  const openEdit = (c: Certificate) => {
    setForm({
      name: c.name, issuer: c.issuer, issueDate: c.issueDate || '',
      credentialUrl: c.credentialUrl || '', imageUrl: c.imageUrl || '', sortOrder: c.sortOrder,
    });
    setEditingId(c.id);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const handleSave = () => {
    const data = {
      name: form.name.trim(),
      issuer: form.issuer.trim(),
      issueDate: form.issueDate.trim() || null,
      credentialUrl: form.credentialUrl.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      sortOrder: form.sortOrder,
    };
    if (!data.name || !data.issuer) {
      toast({ title: 'Name and issuer are required', variant: 'destructive' });
      return;
    }
    if (editingId !== null) {
      update.mutate({ id: editingId, data }, {
        onSuccess: () => { toast({ title: 'Certificate updated' }); refetch(); closeForm(); },
        onError: () => toast({ title: 'Failed to update', variant: 'destructive' }),
      });
    } else {
      create.mutate({ data }, {
        onSuccess: () => { toast({ title: 'Certificate added' }); refetch(); closeForm(); },
        onError: () => toast({ title: 'Failed to add', variant: 'destructive' }),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this certificate?')) return;
    del.mutate({ id }, {
      onSuccess: () => { toast({ title: 'Certificate deleted' }); refetch(); },
      onError: () => toast({ title: 'Failed to delete', variant: 'destructive' }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-3xl font-bold font-mono">Certificates</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded font-medium hover:bg-primary/90 text-sm">
          <Plus className="w-4 h-4" /> Add Certificate
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-primary/50 rounded-lg p-6 space-y-4">
          <h3 className="font-bold font-mono text-primary">{editingId ? 'Edit Certificate' : 'Add Certificate'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Certificate Name *</label>
              <input value={form.name} onChange={f('name')} placeholder="e.g. Advanced Python"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Issuer *</label>
              <input value={form.issuer} onChange={f('issuer')} placeholder="e.g. HackerRank"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Issue Date</label>
              <input value={form.issueDate} onChange={f('issueDate')} placeholder="e.g. 2025"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: Number(e.target.value) }))}
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Certificate Image URL</label>
            <p className="text-xs text-muted-foreground">Upload your certificate image to any image host (e.g. Imgur, Cloudinary) and paste the URL here. Visitors can click the certificate to view it.</p>
            <input value={form.imageUrl} onChange={f('imageUrl')} placeholder="https://i.imgur.com/your-cert.jpg"
              className="w-full bg-background border border-border rounded p-2 text-sm" />
            {form.imageUrl && (
              <button type="button" onClick={() => setPreviewUrl(form.imageUrl)}
                className="text-xs text-primary hover:underline flex items-center gap-1">
                <Image className="w-3 h-3" /> Preview image
              </button>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Credential URL</label>
            <input value={form.credentialUrl} onChange={f('credentialUrl')} placeholder="https://www.hackerrank.com/certificates/..."
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

      {/* Image preview modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPreviewUrl(null)}>
          <div className="relative max-w-3xl w-full bg-card rounded-xl p-4" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewUrl(null)} className="absolute top-2 right-2 p-2 hover:bg-muted rounded">
              <X className="w-5 h-5" />
            </button>
            <img src={previewUrl} alt="Certificate preview" className="w-full rounded-lg object-contain max-h-[80vh]" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(certificates || []).sort((a, b) => a.sortOrder - b.sortOrder).map(cert => (
          <div key={cert.id} className="bg-card border border-border rounded-lg p-5 flex items-start justify-between gap-4">
            <div className="flex gap-3 items-start">
              {cert.imageUrl ? (
                <img src={cert.imageUrl} alt={cert.name}
                  className="w-12 h-12 rounded object-cover border border-border cursor-pointer hover:opacity-80"
                  onClick={() => setPreviewUrl(cert.imageUrl!)} />
              ) : (
                <div className="w-12 h-12 rounded bg-muted border border-border flex items-center justify-center">
                  <Image className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-foreground text-sm">{cert.name}</h3>
                <p className="text-xs text-muted-foreground">{cert.issuer}{cert.issueDate ? ` • ${cert.issueDate}` : ''}</p>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => openEdit(cert)} className="p-1.5 hover:text-primary transition-colors text-muted-foreground">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(cert.id)} className="p-1.5 hover:text-destructive transition-colors text-muted-foreground">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {(!certificates || certificates.length === 0) && !showForm && (
          <div className="col-span-2 text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
            No certificates added yet.
          </div>
        )}
      </div>
    </div>
  );
}
