interface Download {
  id: number;
  name: string;
  link: string;
}

interface DownloadLinksProps {
  downloads: Download[];
}

export default function DownloadLinks({ downloads }: DownloadLinksProps) {
  if (!downloads?.length) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-white mb-4">روابط التحميل</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {downloads.map((download) => (
          <a
            key={download.id}
            href={download.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition text-sm sm:text-base"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {download.name}
          </a>
        ))}
      </div>
    </div>
  );
} 