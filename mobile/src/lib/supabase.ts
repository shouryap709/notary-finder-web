import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

/**
 * Same Supabase project the web marketplace uses. Override these via your own
 * env mechanism in production; hardcoded here to match notary-marketplace.html.
 */
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
  rating?: number;
  reviews_count?: number;
  verification_status?: string | null;
  services?: string[] | null;
  home_lat?: number | null;
  home_lng?: number | null;
};

export type Job = {
  id: string;
  service_type?: string;
  services?: string[] | null;
  signatures?: number;
  notary_preference?: string;
  location_address?: string;
  location_lat?: number | null;
  location_lng?: number | null;
  date_time?: string | null;
  notes?: string | null;
  starting_price?: number;
  suggested_price?: number;
  status?: string;
};

/** Mirror of sbAuthNotary on web — sign up, falling back to sign-in. */
export async function signUpOrInNotary(
  email: string,
  password: string,
  profile: { name: string; phone?: string; license?: string },
) {
  const { data: up, error: upErr } = await supabase.auth.signUp({ email, password });
  if (!upErr && up.user) {
    if (!up.session) return { pendingVerification: true as const, email };
    await supabase.from('profiles').upsert({
      id: up.user.id,
      role: 'notary',
      full_name: profile.name,
      email,
      phone: profile.phone ?? null,
      license_number: profile.license ?? null,
      terms_accepted_at: new Date().toISOString(),
    });
    return { user: up.user };
  }
  const { data: inData, error: inErr } = await supabase.auth.signInWithPassword({ email, password });
  if (inErr) throw inErr;
  return { user: inData.user };
}

export async function signInNotary(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signOut() {
  await supabase.auth.signOut();
}

/** Fetch the signed-in notary's own profile. */
export async function fetchMyProfile(): Promise<NotaryProfile | null> {
  const session = await getSession();
  if (!session) return null;
  const { data } = await supabase
    .from('profiles')
    .select('id,full_name,business_name,email,phone,license_number,rating,reviews_count,verification_status,services,home_lat,home_lng')
    .eq('id', session.user.id)
    .maybeSingle();
  return data ?? null;
}

/** Fetch a single job by id. */
export async function fetchJob(id: string): Promise<Job | null> {
  const { data } = await supabase
    .from('jobs')
    .select('id,service_type,services,signatures,notary_preference,location_address,location_lat,location_lng,date_time,notes,starting_price,suggested_price,status')
    .eq('id', id)
    .maybeSingle();
  return data ?? null;
}

/** Insert a bid on a job as the signed-in notary. */
export async function placeBid(jobId: string, price: number, message: string) {
  const session = await getSession();
  if (!session) throw new Error('Not signed in');
  const { error } = await supabase.from('bids').insert({
    job_id: jobId,
    notary_id: session.user.id,
    price,
    message: message || null,
    status: 'pending',
  });
  if (error) throw error;
}

/** Fetch open jobs available to bid on. */
export async function fetchOpenJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('id,service_type,services,signatures,notary_preference,location_address,location_lat,location_lng,date_time,notes,starting_price,suggested_price,status')
    .eq('status', 'open')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
