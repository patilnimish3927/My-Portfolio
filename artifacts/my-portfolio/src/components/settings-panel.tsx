import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X } from 'lucide-react';
import { useGetPortfolioSettings, useAdminUpdateSettings } from '@workspace/api-client-react';
import { useTheme } from '@/components/theme-provider';

const styles = [
  { id: 'industrial', name: 'Industrial Developer' },
  { id: 'anime', name: 'Anime / Neon' },
  { id: 'cybersecurity', name: 'Cybersecurity' },
  { id: 'gaming', name: 'Gaming RGB' },
  { id: 'space', name: 'Deep Space' },
  { id: 'japanese', name: 'Japanese Zen' },
  { id: 'mixed', name: 'Mixed Gradient' }
];

export default function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: settings } = useGetPortfolioSettings();
  const updateSettings = useAdminUpdateSettings();
  const { theme, setTheme } = useTheme();

  // Local fallback if API is not updating live for guest
  const handleStyleChange = (styleId: string) => {
    document.documentElement.setAttribute('data-style', styleId);
    // If admin is logged in, this would save to DB. We fire it anyway; if unauthorized it'll just fail silently
    updateSettings.mutate({ data: { ...(settings as any), style: styleId } }, { onError: () => {} });
  };

  const handleCursorToggle = (enabled: boolean) => {
    if (enabled) document.body.classList.add('custom-cursor-enabled');
    else document.body.classList.remove('custom-cursor-enabled');
    updateSettings.mutate({ data: { ...(settings as any), cursorEffects: enabled } }, { onError: () => {} });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-110 transition-transform"
        aria-label="Open Settings"
      >
        <Settings className="w-5 h-5 animate-[spin_4s_linear_infinite]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full max-w-sm h-full bg-card border-l border-border z-50 p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold font-mono">System Preferences</h2>
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Color Mode</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['light', 'dark', 'system'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t as any)}
                        className={`py-2 px-3 text-sm rounded border ${theme === t ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'}`}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Aesthetic Style</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {styles.map((s) => {
                      const isActive = (document.documentElement.getAttribute('data-style') || 'industrial') === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => handleStyleChange(s.id)}
                          className={`flex items-center justify-between py-3 px-4 rounded border text-left transition-colors ${isActive ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'}`}
                        >
                          <span className="font-medium">{s.name}</span>
                          {isActive && <span className="w-2 h-2 rounded-full bg-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Effects</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span>Custom Cursor</span>
                      <div className="relative">
                        <input type="checkbox" className="sr-only peer" 
                          checked={document.body.classList.contains('custom-cursor-enabled')}
                          onChange={(e) => handleCursorToggle(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </label>
                  </div>
                </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
