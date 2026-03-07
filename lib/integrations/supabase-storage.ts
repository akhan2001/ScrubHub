import { createClient } from '@/lib/supabase/client';

const BUCKET = 'listing-photos';
const RESUMES_BUCKET = 'resumes';

const RESUME_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export async function uploadListingPhoto(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteListingPhoto(url: string): Promise<void> {
  const supabase = createClient();
  const path = url.split(`/${BUCKET}/`).pop();
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

export async function uploadResume(file: File): Promise<string> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in to upload a resume');

  if (!RESUME_MIME_TYPES.includes(file.type)) {
    throw new Error('Resume must be PDF or Word document');
  }

  const ext = file.name.split('.').pop() ?? 'pdf';
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(RESUMES_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  return path;
}
