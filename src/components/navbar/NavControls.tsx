import { useState } from "react";

interface NavControlsProps {
  onSearchClick: () => void;
  onMenuClick: () => void;
  isMenuOpen: boolean;
  user: {
    id: number;
    email: string;
    name: string | null;
    role: string;
  } | null;
  onLogout: () => void;
}

export default function NavControls({ onSearchClick, onMenuClick, isMenuOpen, user, onLogout }: NavControlsProps) {
  const displayName = user?.name || user?.email || "";
  const avatarInitial =
    displayName.trim().length > 0 ? displayName.trim().charAt(0).toUpperCase() : "?";
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      {/* Search Button */}
      <button
        onClick={onSearchClick}
        className="text-white/80 hover:text-white transition p-2"
        aria-label="Search"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {/* Avatar / Login */}
      <div className="relative hidden sm:block">
        {user ? (
          <>
            <button
              type="button"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition"
              title={`${displayName} (${user.role === "admin" ? "مشرف" : "مستخدم"})`}
              onClick={() => setIsUserMenuOpen((open) => !open)}
            >
              {avatarInitial}
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-lg bg-black/90 border border-white/10 shadow-lg py-1 text-sm z-50">
                {user.role === "admin" && (
                  <a
                    href="/admin"
                    className="block px-3 py-2 text-white/90 hover:bg-white/10 text-right"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    لوحة الإدارة
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onLogout();
                  }}
                  className="block w-full px-3 py-2 text-right text-red-400 hover:bg-white/10"
                >
                  تسجيل الخروج
                </button>
              </div>
            )}
          </>
        ) : (
          <a
            href="/login"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/40 text-white/80 hover:text-white hover:border-white transition text-xs"
            aria-label="تسجيل الدخول"
          >
            دخول
          </a>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-white p-2"
        aria-label="Toggle Menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isMenuOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
    </div>
  );
}