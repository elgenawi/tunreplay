'use client';

import { useState, useEffect, TouchEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PinnedSeries {
  title: string;
  image: string | null;
  slug: string;
}

interface SlideshowProps {
  series: PinnedSeries[];
}

export default function Slideshow({ series }: SlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (series.length <= 1) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide((current) => (current + 1) % series.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [series.length]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const handleTouchStart = (e: TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchMove = (e: TouchEvent) => setTouchEnd(e.touches[0].clientX);

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextSlide();
    if (distance < -50) previousSlide();
    setTouchStart(0);
    setTouchEnd(0);
  };

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((current) => (current + 1) % series.length);
  };

  const previousSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((current) => (current - 1 + series.length) % series.length);
  };

  if (!series.length) return null;

  const currentSeries = series[currentSlide];

  return (
    <div className="container mx-auto px-2 py-20">
      <div
        className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-xl overflow-hidden shadow-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0">
          {currentSeries.image ? (
            <Image
              src={currentSeries.image}
              alt={currentSeries.title}
              fill
              className="object-cover rounded-xl"
              priority
              quality={90}
            />
          ) : (
            <div className="w-full h-full bg-white/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent rounded-xl" />
        </div>

        <div className="relative h-full flex items-end">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4 line-clamp-2">
              {currentSeries.title}
            </h2>
            <Link
              href={`/series/${currentSeries.slug}`}
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 transition text-sm"
            >
              شاهد الآن
            </Link>
          </div>
        </div>

        {series.length > 1 && (
          <>
            <button
              onClick={previousSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 transition-colors bg-black/20 rounded-full hover:bg-black/40"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 transition-colors bg-black/20 rounded-full hover:bg-black/40"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
              </svg>
            </button>
          </>
        )}

        {series.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {series.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-primary scale-110'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
