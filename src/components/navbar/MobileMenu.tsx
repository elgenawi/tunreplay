import type { NavMenuItem } from "@/lib/queries";

interface MobileMenuProps {
  isOpen: boolean;
  menuItems: NavMenuItem[];
  user: {
    id: number;
    email: string;
    name: string | null;
    role: string;
  } | null;
  onLogout: () => void;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, menuItems, user, onLogout, onClose }: MobileMenuProps) {
  return (
    <div
      className={`lg:hidden fixed inset-x-0 top-[60px] md:top-[72px] ${
        isOpen ? 'max-h-[calc(100vh-60px)] md:max-h-[calc(100vh-72px)] opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden transition-all duration-300 ease-in-out bg-black/95 backdrop-blur-sm border-t border-white/10`}
    >
      <div className={`container mx-auto px-4 py-4 transition-all duration-300 ${
        isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}>
        <div className="space-y-2">
          <a 
            href="/"
            className="block px-4 py-2.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition text-base text-right"
            onClick={onClose}
          >
            الرئيسية
          </a>
          {Array.isArray(menuItems) && menuItems.map((item) => (
            <div key={item.id} className="space-y-1">
              <a 
                href={`/type/${item.slug}`}
                className="block px-4 py-2.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition text-base text-right"
                onClick={onClose}
              >
                {item.menu_name}
              </a>
              {item.category && item.category.length > 0 && (
                <div className="pr-6 mr-2 space-y-1 border-r border-white/20">
                  {item.category.map((cat) => (
                    <a
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="block px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition text-sm text-right"
                      onClick={onClose}
                    >
                      {cat.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <a 
            href="/مواعيد-الحلقات"
            className="block px-4 py-2.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition text-base text-right"
            onClick={onClose}
          >
            مواعيد الحلقات
          </a>

          {user && user.role === "admin" && (
            <a 
              href="/admin"
              className="block px-4 py-2.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition text-base text-right"
              onClick={onClose}
            >
              لوحة الإدارة
            </a>
          )}

          {user ? (
            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full text-right px-4 py-2.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition text-base"
            >
              تسجيل الخروج ({user.name || user.email})
            </button>
          ) : (
            <a 
              href="/login"
              className="block px-4 py-2.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition text-base text-right"
              onClick={onClose}
            >
              تسجيل الدخول
            </a>
          )}

          <a 
            href="/contact"
            className="block px-4 py-2.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition text-base text-right"
            onClick={onClose}
          >
            إتصل بنا
          </a>
        </div>
      </div>
    </div>
  );
} 