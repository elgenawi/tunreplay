import { getScheduleByDay } from "@/lib/queries";
import { Metadata } from "next";
import ClientSchedule from "@/components/ClientSchedule";

export const metadata: Metadata = {
  title: 'مواعيد الحلقات - TUNREPLAY',
  description: 'مواعيد عرض الحلقات الجديدة من المسلسلات والانمي على موقع TUNREPLAY',
  keywords: [
    'مواعيد الحلقات',
    'مواعيد العرض',
    'مسلسلات',
    'انمي',
    'حلقات جديدة',
    'TUNREPLAY'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'مواعيد الحلقات - TUNREPLAY',
    description: 'مواعيد عرض الحلقات الجديدة من المسلسلات والانمي على موقع TUNREPLAY',
    type: 'website',
    siteName: 'TUNREPLAY',
    locale: 'ar_AR',
  },
  alternates: {
    canonical: '/مواعيد-الحلقات',
  },
};

type PageProps = {
  params: Record<string, never>;
  searchParams: Promise<{ day?: string }> | { day?: string };
}

export default async function EpisodeSchedulesPage({
  searchParams,
}: PageProps) {
  const today = new Date();
  const currentDayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const { day } = await Promise.resolve(searchParams);
  const dayToFetch = day || currentDayName;
  
  // Fetch schedule data server-side
  const scheduleData = await getScheduleByDay(dayToFetch);

  const DAYS_AR = {
    'Sunday': 'الأحد',
    'Monday': 'الإثنين',
    'Tuesday': 'الثلاثاء',
    'Wednesday': 'الأربعاء',
    'Thursday': 'الخميس',
    'Friday': 'الجمعة',
    'Saturday': 'السبت',
  };

  return (
    <ClientSchedule
      initialSchedule={scheduleData}
      daysAr={DAYS_AR}
    />
  );
} 