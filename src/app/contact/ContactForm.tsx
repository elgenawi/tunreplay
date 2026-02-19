'use client';

import { useState, useRef, useEffect } from 'react';
import { submitReport } from './actions';

const REPORT_TYPES = [
  {
    id: 'general',
    label: 'مشكلة عامة ⚠️',
    description: 'للإبلاغ عن أي مشكلة عامة في الموقع',
    type: 'General Problem ⚠️'
  },
  {
    id: 'servers',
    label: 'مشكلة في السيرفرات 🔗',
    description: 'للإبلاغ عن مشاكل في مشغلات الفيديو أو السيرفرات',
    type: 'Problem with servers 🔗'
  },
  {
    id: 'inquiry',
    label: 'استفسار أو اقتراح 📝',
    description: 'لتقديم استفسار أو اقتراح لتحسين الموقع',
    type: 'Inquiry or suggestion 📝'
  },
  {
    id: 'request',
    label: 'طلب مسلسل 📺',
    description: 'لطلب إضافة مسلسل أو فيلم غير موجود',
    type: 'Series request 📺'
  }
];

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const widgetId = useRef<number | null>(null);

  useEffect(() => {
    // @ts-expect-error Turnstile is loaded via external script
    if (window.turnstile) {
      // @ts-expect-error Turnstile types not available
      widgetId.current = window.turnstile.render('#turnstile-container', {
        sitekey: TURNSTILE_SITE_KEY,
        callback: function(token: string) {
          setToken(token);
        },
        'expired-callback': () => {
          setToken(null);
        },
        'error-callback': () => {
          setToken(null);
        },
      });
    }

    return () => {
      // @ts-expect-error Turnstile is loaded via external script
      if (window.turnstile && widgetId.current) {
        // @ts-expect-error Turnstile types not available
        window.turnstile.remove(widgetId.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      alert('يرجى إكمال التحقق');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const selectedReportType = REPORT_TYPES.find(type => type.id === selectedType);
      if (!selectedReportType) throw new Error('نوع التقرير غير صالح');

      const result = await submitReport({
        email,
        type: selectedReportType.type,
        msg: message,
        token
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setSubmitSuccess(true);
      setEmail('');
      setSelectedType('');
      setMessage('');
      setToken(null);
      // Reset turnstile
      // @ts-expect-error Turnstile is loaded via external script
      if (window.turnstile && widgetId.current) {
        // @ts-expect-error Turnstile types not available
        window.turnstile.reset(widgetId.current);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError(error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال التقرير');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
          البريد الإلكتروني
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-right"
          placeholder="أدخل بريدك الإلكتروني"
          required
        />
      </div>

      {/* Report Type Selection */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">
          نوع التقرير
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          {REPORT_TYPES.map((type) => (
            <label
              key={type.id}
              className={`relative flex flex-col p-4 rounded-lg cursor-pointer transition-colors ${
                selectedType === type.id
                  ? 'bg-primary/20 ring-2 ring-primary'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <input
                type="radio"
                name="report_type"
                value={type.id}
                checked={selectedType === type.id}
                onChange={(e) => setSelectedType(e.target.value)}
                className="sr-only"
                required
              />
              <span className="text-white font-medium mb-1">{type.label}</span>
              <span className="text-white/60 text-sm">{type.description}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
          الرسالة
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full bg-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-right"
          placeholder="اكتب رسالتك هنا..."
          required
        />
      </div>

      {/* Turnstile Container */}
      <div className="flex justify-center">
        <div id="turnstile-container" className="mx-auto"></div>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="p-4 bg-green-500/10 text-green-500 rounded-lg text-center">
          تم إرسال التقرير بنجاح
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="p-4 bg-red-500/10 text-red-500 rounded-lg text-center">
          {submitError}
        </div>
      )}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          disabled={!token || isSubmitting}
        >
          {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
        </button>
      </div>
    </form>
  );
} 