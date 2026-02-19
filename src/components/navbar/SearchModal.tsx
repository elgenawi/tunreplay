'use client';

import { useState, useEffect, useRef } from 'react';
import { getAssetUrl } from '@/lib/api';
import { searchSeries, type SearchResult } from '@/lib/actions';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ITEMS_PER_PAGE = 3;
const MAX_REQUESTS_PER_MINUTE = 10;
const WINDOW_MS = 60 * 1000; // 1 minute

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function SearchModal({ isOpen, onClose, searchQuery, onSearchChange }: SearchModalProps) {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Rate limiting state
  const requestTimestamps = useRef<number[]>([]);

  const checkRateLimit = () => {
    const now = Date.now();
    const validTimestamps = requestTimestamps.current.filter(
      timestamp => now - timestamp < WINDOW_MS
    );

    if (validTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
      const oldestTimestamp = validTimestamps[0];
      const remainingTime = Math.ceil((WINDOW_MS - (now - oldestTimestamp)) / 1000);
      throw new Error(`Too many requests. Please try again in ${remainingTime} seconds.`);
    }

    requestTimestamps.current = [...validTimestamps, now];
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
      setError(null); // Clear any previous errors
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results using server action
  useEffect(() => {
    if (!debouncedQuery.trim() || !isOpen) {
      setSearchResults([]);
      setTotalResults(0);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        checkRateLimit();
        const { data, meta } = await searchSeries(debouncedQuery, currentPage, ITEMS_PER_PAGE);
        setSearchResults(data);
        setTotalResults(meta.total_count);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        setTotalResults(0);
        setError(error instanceof Error ? error.message : 'An error occurred while searching');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, currentPage, isOpen]);

  // Update the scroll lock effect
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        checkRateLimit();
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        onClose();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Too many requests');
      }
    }
  };

  if (!isOpen) return null;

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Main container with background */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Content container */}
      <div className="relative h-full overflow-y-auto">
        {/* Header with search - Now with proper z-index and backdrop */}
        <div className="sticky top-0 z-[999] bg-black/95 pt-4 sm:pt-6 pb-4 px-4 shadow-lg">
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">البحث</h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="text-white/80 hover:text-white transition p-2 rounded-full hover:bg-white/10"
                aria-label="Close search"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن فيلم أو مسلسل..."
                className="w-full bg-white/10 text-white placeholder-white/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-right"
                autoFocus
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition p-2"
                aria-label="Search"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 text-red-500 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Search Results - Now with lower z-index */}
        <div className="relative z-[99] max-w-2xl mx-auto px-4 py-4 sm:py-6">
          {/* Search Results */}
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((series) => (
                <div key={series.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-28 flex-shrink-0 bg-white/5 rounded-md overflow-hidden">
                      <Image
                        src={getAssetUrl(series.poster)}
                        alt={series.title}
                        fill
                        sizes="80px"
                        className="object-cover rounded-md hover:scale-105 transition duration-300"
                        priority={true}
                        loading="eager"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <Link
                        href={`/series/${series.slug}`}
                        onClick={onClose}
                        className="block hover:text-primary transition"
                      >
                        <h3 className="text-white font-semibold mb-2 text-base">{series.title}</h3>
                      </Link>
                      <p className="text-white/60 text-sm line-clamp-2 mb-2">{series.story}</p>
                      <div className="flex flex-wrap gap-2">
                        {series.year && (
                          <span className="text-xs text-white/60">{series.year.name}</span>
                        )}
                        {series.category && (
                          <span className="text-xs text-white/60">• {series.category.name}</span>
                        )}
                        {series.quality && (
                          <span className="text-xs text-primary">{series.quality.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  {currentPage > 1 && (
                    <button
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition text-sm"
                    >
                      السابق
                    </button>
                  )}
                  
                  <span className="text-white/60 text-sm">
                    صفحة {currentPage} من {totalPages}
                  </span>

                  {currentPage < totalPages && (
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition text-sm"
                    >
                      التالي
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : debouncedQuery && !isLoading ? (
            <p className="text-center text-white/60 py-8">
              لا توجد نتائج للبحث
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
} 