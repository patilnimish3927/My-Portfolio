import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useListCertificates } from '@workspace/api-client-react';
import { Award, X, ExternalLink } from 'lucide-react';

interface CertType {
  id?: number;
  name: string;
  issuer: string;
  issueDate?: string | null;
  credentialUrl?: string | null;
  imageUrl?: string | null;
}

export default function Certificates() {
  const { data: certificates } = useListCertificates();
  const [selectedCert, setSelectedCert] = useState<CertType | null>(null);

  const defaultCertificates: CertType[] = [
    { name: "Cyber Security Fundamentals", issuer: "HackerRank", issueDate: "2025", credentialUrl: null, imageUrl: null },
    { name: "Advanced Python", issuer: "HackerRank", issueDate: "2025", credentialUrl: null, imageUrl: null },
    { name: "Basic Python", issuer: "HackerRank", issueDate: "2024", credentialUrl: null, imageUrl: null },
    { name: "MSCIT", issuer: "MSBTE", issueDate: "2022", credentialUrl: null, imageUrl: null },
  ];

  const displayCert: CertType[] = certificates?.length ? certificates : defaultCertificates;

  const handleCertClick = (cert: CertType) => {
    if (cert.imageUrl) {
      setSelectedCert(cert);
    } else if (cert.credentialUrl) {
      window.open(cert.credentialUrl, '_blank', 'noreferrer');
    }
  };

  return (
    <section id="certificates" className="py-24 bg-card border-y border-border relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-4 mb-4">
            <Award className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold font-mono">
              <span className="text-primary">07.</span> Certifications
            </h2>
          </div>
          <div className="w-24 h-1 bg-primary rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCert.map((cert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onClick={() => handleCertClick(cert)}
              className={`p-6 border border-border bg-background rounded group hover:bg-primary hover:border-primary transition-all flex flex-col items-center text-center justify-center aspect-square ${
                cert.imageUrl || cert.credentialUrl ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <Award className="w-10 h-10 mb-4 text-primary group-hover:text-primary-foreground transition-colors" />
              <h3 className="font-bold text-foreground group-hover:text-primary-foreground mb-2 leading-tight">
                {cert.name}
              </h3>
              <div className="text-sm text-muted-foreground group-hover:text-primary-foreground/80 mt-auto">
                {cert.issuer}{cert.issueDate ? ` • ${cert.issueDate}` : ''}
              </div>
              {(cert.imageUrl || cert.credentialUrl) && (
                <div className="mt-2 text-xs text-primary group-hover:text-primary-foreground/70 font-mono">
                  {cert.imageUrl ? 'Click to view' : 'Click to open'}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedCert && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-card border border-border rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto"
              >
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{selectedCert.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedCert.issuer}{selectedCert.issueDate ? ` • ${selectedCert.issueDate}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedCert.credentialUrl && (
                      <a
                        href={selectedCert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Open credential"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedCert(null)}
                      className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <img
                    src={selectedCert.imageUrl!}
                    alt={selectedCert.name}
                    className="w-full rounded-lg object-contain max-h-[70vh]"
                  />
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
