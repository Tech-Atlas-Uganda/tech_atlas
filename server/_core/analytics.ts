import { ENV } from './env';

export interface AnalyticsData {
  pageviews?: number;
  visitors?: number;
  bounceRate?: number;
  avgSessionDuration?: number;
  topPages?: Array<{ page: string; views: number }>;
  topCountries?: Array<{ country: string; visitors: number }>;
  topDevices?: Array<{ device: string; visitors: number }>;
  topBrowsers?: Array<{ browser: string; visitors: number }>;
}

export interface AnalyticsQuery {
  startAt?: number;
  endAt?: number;
  unit?: 'year' | 'month' | 'hour' | 'day';
  timezone?: string;
}

export const analyticsService = {
  // Get website statistics
  getStats: async (query: AnalyticsQuery = {}): Promise<AnalyticsData> => {
    if (!ENV.umamiApiKey || !ENV.umamiWebsiteId) {
      console.warn('Umami analytics not configured');
      return {};
    }

    try {
      const params = new URLSearchParams({
        ...(query.startAt && { startAt: query.startAt.toString() }),
        ...(query.endAt && { endAt: query.endAt.toString() }),
        ...(query.unit && { unit: query.unit }),
        ...(query.timezone && { timezone: query.timezone }),
      });

      const response = await fetch(
        `${ENV.umamiApiUrl}/api/websites/${ENV.umamiWebsiteId}/stats?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${ENV.umamiApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return {};
    }
  },

  // Get page views over time
  getPageviews: async (query: AnalyticsQuery = {}) => {
    if (!ENV.umamiApiKey || !ENV.umamiWebsiteId) {
      return [];
    }

    try {
      const params = new URLSearchParams({
        ...(query.startAt && { startAt: query.startAt.toString() }),
        ...(query.endAt && { endAt: query.endAt.toString() }),
        ...(query.unit && { unit: query.unit }),
        ...(query.timezone && { timezone: query.timezone }),
      });

      const response = await fetch(
        `${ENV.umamiApiUrl}/api/websites/${ENV.umamiWebsiteId}/pageviews?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${ENV.umamiApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch pageviews:', error);
      return [];
    }
  },

  // Get top pages
  getTopPages: async (query: AnalyticsQuery = {}) => {
    if (!ENV.umamiApiKey || !ENV.umamiWebsiteId) {
      return [];
    }

    try {
      const params = new URLSearchParams({
        ...(query.startAt && { startAt: query.startAt.toString() }),
        ...(query.endAt && { endAt: query.endAt.toString() }),
      });

      const response = await fetch(
        `${ENV.umamiApiUrl}/api/websites/${ENV.umamiWebsiteId}/metrics?${params}&type=url`,
        {
          headers: {
            'Authorization': `Bearer ${ENV.umamiApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch top pages:', error);
      return [];
    }
  },

  // Get visitor countries
  getCountries: async (query: AnalyticsQuery = {}) => {
    if (!ENV.umamiApiKey || !ENV.umamiWebsiteId) {
      return [];
    }

    try {
      const params = new URLSearchParams({
        ...(query.startAt && { startAt: query.startAt.toString() }),
        ...(query.endAt && { endAt: query.endAt.toString() }),
      });

      const response = await fetch(
        `${ENV.umamiApiUrl}/api/websites/${ENV.umamiWebsiteId}/metrics?${params}&type=country`,
        {
          headers: {
            'Authorization': `Bearer ${ENV.umamiApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch countries:', error);
      return [];
    }
  },

  // Generate dashboard summary
  getDashboardSummary: async (): Promise<AnalyticsData> => {
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

    const [stats, topPages, countries] = await Promise.all([
      analyticsService.getStats({ 
        startAt: thirtyDaysAgo, 
        endAt: now 
      }),
      analyticsService.getTopPages({ 
        startAt: thirtyDaysAgo, 
        endAt: now 
      }),
      analyticsService.getCountries({ 
        startAt: thirtyDaysAgo, 
        endAt: now 
      }),
    ]);

    return {
      ...stats,
      topPages: topPages.slice(0, 10),
      topCountries: countries.slice(0, 10),
    };
  }
};