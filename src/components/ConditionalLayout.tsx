"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/index";
import Footer from "@/components/Footer";
import type { MenuItem, SocialMedia } from "@/lib/api";

interface ConditionalLayoutProps {
  menuItems: MenuItem[];
  socialMedia: SocialMedia[];
  children: React.ReactNode;
}

export default function ConditionalLayout({
  menuItems,
  socialMedia,
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar menuItems={menuItems} />
      <main>{children}</main>
      <Footer socialMedia={socialMedia} />
    </>
  );
}
