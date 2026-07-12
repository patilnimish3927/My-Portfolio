import React, { useEffect } from 'react';
import { useGetContact, useAdminUpdateContact } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

interface ContactForm {
  email: string;
  phone: string;
  location: string;
  hackerrank: string;
  showEmail: boolean;
  showPhone: boolean;
}

export default function AdminContact() {
  const { data: contact, isLoading, refetch } = useGetContact();
  const updateContact = useAdminUpdateContact();
  const { toast } = useToast();

  const { register, handleSubmit, reset } = useForm<ContactForm>({
    defaultValues: { email: '', phone: '', location: '', hackerrank: '', showEmail: false, showPhone: false },
  });

  useEffect(() => {
    if (contact) {
      reset({
        email: contact.email || '',
        phone: contact.phone || '',
        location: contact.location || '',
        hackerrank: contact.hackerrank || '',
        showEmail: contact.showEmail ?? false,
        showPhone: contact.showPhone ?? false,
      });
    }
  }, [contact, reset]);

  const onSubmit = (values: ContactForm) => {
    updateContact.mutate({
      data: {
        // GitHub and LinkedIn are hardcoded in the portfolio; keep DB in sync
        github: 'https://github.com/patilnimish3927',
        linkedin: 'https://www.linkedin.com/in/nimishpatil3927/',
        email: values.email.trim() || null,
        phone: values.phone.trim() || null,
        location: values.location.trim() || null,
        hackerrank: values.hackerrank.trim() || null,
        showEmail: values.showEmail,
        showPhone: values.showPhone,
      } as Parameters<typeof updateContact.mutate>[0]['data'],
    }, {
      onSuccess: () => { toast({ title: 'Contact updated' }); refetch(); },
      onError: () => toast({ title: 'Failed to update contact', variant: 'destructive' }),
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-mono border-b border-border pb-4">Contact Info</h2>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="mb-6 p-4 bg-muted rounded border border-border">
          <p className="text-sm font-medium text-muted-foreground mb-2">Fixed Links (hardcoded in portfolio)</p>
          <p className="text-sm font-mono">GitHub: <span className="text-primary">https://github.com/patilnimish3927</span></p>
          <p className="text-sm font-mono">LinkedIn: <span className="text-primary">https://www.linkedin.com/in/nimishpatil3927/</span></p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <input {...register('email')} placeholder="your@email.com"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Phone</label>
              <input {...register('phone')} placeholder="+91 XXXXX XXXXX"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Location</label>
              <input {...register('location')} placeholder="e.g. Pune, India"
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">HackerRank Profile URL</label>
              <input {...register('hackerrank')} placeholder="https://www.hackerrank.com/..."
                className="w-full bg-background border border-border rounded p-2 text-sm" />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Visibility</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('showEmail')} className="w-4 h-4 accent-primary" />
              <span className="text-sm">Show email publicly on portfolio</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('showPhone')} className="w-4 h-4 accent-primary" />
              <span className="text-sm">Show phone publicly on portfolio</span>
            </label>
          </div>

          <button type="submit" disabled={updateContact.isPending}
            className="bg-primary text-primary-foreground px-6 py-2 rounded font-medium hover:bg-primary/90 disabled:opacity-50 text-sm">
            {updateContact.isPending ? 'Saving...' : 'Save Contact Info'}
          </button>
        </form>
      </div>
    </div>
  );
}
