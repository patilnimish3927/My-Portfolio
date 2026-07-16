import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useListCertificates } from '@workspace/api-client-react';
import { Award, X, ExternalLink, FileText, ZoomIn } from 'lucide-react';

interface CertType {
  id?: number;
  name: string;
  issuer: string;
  issueDate?: string | null;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  pdfUrl?: string | null;
}

const defaultCertificates: CertType[] = [
  { name: "Cyber Security Fundamentals", issuer: "HackerRank", issueDate: "2025" },
  { name: "Advanced Python", issuer: "HackerRank", issueDate: "2025" },
  { name: "Basic Python", issuer: "HackerRank", issueDate: "2024" },
  { name: "MSCIT", issuer: "MSBTE", issueDate: "2022" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function Certificates() {
  const { data: certificates } = useListCertificates();
  const [selected, setSelected] = useState<CertType | null>(null);
  const [pdfFallback, setPdfFallback] = useState(false);

  const displayList: CertType[] = certificates?.length ? certificates : defaultCertificates;

  // ESC to close modal
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const openCert = useCallback((cert: CertType) => {
    if (cert.imageUrl || cert.pdfUrl) {
      setPdfFallback(false);
      setSelected(cert);
    } else if (cert.credentialUrl) {
      window.open(cert.credentialUrl, '_blank', 'noreferrer');
    }
  }, []);

  const hasMedia = (cert: CertType) => !!(cert.imageUrl || cert.pdfUrl || cert.credentialUrl);

  return (
    <section id="certificates" className="py-24 bg-card border-y border-border relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-16 text-center"
        >
          <div className="flex items-center gap-4 mb-4">
            <Award className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold font-mono">
              <span className="text-primary">07.</span> Certifications
            </h2>
          </div>
          <div className="w-24 h-1 bg-primary rounded" />
          <p className="mt-4 text-muted-foreground max-w-lg text-sm">
            Verified credentials and professional certifications.
          </p>
        </motion.div>

        {/* Grid — 1 col mobile / 2 col tablet / 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((cert, idx) => (
            <motion.div
              key={cert.id ?? idx}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
              onClick={() => openCert(cert)}
              className={`group relative bg-background border border-border rounded-xl overflow-hidden transition-all duration-300
                hover:border-primary hover:shadow-[0_0_30px_rgba(var(--primary-rgb,168,85,247)/0.2)]
                ${hasMedia(cert) ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40 group-hover:from-primary group-hover:to-primary transition-all duration-300" />

              {/* Thumbnail if image exists */}
              {cert.imageUrl ? (
                <div className="relative overflow-hidden h-40 bg-muted">
                  <img
                    src={cert.imageUrl}
                    alt={cert.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              ) : cert.pdfUrl ? (
                <div className="h-40 bg-muted flex flex-col items-center justify-center gap-2 group-hover:bg-primary/5 transition-colors">
                  <FileText className="w-12 h-12 text-primary/60 group-hover:text-primary transition-colors" />
                  <span className="text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors">PDF Certificate</span>
                </div>
              ) : (
                <div className="h-40 bg-muted/30 flex items-center justify-center">
                  <Award className="w-14 h-14 text-primary/30 group-hover:text-primary/60 transition-colors" />
                </div>
              )}

              {/* Card body */}
              <div className="p-5">
                <h3 className="font-bold text-foreground text-base leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {cert.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {cert.issuer}{cert.issueDate ? ` • ${cert.issueDate}` : ''}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  {cert.imageUrl && (
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-primary/70 group-hover:text-primary transition-colors">
                      <ZoomIn className="w-3 h-3" /> View certificate
                    </span>
                  )}
                  {!cert.imageUrl && cert.pdfUrl && (
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-primary/70 group-hover:text-primary transition-colors">
                      <FileText className="w-3 h-3" /> Open PDF
                    </span>
                  )}
                  {!cert.imageUrl && !cert.pdfUrl && cert.credentialUrl && (
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-primary/70 group-hover:text-primary transition-colors">
                      <ExternalLink className="w-3 h-3" /> View credential
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Certificate Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-start justify-between p-5 border-b border-border shrink-0">
                <div>
                  <h3 className="font-bold text-foreground text-lg leading-tight">{selected.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {selected.issuer}{selected.issueDate ? ` • ${selected.issueDate}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-4 shrink-0">
                  {selected.credentialUrl && (
                    <a
                      href={selected.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Open credential link"
                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  {selected.pdfUrl && (
                    <a
                      href={selected.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Open PDF in new tab"
                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FileText className="w-5 h-5" />
                    </a>
                  )}
                  <button
                    onClick={() => setSelected(null)}
                    aria-label="Close"
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal body */}
              <div className="overflow-auto flex-1 p-5">
                {selected.imageUrl && (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={selected.imageUrl}
                    alt={selected.name}
                    className="w-full rounded-xl object-contain max-h-[70vh]"
                  />
                )}

                {!selected.imageUrl && selected.pdfUrl && !pdfFallback && (
                  <iframe
                    src={selected.pdfUrl}
                    title={selected.name}
                    className="w-full rounded-xl"
                    style={{ height: '70vh' }}
                    onError={() => setPdfFallback(true)}
                  />
                )}

                {!selected.imageUrl && selected.pdfUrl && pdfFallback && (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <FileText className="w-16 h-16 text-primary/50" />
                    <p className="text-muted-foreground text-sm">PDF preview not supported in this browser.</p>
                    <a
                      href={selected.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Open PDF in new tab
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
