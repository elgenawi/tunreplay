import { Metadata } from 'next';
import ContactForm from './ContactForm';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'اتصل بنا - TUNREPLAY',
  description: 'تواصل مع فريق TUNREPLAY للاستفسارات والدعم الفني',
  keywords: [
    'اتصل بنا',
    'تواصل معنا',
    'دعم فني',
    'مساعدة',
    'TUNREPLAY'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'اتصل بنا - TUNREPLAY',
    description: 'تواصل مع فريق TUNREPLAY للاستفسارات والدعم الفني',
    type: 'website',
    siteName: 'TUNREPLAY',
    locale: 'ar_AR',
  },
  alternates: {
    canonical: '/contact',
  },
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'اتصل بنا - TUNREPLAY',
  description: 'تواصل مع فريق TUNREPLAY للاستفسارات والدعم الفني',
  publisher: {
    '@type': 'Organization',
    name: 'TUNREPLAY',
    logo: {
      '@type': 'ImageObject',
      url: 'https://tunreplay.com/logo.png'
    }
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: 'https://tunreplay.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'اتصل بنا',
        item: 'https://tunreplay.com/contact'
      }
    ]
  }
};

export default function ContactPage() {
  return (
    <>
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema)
        }}
      />
      <main className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8">اتصل بنا</h1>
          <div className="prose prose-invert max-w-none">
            {/* Add your contact form or content here */}
            <p>
              يمكنك التواصل معنا عبر وسائل الاتصال التالية
            </p>
            {/* Add contact information or form as needed */}
          </div>
          <ContactForm />
        </div>
      </main>
    </>
  );
} 