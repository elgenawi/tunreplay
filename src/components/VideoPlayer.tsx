interface Source {
  id: string;
  type: string;
  title: string;
  source: string;
  date_created: string;
  date_updated: string;
  Episode: string;
}

interface VideoPlayerProps {
  currentSource: Source | null;
  sources: Source[];
  onSourceChange: (source: Source) => void;
}

export default function VideoPlayer({ currentSource, sources, onSourceChange }: VideoPlayerProps) {
  return (
    <div className="space-y-6">
      {/* Server Tabs */}
      {sources.length > 0 ? (
        <div className="flex flex-wrap gap-2 border-b border-white/10">
          {sources.map((source: Source) => (
            <button
              key={source.id}
              onClick={() => onSourceChange(source)}
              className={`px-4 py-2 rounded-t-lg transition ${
                currentSource?.id === source.id
                  ? 'bg-primary text-white'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white'
              } ${source.source.includes('megamax.me') ? 'order-first' : ''}`}
            >
              {source.title}
            </button>
          ))}
        </div>
      ) : null}

      {/* Video Player */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
        {currentSource ? (
          <iframe
            src={currentSource.source}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Video player"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/60">
            <p className="text-center">
              عذراً، هذه الحلقة غير متوفرة حالياً
              <br />
              <span className="text-sm">يرجى المحاولة لاحقاً</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 