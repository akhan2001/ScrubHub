import { createClient } from '@/lib/supabase/client';

const BUCKET = 'listing-photos';
const RESUMES_BUCKET = 'resumes';
const PAYSTUBS_BUCKET = 'pay-stubs';

const RESUME_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const PAYSTUB_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const PAYSTUB_MAX_BYTES = 10 * 1024 * 1024; // 10 MB, matches bucket policy

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

/**
 * Upload a pay stub to the private `pay-stubs` bucket. Path is scoped to the user.
 * Returns the storage path (not a public URL — bucket is private).
 */
export async function uploadPayStub(file: File): Promise<string> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in to upload a pay stub');

  if (!PAYSTUB_MIME_TYPES.includes(file.type)) {
    throw new Error('Pay stub must be a PDF or image (JPG/PNG)');
  }
  if (file.size > PAYSTUB_MAX_BYTES) {
    throw new Error('Pay stub must be 10 MB or smaller');
  }

  const ext = file.name.split('.').pop() ?? 'pdf';
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(PAYSTUBS_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  return path;
}

export async function deletePayStub(path: string): Promise<void> {
  if (!path) return;
  const supabase = createClient();
  await supabase.storage.from(PAYSTUBS_BUCKET).remove([path]);
}
