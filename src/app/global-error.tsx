'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
    <html dir="rtl" lang="ar">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">عذراً، حدث خطأ ما</h2>
            <p className="text-white/60 mb-6">يرجى المحاولة مرة أخرى</p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </body>
    </html>
  );
} 