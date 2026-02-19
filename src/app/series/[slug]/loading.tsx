export default function Loading() {
  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster Skeleton */}
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-white/5 animate-pulse" />
          </div>

          {/* Info Skeleton */}
          <div className="md:col-span-2 space-y-6">
            <div className="h-8 w-3/4 bg-white/5 rounded animate-pulse" />
            
            <div className="flex gap-4">
              <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse" />
              <div className="h-6 w-32 bg-white/5 rounded-full animate-pulse" />
              <div className="h-6 w-24 bg-white/5 rounded-full animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-white/5 rounded animate-pulse" />
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
              </div>

              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-20 bg-white/5 rounded-full animate-pulse" />
                ))}
              </div>
            </div>

            <div className="h-12 w-40 bg-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
} 