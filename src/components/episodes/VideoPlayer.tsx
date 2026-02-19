import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Player from 'video.js/dist/types/player';

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

export default function VideoPlayer({
  currentSource,
  sources,
  onSourceChange,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractWecimaEmbedUrl = async (url: string): Promise<string> => {
    try {
      const response = await fetch(`/api/wecima?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch embed URL');
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data.embedUrl;
    } catch (err) {
      console.error('Error extracting wecima embed URL:', err);
      throw err;
    }
  };

  // Initialize video.js player
  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        fluid: true,
        responsive: true,
        playbackRates: [0.5, 1, 1.5, 2],
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  // Process source
  useEffect(() => {
    if (!currentSource) {
      setSourceUrl(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const processSource = async () => {
      try {
        if (currentSource.type === 'wecima') {
          const embedUrl = await extractWecimaEmbedUrl(currentSource.source);
          setSourceUrl(embedUrl);
        } else if (currentSource.source.includes('vkspeed.com')) {
          setSourceUrl(currentSource.source);
        } else {
          setSourceUrl(currentSource.source);
        }
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load video source');
        setIsLoading(false);
        console.error('Error processing source:', err);
      }
    };

    processSource();
  }, [currentSource]);

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
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center text-white/60">
            <p className="text-center">
              جاري تحميل الفيديو...
              <br />
              <span className="text-sm">يرجى الانتظار</span>
            </p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center text-white/60">
            <p className="text-center">
              {error}
              <br />
              <span className="text-sm">يرجى المحاولة مرة أخرى</span>
            </p>
          </div>
        ) : currentSource && sourceUrl ? (
          <iframe
            src={sourceUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            referrerPolicy="no-referrer"
            loading="lazy"
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
