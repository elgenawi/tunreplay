'use client';

import { useEffect } from 'react';

export default function EpisodesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">عذراً، حدث خطأ في تحميل الحلقات</h2>
            <p className="text-white/60 mb-6">يرجى المحاولة مرة أخرى</p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 