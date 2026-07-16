import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useGetProfile, useAdminUpdateProfile } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileFormValues {
  name: string;
  headline: string;
  bio: string;
  location: string;
  githubUsername: string;
  profileImageUrl: string;
  resumeUrl: string;
}

export default function AdminProfile() {
  const { data: profile, isLoading } = useGetProfile();
  const updateProfile = useAdminUpdateProfile();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
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
          <label className="text-sm font-medium">Name *</label>
          <input
            {...form.register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
            className="w-full bg-background border border-border rounded p-2"
          />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Headline *</label>
          <input
            {...form.register('headline', { required: 'Headline is required' })}
            className="w-full bg-background border border-border rounded p-2"
          />
          {form.formState.errors.headline && (
            <p className="text-xs text-destructive">{form.formState.errors.headline.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Bio *</label>
          <textarea
            {...form.register('bio', { required: 'Bio is required' })}
            rows={5}
            className="w-full bg-background border border-border rounded p-2 resize-none"
          />
          {form.formState.errors.bio && (
            <p className="text-xs text-destructive">{form.formState.errors.bio.message}</p>
          )}
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
          <input {...form.register('profileImageUrl')} placeholder="https://..." className="w-full bg-background border border-border rounded p-2" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Resume URL (PDF link for download button)</label>
          <input {...form.register('resumeUrl')} placeholder="https://..." className="w-full bg-background border border-border rounded p-2" />
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
