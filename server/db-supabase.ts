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

export async function createGigSupabase(data: any) {
  console.log('Creating gig with Supabase client:', data);
  
  const cleanData = {
    title: data.title,
    slug: data.slug,
    description: data.description || null,
    requirements: data.requirements || null,
    category: data.category || null,
    budget: data.budget || null,
    currency: data.currency || 'UGX',
    duration: data.duration || null,
    skills: data.skills || null,
    remote: data.remote ?? true,
    location: data.location || null,
    contactEmail: data.contactEmail || null,
    contactPhone: data.contactPhone || null,
    featured: data.featured ?? false,
    expiresAt: data.expiresAt || null,
    status: data.status || 'approved',
    createdBy: data.createdBy || 1,
    approvedBy: data.approvedBy || null,
  };

  const { data: result, error } = await supabase
    .from('gigs')
    .insert(cleanData)
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(`Failed to create gig: ${error.message}`);
  }

  return result;
}

export async function createJobSupabase(data: any) {
  console.log('Creating job with Supabase client:', data);
  
  const cleanData = {
    title: data.title,
    slug: data.slug,
    company: data.company,
    description: data.description || null,
    requirements: data.requirements || null,
    responsibilities: data.responsibilities || null,
    type: data.type,
    location: data.location || null,
    remote: data.remote ?? false,
    skills: data.skills || null,
    experienceLevel: data.experienceLevel || null,
    salaryMin: data.salaryMin || null,
    salaryMax: data.salaryMax || null,
    currency: data.currency || 'UGX',
    applicationUrl: data.applicationUrl || null,
    applicationEmail: data.applicationEmail || null,
    featured: data.featured ?? false,
    expiresAt: data.expiresAt || null,
    status: data.status || 'approved',
    createdBy: data.createdBy || 1,
    approvedBy: data.approvedBy || null,
  };

  const { data: result, error } = await supabase
    .from('jobs')
    .insert(cleanData)
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(`Failed to create job: ${error.message}`);
  }

  return result;
}

export async function getJobsSupabase(filters?: { status?: string; type?: string; remote?: boolean }) {
  console.log('Fetching jobs from Supabase with filters:', filters);
  
  let query = supabase.from('jobs').select('*');
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  
  if (filters?.remote !== undefined) {
    query = query.eq('remote', filters.remote);
  }
  
  const { data, error } = await query.order('createdAt', { ascending: false });
  
  if (error) {
    console.error('Error fetching jobs from Supabase:', error);
    throw new Error(`Failed to fetch jobs: ${error.message}`);
  }
  
  console.log('✅ Successfully fetched', data?.length || 0, 'jobs from Supabase');
  return data || [];
}

export async function getGigsSupabase(filters?: { status?: string; category?: string }) {
  console.log('Fetching gigs from Supabase with filters:', filters);
  
  let query = supabase.from('gigs').select('*');
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  
  const { data, error } = await query.order('createdAt', { ascending: false });
  
  if (error) {
    console.error('Error fetching gigs from Supabase:', error);
    throw new Error(`Failed to fetch gigs: ${error.message}`);
  }
  
  console.log('✅ Successfully fetched', data?.length || 0, 'gigs from Supabase');
  return data || [];
}

export async function createLearningResourceSupabase(data: any) {
  console.log('Creating learning resource with Supabase client:', data);
  
  const cleanData = {
    title: data.title,
    slug: data.slug,
    description: data.description || null,
    type: data.type || null,
    category: data.category || null,
    level: data.level || null,
    url: data.url || null,
    provider: data.provider || null,
    cost: data.cost || null,
    duration: data.duration || null,
    tags: data.tags || null,
    featured: data.featured ?? false,
    status: data.status || 'approved',
    createdBy: data.createdBy || 1,
    approvedBy: data.approvedBy || null,
  };

  const { data: result, error } = await supabase
    .from('learning_resources')
    .insert(cleanData)
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(`Failed to create learning resource: ${error.message}`);
  }

  return result;
}

export async function getLearningResourcesSupabase(filters?: { status?: string; category?: string; level?: string }) {
  console.log('Fetching learning resources from Supabase with filters:', filters);
  
  let query = supabase.from('learning_resources').select('*');
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters?.level) {
    query = query.eq('level', filters.level);
  }
  
  const { data, error } = await query.order('createdAt', { ascending: false });
  
  if (error) {
    console.error('Error fetching learning resources from Supabase:', error);
    throw new Error(`Failed to fetch learning resources: ${error.message}`);
  }
  
  console.log('✅ Successfully fetched', data?.length || 0, 'learning resources from Supabase');
  return data || [];
}

export async function createEventSupabase(data: any) {
  console.log('Creating event with Supabase client:', data);
  
  const cleanData = {
    title: data.title,
    slug: data.slug,
    description: data.description || null,
    type: data.type || null,
    category: data.category || null,
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    location: data.location || null,
    address: data.address || null,
    virtual: data.virtual ?? false,
    meetingUrl: data.meetingUrl || null,
    registrationUrl: data.registrationUrl || null,
    organizer: data.organizer || null,
    organizerEmail: data.organizerEmail || null,
    capacity: data.capacity || null,
    tags: data.tags || null,
    imageUrl: data.imageUrl || null,
    featured: data.featured ?? false,
    status: data.status || 'approved',
    createdBy: data.createdBy || 1,
    approvedBy: data.approvedBy || null,
  };

  const { data: result, error } = await supabase
    .from('events')
    .insert(cleanData)
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(`Failed to create event: ${error.message}`);
  }

  return result;
}

export async function getEventsSupabase(filters?: { status?: string; upcoming?: boolean }) {
  console.log('Fetching events from Supabase with filters:', filters);
  
  let query = supabase.from('events').select('*');
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.upcoming) {
    query = query.gte('startDate', new Date().toISOString());
  }
  
  const { data, error } = await query.order('startDate', { ascending: false });
  
  if (error) {
    console.error('Error fetching events from Supabase:', error);
    throw new Error(`Failed to fetch events: ${error.message}`);
  }
  
  console.log('✅ Successfully fetched', data?.length || 0, 'events from Supabase');
  return data || [];
}

export async function createOpportunitySupabase(data: any) {
  console.log('Creating opportunity with Supabase client:', data);
  
  const cleanData = {
    title: data.title,
    slug: data.slug,
    description: data.description || null,
    type: data.type || null,
    category: data.category || null,
    provider: data.provider || null,
    amount: data.amount || null,
    currency: data.currency || 'USD',
    eligibility: data.eligibility || null,
    applicationUrl: data.applicationUrl || null,
    deadline: data.deadline || null,
    tags: data.tags || null,
    imageUrl: data.imageUrl || null,
    featured: data.featured ?? false,
    status: data.status || 'approved',
    createdBy: data.createdBy || 1,
    approvedBy: data.approvedBy || null,
  };

  const { data: result, error } = await supabase
    .from('opportunities')
    .insert(cleanData)
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(`Failed to create opportunity: ${error.message}`);
  }

  return result;
}

export async function getOpportunitiesSupabase(filters?: { status?: string; type?: string }) {
  console.log('Fetching opportunities from Supabase with filters:', filters);
  
  let query = supabase.from('opportunities').select('*');
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  
  const { data, error } = await query.order('createdAt', { ascending: false });
  
  if (error) {
    console.error('Error fetching opportunities from Supabase:', error);
    throw new Error(`Failed to fetch opportunities: ${error.message}`);
  }
  
  console.log('✅ Successfully fetched', data?.length || 0, 'opportunities from Supabase');
  return data || [];
}