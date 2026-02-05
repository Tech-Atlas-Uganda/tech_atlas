import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Fallback database operations using Supabase client
export async function createHubSupabase(data: any) {
  console.log('Creating hub with Supabase client:', data);
  
  const cleanData = {
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    focusAreas: data.focusAreas || null,
    location: data.location || null,
    address: data.address || null,
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    email: data.email || null,
    phone: data.phone || null,
    website: data.website || null,
    logo: data.logo || null,
    verified: data.verified ?? false,
    status: data.status || 'approved',
    createdBy: data.createdBy || 1,
    approvedBy: data.approvedBy || null,
  };

  const { data: result, error } = await supabase
    .from('hubs')
    .insert(cleanData)
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(`Failed to create hub: ${error.message}`);
  }

  return result;
}

export async function createCommunitySupabase(data: any) {
  console.log('Creating community with Supabase client:', data);
  
  const cleanData = {
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    focusAreas: data.focusAreas || null,
    type: data.type || null,
    location: data.location || null,
    memberCount: data.memberCount || null,
    email: data.email || null,
    website: data.website || null,
    slack: data.slack || null,
    discord: data.discord || null,
    telegram: data.telegram || null,
    twitter: data.twitter || null,
    logo: data.logo || null,
    verified: data.verified ?? false,
    status: data.status || 'approved',
    createdBy: data.createdBy || 1,
    approvedBy: data.approvedBy || null,
  };

  const { data: result, error } = await supabase
    .from('communities')
    .insert(cleanData)
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(`Failed to create community: ${error.message}`);
  }

  return result;
}

export async function createStartupSupabase(data: any) {
  console.log('Creating startup with Supabase client:', data);
  
  const cleanData = {
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    industry: data.industry || null,
    focusAreas: data.focusAreas || null,
    stage: data.stage || null,
    founded: data.founded || null,
    location: data.location || null,
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    teamSize: data.teamSize || null,
    email: data.email || null,
    website: data.website || null,
    twitter: data.twitter || null,
    linkedin: data.linkedin || null,
    logo: data.logo || null,
    verified: data.verified ?? false,
    status: data.status || 'approved',
    createdBy: data.createdBy || 1,
    approvedBy: data.approvedBy || null,
  };

  const { data: result, error } = await supabase
    .from('startups')
    .insert(cleanData)
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(`Failed to create startup: ${error.message}`);
  }

  return result;
}

// Get functions
export async function getHubsSupabase(filters?: { status?: string }) {
  let query = supabase.from('hubs').select('*');
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query.order('createdAt', { ascending: false });
  
  if (error) {
    console.error('Error fetching hubs:', error);
    return [];
  }
  
  return data || [];
}

export async function getCommunitiesSupabase(filters?: { status?: string }) {
  let query = supabase.from('communities').select('*');
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query.order('createdAt', { ascending: false });
  
  if (error) {
    console.error('Error fetching communities:', error);
    return [];
  }
  
  return data || [];
}

export async function getStartupsSupabase(filters?: { status?: string }) {
  let query = supabase.from('startups').select('*');
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query.order('createdAt', { ascending: false });
  
  if (error) {
    console.error('Error fetching startups:', error);
    return [];
  }
  
  return data || [];
}