export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="relative">
        {/* Slideshow skeleton */}
        <div className="aspect-[21/9] md:aspect-[3/1] bg-white/5 animate-pulse" />

        {/* Pinned grid skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="h-8 w-40 bg-white/5 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[2/3] bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>

        {/* Section skeletons */}
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="container mx-auto px-4 py-8">
            <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-video sm:aspect-[2/3] bg-white/5 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
