import { DiscussionEmbed } from 'disqus-react';
import { useEffect } from 'react';

interface DisqusCommentsProps {
  identifier: string;
  title: string;
  url: string;
}

export default function DisqusComments({ identifier, title, url }: DisqusCommentsProps) {
  // Add custom CSS to style the Disqus iframe
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      #disqus_thread {
        color-scheme: light;
        color: white !important;
      }
      #disqus_thread iframe {
        background: transparent !important;
        color-scheme: light !important;
      }
      .post-message {
        color: white !important;
      }
      .comment-text {
        color: white !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="bg-white/10 rounded-lg p-6">
      <div id="disqus_thread" className="min-h-[300px]">
        <DiscussionEmbed
          shortname="tunreplay" // Replace with your actual Disqus shortname
          config={{
            url: url,
            identifier: identifier,
            title: title,
            language: 'ar' // Set language to Arabic
          }}
        />
      </div>
    </div>
  );
} 