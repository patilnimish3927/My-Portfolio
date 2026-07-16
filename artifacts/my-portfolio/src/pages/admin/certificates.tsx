import React, { useState, useRef } from 'react';
import { useListCertificates, useAdminCreateCertificate, useAdminUpdateCertificate, useAdminDeleteCertificate } from '@workspace/api-client-react';
import type { Certificate } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, X, Check, Image, FileText, Upload, Loader2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

interface CertForm {
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
  imageUrl: string;
  pdfUrl: string;
  sortOrder: number;
}
const empty: CertForm = { name: '', issuer: '', issueDate: '', credentialUrl: '', imageUrl: '', pdfUrl: '', sortOrder: 0 };

// ── File upload helper ────────────────────────────────────────────────────────
async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/api/admin/upload`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' })) as { error?: string };
    throw new Error(err.error ?? 'Upload failed');
  }
  const data = await res.json() as { url: string };
  return data.url;
}

// ── Uploader row component ────────────────────────────────────────────────────
function FileUploadRow({
  label, accept, currentUrl, onUploaded, icon,
}: {
  label: string;
  accept: string;
  currentUrl: string;
  onUploaded: (url: string) => void;
  icon: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onUploaded(url);
      toast({ title: `${label} uploaded` });
    } catch (e) {
      toast({ title: (e as Error).message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2 items-center">
        <input
          value={currentUrl}
          onChange={e => onUploaded(e.target.value)}
          placeholder={`Paste URL or upload file`}
          className="flex-1 bg-background border border-border rounded p-2 text-sm min-w-0"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 border border-border px-3 py-2 rounded text-sm hover:bg-muted disabled:opacity-50 shrink-0"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
        />
      </div>
      {currentUrl && (
        <div className="flex items-center gap-1 text-xs text-primary/70">
          {icon}
          <span className="truncate max-w-xs">{currentUrl}</span>
          <button type="button" onClick={() => onUploaded('')} className="ml-1 text-destructive hover:text-destructive/80">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
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

  const setField = (key: keyof CertForm) => (val: string | number) =>
    setForm(p => ({ ...p, [key]: val }));

  const openAdd = () => { setForm(empty); setEditingId(null); setShowForm(true); };
  const openEdit = (c: Certificate) => {
    setForm({
      name: c.name, issuer: c.issuer, issueDate: c.issueDate ?? '',
      credentialUrl: c.credentialUrl ?? '', imageUrl: c.imageUrl ?? '',
      pdfUrl: (c as Certificate & { pdfUrl?: string | null }).pdfUrl ?? '',
      sortOrder: c.sortOrder,
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
      pdfUrl: form.pdfUrl.trim() || null,
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

  const move = (idx: number, dir: -1 | 1) => {
    const list = [...(certificates ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
    const target = list[idx + dir];
    const current = list[idx];
    if (!target || !current) return;
    update.mutate({ id: current.id, data: { ...current, sortOrder: target.sortOrder } }, {
      onSuccess: () => {
        update.mutate({ id: target.id, data: { ...target, sortOrder: current.sortOrder } }, {
          onSuccess: () => refetch(),
        });
      },
    });
  };

  const sorted = [...(certificates ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-3xl font-bold font-mono">Certificates</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded font-medium hover:bg-primary/90 text-sm">
          <Plus className="w-4 h-4" /> Add Certificate
        </button>
      </div>

      {/* ── Add / Edit form ─────────────────────────────────── */}
      {showForm && (
        <div className="bg-card border border-primary/50 rounded-lg p-6 space-y-4">
          <h3 className="font-bold font-mono text-primary">{editingId ? 'Edit Certificate' : 'Add Certificate'}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Certificate Name *</label>
              <input value={form.name} onChange={e => setField('name')(e.target.value)}
                placeholder="e.g. Advanced Python"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Issuer *</label>
              <input value={form.issuer} onChange={e => setField('issuer')(e.target.value)}
                placeholder="e.g. HackerRank"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Issue Date</label>
              <input value={form.issueDate} onChange={e => setField('issueDate')(e.target.value)}
                placeholder="e.g. June 2025"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Sort Order</label>
              <input type="number" value={form.sortOrder}
                onChange={e => setField('sortOrder')(Number(e.target.value))}
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
          </div>

          {/* Image upload */}
          <FileUploadRow
            label="Certificate Image"
            accept="image/jpeg,image/png,image/webp,image/gif"
            currentUrl={form.imageUrl}
            onUploaded={url => setField('imageUrl')(url)}
            icon={<Image className="w-3 h-3" />}
          />

          {/* PDF upload */}
          <FileUploadRow
            label="Certificate PDF"
            accept="application/pdf"
            currentUrl={form.pdfUrl}
            onUploaded={url => setField('pdfUrl')(url)}
            icon={<FileText className="w-3 h-3" />}
          />

          {/* Credential link */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Credential URL (optional)</label>
            <input value={form.credentialUrl} onChange={e => setField('credentialUrl')(e.target.value)}
              placeholder="https://www.hackerrank.com/certificates/..."
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

      {/* ── Image preview modal ─────────────────────────────── */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setPreviewUrl(null)}>
          <div className="relative max-w-3xl w-full bg-card rounded-xl p-4" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewUrl(null)}
              className="absolute top-2 right-2 p-2 hover:bg-muted rounded">
              <X className="w-5 h-5" />
            </button>
            <img src={previewUrl} alt="Preview" className="w-full rounded-lg object-contain max-h-[80vh]" />
          </div>
        </div>
      )}

      {/* ── Certificate list ────────────────────────────────── */}
      <div className="space-y-3">
        {sorted.map((cert, idx) => (
          <div key={cert.id}
            className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
            {/* Reorder */}
            <div className="flex flex-col gap-0.5 shrink-0">
              <button onClick={() => move(idx, -1)} disabled={idx === 0}
                className="p-1 hover:text-primary text-muted-foreground disabled:opacity-30 transition-colors">
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <GripVertical className="w-4 h-4 text-muted-foreground/40 mx-auto" />
              <button onClick={() => move(idx, 1)} disabled={idx === sorted.length - 1}
                className="p-1 hover:text-primary text-muted-foreground disabled:opacity-30 transition-colors">
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Thumbnail */}
            {cert.imageUrl ? (
              <img src={cert.imageUrl} alt={cert.name}
                className="w-14 h-14 rounded object-cover border border-border cursor-pointer hover:opacity-80 shrink-0"
                onClick={() => setPreviewUrl(cert.imageUrl!)} />
            ) : (cert as Certificate & { pdfUrl?: string | null }).pdfUrl ? (
              <div className="w-14 h-14 rounded bg-muted border border-border flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-primary/60" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded bg-muted border border-border flex items-center justify-center shrink-0">
                <Image className="w-5 h-5 text-muted-foreground" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate">{cert.name}</h3>
              <p className="text-xs text-muted-foreground">{cert.issuer}{cert.issueDate ? ` • ${cert.issueDate}` : ''}</p>
              <div className="flex gap-2 mt-1">
                {cert.imageUrl && <span className="text-xs text-primary/60 flex items-center gap-0.5"><Image className="w-3 h-3" /> image</span>}
                {(cert as Certificate & { pdfUrl?: string | null }).pdfUrl && <span className="text-xs text-primary/60 flex items-center gap-0.5"><FileText className="w-3 h-3" /> pdf</span>}
                {cert.credentialUrl && <span className="text-xs text-primary/60">🔗 link</span>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1 shrink-0">
              <button onClick={() => openEdit(cert)}
                className="p-1.5 hover:text-primary text-muted-foreground transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(cert.id)}
                className="p-1.5 hover:text-destructive text-muted-foreground transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {sorted.length === 0 && !showForm && (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
            No certificates added yet. Click "Add Certificate" to get started.
          </div>
        )}
      </div>
    </div>
  );
}
