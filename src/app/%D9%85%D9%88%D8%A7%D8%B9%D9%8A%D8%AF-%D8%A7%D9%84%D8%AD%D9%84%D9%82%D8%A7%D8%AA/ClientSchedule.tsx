'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAssetUrl } from '@/lib/api';

interface ScheduleItem {
  id: number;
  time: string;
  day: string;
  seies: {
    series_id: {
      id: string;
      title: string;
      poster: string;
      story: string;
      slug: string;
      imdb: string | null;
      duration: string | null;
      category: { name: string; slug: string; } | null;
      nation: { name: string; slug: string; } | null;
      quality: { name: string; slug: string; } | null;
      year: { name: string; slug: string; } | null;
    };
  }[];
}

interface Props {
  initialSchedule: ScheduleItem[];
  daysAr: Record<string, string>;
}

function CompactSeriesCard({ series }: { series: ScheduleItem['seies'][0]['series_id'] }) {
  return (
    <Link 
      href={`/series/${series.slug}`}
      className="flex gap-3 sm:gap-4 bg-black/20 rounded-lg p-2 sm:p-3 hover:bg-black/30 transition-colors"
    >
      <div className="relative w-12 sm:w-16 h-20 sm:h-24 flex-shrink-0">
        <Image
          src={getAssetUrl(series.poster)}
          alt={series.title}
          fill
          sizes="(max-width: 640px) 48px, 64px"
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="text-white font-semibold text-xs sm:text-sm mb-1 line-clamp-2">{series.title}</h3>
        <div className="flex flex-wrap gap-1 sm:gap-2 text-[10px] sm:text-xs">
          {series.quality && (
            <span className="text-primary">{series.quality.name}</span>
          )}
          {series.category && (
            <span className="text-white/60">{series.category.name}</span>
          )}
          {series.year && (
            <span className="text-white/60">{series.year.name}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ClientSchedule({ 
  initialSchedule,
  daysAr
}: Props) {
  const router = useRouter();
  const [time, setTime] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get next 7 days starting from today
  const getWeekDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      days.push({
        date,
        dayName: i === 0 ? 'اليوم' : daysAr[dayName as keyof typeof daysAr],
        englishName: dayName
      });
    }
    
    return days;
  };

  // Update URL when day changes
  const handleDayChange = (index: number, dayName: string) => {
    setSelectedDay(index);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
    router.push(`/مواعيد-الحلقات?day=${dayName}`);
  };

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const formattedTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(new Date());
      setTime(formattedTime);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const weekDays = getWeekDays();

  return (
    <main className="container mx-auto px-3 sm:px-4 py-16 sm:py-20">
      {/* Clock Display */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-block bg-white/10 rounded-lg px-4 sm:px-6 py-2 sm:py-3">
          <div className="text-white/60 mb-1 text-xs sm:text-sm">توقيت غرينتش +1</div>
          <div className="text-xl sm:text-2xl font-mono text-primary">{time}</div>
        </div>
      </div>

      {/* Mobile Days Dropdown */}
      <div className="block sm:hidden mb-6 relative z-30">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between bg-white/10 text-white px-4 py-3 rounded-lg"
        >
          <span className="text-sm">{weekDays[selectedDay].dayName}</span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Items */}
            <div className="absolute top-full left-0 right-0 mt-1 bg-black/95 rounded-lg overflow-hidden shadow-lg z-50 border border-white/10">
              {weekDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDayChange(index, day.englishName)}
                  className={`w-full text-right px-4 py-3 transition-colors ${
                    selectedDay === index
                      ? 'bg-primary text-white'
                      : 'text-white/60 hover:bg-white/10'
                  }`}
                >
                  {day.dayName}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Desktop Days Selection */}
      <div className="hidden sm:flex justify-center gap-2 mb-8">
        {weekDays.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDayChange(index, day.englishName)}
            className={`px-6 py-2 rounded-lg transition-colors whitespace-nowrap ${
              selectedDay === index
                ? 'bg-primary text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {day.dayName}
          </button>
        ))}
      </div>

      {/* Schedule Content */}
      <div className="space-y-4 sm:space-y-6">
        {initialSchedule.length > 0 ? (
          initialSchedule.map((item) => (
            <div key={item.id} className="bg-white/5 rounded-lg p-3 sm:p-4">
              <div className="mb-2 sm:mb-3">
                <span className="text-base sm:text-lg text-primary font-semibold">
                  {new Date(`2024-01-01T${item.time}`).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>
              <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
                {item.seies.map(({ series_id }) => (
                  <CompactSeriesCard key={series_id.id} series={series_id} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 sm:py-12">
            <p className="text-white/60 text-sm sm:text-base">لا توجد مواعيد لهذا اليوم</p>
          </div>
        )}
      </div>
    </main>
  );
} 