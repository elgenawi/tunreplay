'use client';

import { useState, useEffect } from "react";
import type { NavMenuItem } from "@/lib/queries";
import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import SearchModal from "./SearchModal";
import NavControls from "./NavControls";

interface NavbarProps {
  menuItems: NavMenuItem[];
}

interface AuthUser {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

export default function Navbar({ menuItems = [] }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Handle navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load current session user
  useEffect(() => {
    let cancelled = false;
    const loadSession = async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setUser(data.user ?? null);
        }
      } catch {
        if (!cancelled) setUser(null);
      }
    };
    loadSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  };

  return (
    <header 
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-sm shadow-lg' : 'bg-gradient-to-b from-black/90 to-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <Logo />
          </div>
          
          <div className="flex-grow">
            <DesktopMenu menuItems={menuItems} />
          </div>
          
          <div className="flex-shrink-0">
            <NavControls 
              onSearchClick={() => setIsSearchOpen(true)}
              onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
              isMenuOpen={isMenuOpen}
              user={user}
              onLogout={handleLogout}
            />
          </div>
        </div>

        <MobileMenu 
          isOpen={isMenuOpen}
          menuItems={menuItems}
          user={user}
          onLogout={handleLogout}
          onClose={() => setIsMenuOpen(false)}
        />
      </nav>

      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </header>
  );
}