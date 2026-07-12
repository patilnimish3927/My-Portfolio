import React, { useEffect, useState } from 'react';
import { useGetPortfolioSettings, useAdminUpdateSettings } from '@workspace/api-client-react';
import type { PortfolioSettings } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

const STYLES = [
  { id: 'industrial', name: 'Industrial Developer' },
  { id: 'anime', name: 'Anime / Neon' },
  { id: 'cybersecurity', name: 'Cybersecurity' },
  { id: 'gaming', name: 'Gaming RGB' },
  { id: 'space', name: 'Deep Space' },
  { id: 'japanese', name: 'Japanese Zen' },
  { id: 'mixed', name: 'Mixed Gradient' },
];

type SettingsForm = Omit<PortfolioSettings, 'id'>;

const defaults: SettingsForm = {
  theme: 'dark', style: 'industrial',
  animationsEnabled: true, cursorEffects: true,
  particleEffects: true, soundEnabled: false,
  performanceMode: false, hiringEnabled: true,
};

export default function AdminSettings() {
  const { data: settings, isLoading, refetch } = useGetPortfolioSettings();
  const updateSettings = useAdminUpdateSettings();
  const { toast } = useToast();
  const [form, setForm] = useState<SettingsForm>(defaults);

  useEffect(() => {
    if (settings) {
      setForm({
        theme: settings.theme,
        style: settings.style,
        animationsEnabled: settings.animationsEnabled,
        cursorEffects: settings.cursorEffects,
        particleEffects: settings.particleEffects,
        soundEnabled: settings.soundEnabled,
        performanceMode: settings.performanceMode,
        hiringEnabled: settings.hiringEnabled ?? true,
      });
    }
  }, [settings]);

  const toggle = (key: keyof SettingsForm) => () =>
    setForm(p => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    updateSettings.mutate({ data: form }, {
      onSuccess: () => { toast({ title: 'Settings saved' }); refetch(); },
      onError: () => toast({ title: 'Failed to save settings', variant: 'destructive' }),
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-mono border-b border-border pb-4">Portfolio Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Hiring toggle - highlighted */}
        <div className="lg:col-span-2 bg-card border-2 border-primary/50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold font-mono text-primary text-lg">Disable Hiring</h3>
              <p className="text-sm text-muted-foreground mt-1">
                When <span className="text-destructive font-medium">ON</span> — the "Contact Me" button is hidden from the public portfolio and no one can contact you.<br />
                When <span className="text-green-500 font-medium">OFF</span> — the "Contact Me" button is visible and working normally.
              </p>
            </div>
            <button
              onClick={toggle('hiringEnabled')}
              className={`relative w-16 h-8 rounded-full transition-colors shrink-0 ${
                form.hiringEnabled ? 'bg-green-500' : 'bg-destructive'
              }`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                form.hiringEnabled ? 'translate-x-9' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <p className="text-xs font-mono mt-3 text-muted-foreground">
            Current status: {form.hiringEnabled
              ? <span className="text-green-500">● Hiring enabled — Contact Me button is visible</span>
              : <span className="text-destructive">● Hiring disabled — Contact Me button is hidden</span>}
          </p>
        </div>

        {/* Theme */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="font-bold font-mono">Theme</h3>
          <div className="grid grid-cols-3 gap-2">
            {['light', 'dark', 'system'].map(t => (
              <button key={t} onClick={() => setForm(p => ({ ...p, theme: t }))}
                className={`py-2 px-3 text-sm rounded border capitalize transition-colors ${
                  form.theme === t ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="font-bold font-mono">Aesthetic Style</h3>
          <div className="space-y-2">
            {STYLES.map(s => (
              <button key={s.id} onClick={() => setForm(p => ({ ...p, style: s.id }))}
                className={`w-full flex items-center justify-between py-2 px-4 rounded border text-left text-sm transition-colors ${
                  form.style === s.id ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                }`}>
                <span>{s.name}</span>
                {form.style === s.id && <span className="w-2 h-2 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </div>

        {/* Effects */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4 lg:col-span-2">
          <h3 className="font-bold font-mono">Effects & Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {([
              { key: 'animationsEnabled', label: 'Animations', desc: 'Framer Motion scroll reveals' },
              { key: 'cursorEffects', label: 'Custom Cursor', desc: 'Glow cursor effect' },
              { key: 'particleEffects', label: 'Particles', desc: 'Background particle effects' },
              { key: 'soundEnabled', label: 'Sound', desc: 'UI interaction sounds' },
              { key: 'performanceMode', label: 'Performance Mode', desc: 'Reduce effects for speed' },
            ] as Array<{ key: keyof SettingsForm; label: string; desc: string }>).map(({ key, label, desc }) => (
              <div key={key} className="flex items-start gap-3 p-3 border border-border rounded bg-background">
                <button onClick={toggle(key)}
                  className={`relative w-10 h-5 rounded-full mt-0.5 shrink-0 transition-colors ${form[key] ? 'bg-primary' : 'bg-muted'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={updateSettings.isPending}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded font-medium hover:bg-primary/90 disabled:opacity-50">
        <Save className="w-4 h-4" /> {updateSettings.isPending ? 'Saving...' : 'Save All Settings'}
      </button>
    </div>
  );
}
