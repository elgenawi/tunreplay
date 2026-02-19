import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">404 - الصفحة غير موجودة</h2>
        <p className="text-white/60 mb-6">عذراً، الصفحة التي تبحث عنها غير موجودة</p>
        <Link
          href="/"
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition inline-block"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
} 
