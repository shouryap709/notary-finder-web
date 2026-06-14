import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

/** Same Supabase project the web marketplace uses. */
export const SUPABASE_URL = 'https://yjjrrenthbflammjqpva.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqanJyZW50aGJmbGFtbWpxcHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTYzOTEsImV4cCI6MjA5NTc3MjM5MX0.YSQ6NasbhdcSB5jXUJSxDZxTKmSGMpx3CdphqRNnUdw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type NotaryProfile = {
  id: string;
  full_name?: string;
  business_name?: string | null;
  email?: string;
  phone?: string | null;
  license_number?: string | null;
  state?: string | null;
  services?: string[] | null;
  home_address?: string | null;
  home_lat?: number | null;
  home_lng?: number | null;
  rating?: number;
  reviews_count?: number;
  verification_status?: string | null;
  notifications_enabled?: boolean | null;
  proof_photo_path?: string | null;
};

export type Job = {
  id: string;
  service_type?: string;
  services?: string[] | null;
  signatures?: number;
  notary_preference?: string;
  location_address?: string;
  date_time?: string | null;
  notes?: string | null;
  starting_price?: number;
  suggested_price?: number;
  status?: string;
  proof_photo_path?: string | null;
};

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signInNotary(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signUpOrInNotary(email: string, password: string, name: string) {
  const { data: up, error: upErr } = await supabase.auth.signUp({ email, password });
  if (!upErr && up.user) {
    if (!up.session) return { pendingVerification: true as const, email };
    await supabase.from('profiles').upsert({ id: up.user.id, role: 'notary', full_name: name, email });
    return { user: up.user };
  }
  const { data: inData, error: inErr } = await supabase.auth.signInWithPassword({ email, password });
  if (inErr) throw inErr;
  return { user: inData.user };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function fetchMyProfile(): Promise<NotaryProfile | null> {
  const session = await getSession();
  if (!session) return null;
  const { data } = await supabase
    .from('profiles')
    .select('id,full_name,business_name,email,phone,license_number,state,services,home_address,home_lat,home_lng,rating,reviews_count,verification_status,notifications_enabled')
    .eq('id', session.user.id)
    .maybeSingle();
  return data ?? null;
}

export async function updateMyProfile(patch: Partial<NotaryProfile>) {
  const session = await getSession();
  if (!session) throw new Error('Not signed in');
  const { error } = await supabase.from('profiles').update(patch).eq('id', session.user.id);
  if (error) throw error;
}

export async function fetchOpenJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('id,service_type,services,signatures,notary_preference,location_address,date_time,notes,starting_price,suggested_price,status,proof_photo_path')
    .eq('status', 'open')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchJob(id: string): Promise<Job | null> {
  const { data } = await supabase
    .from('jobs')
    .select('id,service_type,services,signatures,notary_preference,location_address,date_time,notes,starting_price,suggested_price,status,proof_photo_path')
    .eq('id', id)
    .maybeSingle();
  return data ?? null;
}

export async function placeBid(jobId: string, price: number, message: string) {
  const session = await getSession();
  if (!session) throw new Error('Not signed in');
  const { error } = await supabase.from('bids').insert({
    job_id: jobId, notary_id: session.user.id, price, message: message || null, status: 'pending',
  });
  if (error) throw error;
}
