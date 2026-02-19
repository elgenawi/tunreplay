'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Mode = 'login' | 'register';

interface LoginFormProps {
  allowSignup?: boolean;
}

export default function LoginForm({ allowSignup = true }: LoginFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'فشل تسجيل الدخول');
          return;
        }
        router.push('/');
        router.refresh();
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name: name || undefined }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'فشل إنشاء الحساب');
          return;
        }
        setSuccess(data.message || 'تم إنشاء الحساب. يمكنك تسجيل الدخول الآن.');
        setMode('login');
        setPassword('');
        setName('');
      }
    } catch {
      setError('حدث خطأ. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {allowSignup && mode === 'register' && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
            الاسم (اختياري)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-right"
            placeholder="الاسم"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-right"
          placeholder="أدخل بريدك الإلكتروني"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
          كلمة المرور
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={allowSignup && mode === 'register' ? 6 : 1}
          className="w-full bg-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-right"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 text-red-500 rounded-lg text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 text-green-500 rounded-lg text-center">
          {success}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading
            ? 'جاري...'
            : mode === 'login'
              ? 'تسجيل الدخول'
              : 'إنشاء الحساب'}
        </button>
      </div>

      {allowSignup && (
        <p className="text-center text-white/80 text-sm">
          {mode === 'login' ? (
            <>
              ليس لديك حساب؟{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-primary hover:underline font-medium"
              >
                إنشاء حساب
              </button>
            </>
          ) : (
            <>
              لديك حساب؟{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-primary hover:underline font-medium"
              >
                تسجيل الدخول
              </button>
            </>
          )}
        </p>
      )}

      <p className="text-center">
        <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">
          ← العودة للرئيسية
        </Link>
      </p>
    </form>
  );
}
