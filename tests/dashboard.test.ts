import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '@/app/dashboard/page';
import { createClient } from '@/lib/supabase/client';

// Mock Supabase
jest.mock('@/lib/supabase/client');

test('Dashboard loads with Strava data', async () => {
  const mockActivities = [{ id: '1', name: 'Test Run', start_date: '2025-12-01', distance: 10000 }];
  (createClient as jest.Mock).mockReturnValue({
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test' } } }) },
    from: jest.fn(() => ({ select: jest.fn().mockResolvedValue({ data: mockActivities }) }))
  });

  render(<Dashboard />);
  await waitFor(() => expect(screen.getByText('Test Run')).toBeInTheDocument());
});
