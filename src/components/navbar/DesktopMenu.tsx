import Link from "next/link";
import type { NavMenuItem } from "@/lib/queries";

interface DesktopMenuProps {
  menuItems: NavMenuItem[];
}

export default function DesktopMenu({ menuItems }: DesktopMenuProps) {
  return (
    <div className="hidden lg:flex items-center justify-center gap-3 xl:gap-6 mx-auto">
      <Link 
        href="/" 
        className="text-white/80 hover:text-white transition text-sm xl:text-base whitespace-nowrap px-2"
      >
        الرئيسية
      </Link>
      {Array.isArray(menuItems) && menuItems.map((item) => (
        <div key={item.id} className="relative group">
          <Link 
            href={`/type/${item.slug}`} 
            className="text-white/80 hover:text-white transition text-sm xl:text-base whitespace-nowrap px-2"
          >
            {item.menu_name}
          </Link>
          {item.category && item.category.length > 0 && (
            <div className="absolute top-full right-0 mt-2 py-2 w-48 bg-black/95 backdrop-blur-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-white/10">
              {item.category.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition text-right text-sm"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
      
      <Link 
        href="/مواعيد-الحلقات" 
        className="text-white/80 hover:text-white transition text-sm xl:text-base whitespace-nowrap px-2"
      >
        مواعيد الحلقات
      </Link>
      
      <Link 
        href="/contact" 
        className="text-white/80 hover:text-white transition text-sm xl:text-base whitespace-nowrap px-2"
      >
        إتصل بنا
      </Link>
    </div>
  );
} 