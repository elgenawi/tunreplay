"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/index";
import Footer from "@/components/Footer";
import type { NavMenuItem, SocialMediaItem } from "@/lib/queries";

interface ConditionalLayoutProps {
  menuItems: NavMenuItem[];
  socialMedia: SocialMediaItem[];
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
