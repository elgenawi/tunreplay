'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function EpisodeError({
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
            <h2 className="text-2xl font-bold text-white mb-4">عذراً، حدث خطأ في تحميل الحلقة</h2>
            <p className="text-white/60 mb-6">يرجى المحاولة مرة أخرى</p>
            <div className="space-x-4 rtl:space-x-reverse">
              <button
                onClick={reset}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition"
              >
                إعادة المحاولة
              </button>
              <Link
                href="/episodes"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition inline-block"
              >
                العودة للحلقات
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 