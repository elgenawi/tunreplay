'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface BannerProps {
  code: string;
}

// Add type declaration for global adsbygoogle
declare global {
  interface Window {
    adsbygoogle: Array<{ push: (obj: Record<string, unknown>) => void }>;
  }
}

export default function Banner({ code }: BannerProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!code || !containerRef.current) return;

    const loadAd = () => {
      if (containerRef.current) {
        // Clear previous content
        containerRef.current.innerHTML = '';
        
        // Create a wrapper div
        const wrapper = document.createElement('div');
        wrapper.innerHTML = code;

        // Extract and reinsert scripts
        const scripts = wrapper.getElementsByTagName('script');
        const scriptContents = Array.from(scripts).map(script => ({
          content: script.innerHTML,
          src: script.src,
          async: script.async,
        }));

        // Remove old scripts
        Array.from(scripts).forEach(script => script.remove());

        // Insert the HTML content
        containerRef.current.innerHTML = wrapper.innerHTML;

        // Recreate and insert scripts
        scriptContents.forEach(scriptData => {
          const newScript = document.createElement('script');
          if (scriptData.src) {
            newScript.src = scriptData.src;
            newScript.async = scriptData.async;
          } else {
            newScript.textContent = scriptData.content;
          }
          containerRef.current?.appendChild(newScript);
        });
      }
    };

    // Initial load
    loadAd();

    // Reload on route change
    const handleRouteChange = () => {
      setTimeout(loadAd, 100);
    };

    handleRouteChange();
  }, [code, pathname]);

  if (!code) return null;

  return (
    <div className="flex justify-center w-full px-4 my-4">
      <div 
        ref={containerRef}
        className="w-full max-w-[472px] overflow-hidden"
        suppressHydrationWarning 
      />
    </div>
  );
} 