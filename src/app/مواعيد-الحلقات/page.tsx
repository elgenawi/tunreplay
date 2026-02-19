// @ts-nocheck
import { getScheduleByDay } from '@/lib/actions';
import { Metadata } from 'next';
import ClientSchedule from './ClientSchedule';

export const metadata: Metadata = {
  // ... metadata config
};

export default async function EpisodeSchedulesPage({
  searchParams,
}: {
  searchParams: { day?: string };
}) {
  const today = new Date();
  const currentDayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const { day } = await Promise.resolve(searchParams);
  const dayToFetch = day || currentDayName;
  
  // ... rest of the code
} 