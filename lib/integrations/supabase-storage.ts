import { createClient } from '@/lib/supabase/client';

const BUCKET = 'listing-photos';

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
