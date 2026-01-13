import type { NextApiRequest, NextApiResponse } from 'next';

interface CalendarEvent {
  time: string;
  currency: string;
  impact: string;
  event: string;
  previous: string;
  forecast: string;
  actual: string;
  details?: {
    sources?: string;
    measures?: string;
    usualEffect?: string;
    frequency?: string;
    nextReleased?: string;
    notes?: string;
    whyTraderCare?: string;
    history?: Array<{
      date: string;
      previous: string;
      forecast: string;
      actual: string;
    }>;
  };
}

interface ApiResponse {
  status: string;
  updatedAt: string;
  total: number;
  data: CalendarEvent[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filter = 'today' } = req.query;
  
  // Validate filter value
  const validFilters = ['today', 'this-week', 'previous-week', 'next-week'];
  if (!validFilters.includes(filter as string)) {
    return res.status(400).json({ 
      status: 'error',
      message: 'Invalid filter parameter. Must be one of: today, this-week, previous-week, next-week'
    });
  }

  const endpoints = {
    'today': 'https://endpoapi-production-3202.up.railway.app/api/calendar/today',
    'this-week': 'https://endpoapi-production-3202.up.railway.app/api/calendar/this-week',
    'previous-week': 'https://endpoapi-production-3202.up.railway.app/api/calendar/previous-week',
    'next-week': 'https://endpoapi-production-3202.up.railway.app/api/calendar/next-week'
  };

  try {
    const endpoint = endpoints[filter as keyof typeof endpoints];
    console.log('Fetching data from:', endpoint);

    const response = await fetch(endpoint, {
      headers: {
        'accept': 'application/json',
      },
      cache: 'no-store' as RequestCache
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result: ApiResponse = await response.json();

    // Ensure the response has the expected format
    if (result.status !== 'success' || !Array.isArray(result.data)) {
      throw new Error('Invalid API response format');
    }

    // Format data for the frontend
    const formattedData = result.data.map(event => ({
      time: event.time || '',
      country: event.currency || '',
      impact: event.impact || '★',
      figures: event.event || '',
      previous: event.previous || '',
      forecast: event.forecast || '',
      actual: event.actual || '',
      details: event.details || {}
    }));

    return res.status(200).json(formattedData);

  } catch (error) {
    console.error('Error in API route:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Failed to fetch economic calendar data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
