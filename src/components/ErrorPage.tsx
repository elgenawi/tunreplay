import Link from 'next/link';
import Image from 'next/image';

interface ErrorPageProps {
  code?: string | number;
  title: string;
  description: string;
  imageUrl?: string;
}

export default function ErrorPage({
  code = '404',
  title = 'عذراً، الصفحة غير موجودة',
  description = 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
  imageUrl = '/404.svg'
}: ErrorPageProps) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-black/50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">{code}</h1>
        <div className="relative w-64 h-64 mx-auto mb-8">
          <Image
            src={imageUrl}
            alt={`${code} Illustration`}
            fill
            className="object-contain"
            priority
          />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          {description}
        </p>
        <Link 
          href="/"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-red-700 transition"
        >
          العودة للرئيسية
        </Link>
      </div>
    </main>
  );
} 