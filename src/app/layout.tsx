import type { Metadata } from "next";
import localFont from "next/font/local";
import { getNavItems, getSocialMedia } from "@/lib/api";
import "./globals.css";
import DebugProtection from "@/components/DebugProtection";
import ConditionalLayout from "@/components/ConditionalLayout";

const droidKufi = localFont({
  src: "../../public/fonts/DroidKufi-Regular.ttf",
  variable: "--font-droid-kufi",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "TUNREPLAY - أفلام ومسلسلات عربية",
  description: "منصة تونريبلاي لمشاهدة الأفلام والمسلسلات العربية",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const menuItems = await getNavItems();
  const socialMedia = await getSocialMedia();

  return (
    <html lang="ar" dir="rtl" className={droidKufi.className} suppressHydrationWarning>
      <head>
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
        {/* Google Tag Manager */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZKC57MBPEZ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZKC57MBPEZ');
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-droid-kufi" suppressHydrationWarning>
        <DebugProtection />
        <div className="bg-pattern" />
        <ConditionalLayout menuItems={menuItems} socialMedia={socialMedia}>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
