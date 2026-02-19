'use client';

import { useState, useEffect } from 'react';

export default function GmtClock() {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time to GMT+1
  const formatTimeGMT1 = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Paris', // GMT+1
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="text-center mb-8">
      <div className="inline-block bg-white/10 rounded-lg px-6 py-3">
        <div className="text-white/60 mb-1 text-sm">توقيت غرينتش +1</div>
        <div className="text-2xl font-mono text-primary">{formatTimeGMT1(time)}</div>
      </div>
    </div>
  );
} 