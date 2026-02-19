"use client";

const AD_KEY = "fad4b04cc957ccf4068276b2ab967197";
const AD_WIDTH = 468;
const AD_HEIGHT = 60;

/**
 * Adsterra ad via iframe srcdoc (recommended for React/Next.js).
 * Each iframe has its own JS context so atOptions is isolated and the ad loads correctly.
 * @see https://joshwp.com/how-to-implement-adsterra-ads-in-react-js-next-js-projects/
 */
export default function HomeAdBanner() {
  const adHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>body { margin: 0; padding: 0; overflow: hidden; }</style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '${AD_KEY}',
      'format' : 'iframe',
      'height' : ${AD_HEIGHT},
      'width' : ${AD_WIDTH},
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://www.highperformanceformat.com/${AD_KEY}/invoke.js"><\/script>
</body>
</html>`;

  return (
    <div className="container mx-auto px-4 py-6 flex justify-center">
      <div
        className="flex justify-center items-center min-h-[60px] w-full max-w-[468px] bg-white/5 rounded-lg overflow-hidden"
        data-ad-slot="main"
      >
        <iframe
          srcDoc={adHTML}
          title="Adsterra ad"
          style={{
            width: `${AD_WIDTH}px`,
            height: `${AD_HEIGHT}px`,
            maxWidth: "100%",
            border: "none",
            overflow: "hidden",
          }}
          scrolling="no"
          frameBorder={0}
        />
      </div>
    </div>
  );
}
