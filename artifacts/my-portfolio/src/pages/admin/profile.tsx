import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useGetProfile, useAdminUpdateProfile } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  name: z.string().min(2),
  headline: z.string().min(5),
  bio: z.string().min(10),
  location: z.string().min(2),
  githubUsername: z.string().min(1),
  profileImageUrl: z.string().url().optional().or(z.literal('')),
  resumeUrl: z.string().url().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AdminProfile() {
  const { data: profile, isLoading } = useGetProfile();
  const updateProfile = useAdminUpdateProfile();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      headline: '',
      bio: '',
      location: '',
      githubUsername: '',
      profileImageUrl: '',
      resumeUrl: '',
    }
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || '',
        headline: profile.headline || '',
        bio: profile.bio || '',
        location: profile.location || '',
        githubUsername: profile.githubUsername || '',
        profileImageUrl: profile.profileImageUrl || '',
        resumeUrl: profile.resumeUrl || '',
      });
    }
  }, [profile, form]);

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: 'Profile updated successfully' });
      },
      onError: () => {
        toast({ title: 'Failed to update profile', variant: 'destructive' });
      }
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-mono border-b border-border pb-4">Edit Profile</h2>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-lg">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input {...form.register('name')} className="w-full bg-background border border-border rounded p-2" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Headline</label>
          <input {...form.register('headline')} className="w-full bg-background border border-border rounded p-2" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <textarea {...form.register('bio')} rows={5} className="w-full bg-background border border-border rounded p-2 resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <input {...form.register('location')} className="w-full bg-background border border-border rounded p-2" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">GitHub Username</label>
            <input {...form.register('githubUsername')} className="w-full bg-background border border-border rounded p-2" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Profile Image URL</label>
          <input {...form.register('profileImageUrl')} className="w-full bg-background border border-border rounded p-2" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Resume URL (PDF)</label>
          <input {...form.register('resumeUrl')} className="w-full bg-background border border-border rounded p-2" />
        </div>

        <button 
          type="submit" 
          disabled={updateProfile.isPending}
          className="bg-primary text-primary-foreground px-6 py-2 rounded font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {updateProfile.isPending ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
