import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DMCA - TUNREPLAY',
  description: 'سياسة حقوق النشر وإشعار DMCA لموقع TUNREPLAY',
  keywords: [
    'DMCA',
    'حقوق النشر',
    'سياسة الخصوصية',
    'TUNREPLAY'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'DMCA - TUNREPLAY',
    description: 'سياسة حقوق النشر وإشعار DMCA لموقع TUNREPLAY',
    type: 'website',
    siteName: 'TUNREPLAY',
    locale: 'ar_AR',
  },
  alternates: {
    canonical: '/dmca',
  },
};

export default function DMCAPage() {
  return (
    <main className="min-h-screen pt-24 pb-12" dir="ltr">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8 text-left">DMCA</h1>
        
        <div className="space-y-6 text-white/80 text-left">
          {/* Main Notice */}
          <p className="leading-relaxed">
            Please Be informed That we don&apos;t Host any of these videos embedded here. All videos found on our site are found freely available around the web on sites such as YouTube,Dailymotion or Rutube. Our mission here, is to organize those videos and to make your search for the latest football/soccer goals easier. We simply link to the video that is already hosted on other web sites. If you are concerned about copyrighted material appearing in this website, we suggest that you contact the web site that is hosting the video and have it removed from there. Once the content is removed from the website hosting your content, it will automatically be removed from tunreplay.com. We are not affiliated nor claim to be affiliated with any of the owners of videos/streams played on our site.
          </p>

          {/* Copyright Notice */}
          <p className="leading-relaxed">
            All content is copyright of their respective owners. We urge all copyright owners, to recognize that links contained within this site are located somewhere else on the web. The embedded link points to the location of the video on the web. Please direct all copyright infringement issues to the companies that host these files (Youtube,Rutube, Ustream.tv, DailyMotion, etc.).
          </p>

          {/* Policy Statement */}
          <p className="leading-relaxed">
            It is our policy to respond to clear notices of alleged copyright infringement. This page outlines the information required to submit these notices and allows online submission for the fastest response
          </p>

          {/* No Infringement Statement */}
          <p className="leading-relaxed">
            No copyright infringement is intended nor implied
          </p>

          {/* Search Engine Notice */}
          <p className="leading-relaxed">
            tunreplay.com simply acts as a search engine, is not responsible for the content of external websites. Please ensure before sending an A/V removal request that the media in question is actually hosted by tunreplay.com. All the video content found on tunreplay.com is not hosted on our servers nor is created or uploaded by us.
          </p>

          {/* Protection Rights */}
          <p className="leading-relaxed">
            The most effective way of protecting your rights is to seek removal from the host that is responsible for the content. This in turn, will remove the content from tunreplay.com and any other search engines that may have indexed the content.
          </p>

          {/* Streams Widget Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Streams Widget</h2>
            <p className="leading-relaxed">
              We do not host or upload any streams. We are not responsible for the accuracy, compliance, copyright, legality, decency, or any other aspect of the content of such streams. We only contain links to other websites on the Internet. If you have any legal issues please contact the appropriate media file owners / hosters or links provider.
            </p>
          </div>

          {/* Agreement Section */}
          <p className="leading-relaxed">
            By visiting/using this web site you hereby agree and understand that all channels on this site contain embedded live streams and links to original uploader. These streams come from freely available web sites on the web such as Veetle.com, Justin.TV, Twitch.TV and others alike. This means that tunreplay.com does NOT host, copies, distributes and/or sells any copyrighted content this web site may display. We are not affiliated nor claims to be affiliated with any of the owners of streams featured on this site. All content is copyright of their respective owners. We would like to urge all copyright owners to recognize that streams contained within this site are hosted and located outside of this web site&apos;s domain name/servers tunreplay.com. Please direct all DMCA claims to the precise web site hosting these streams (Veetle.com, sockshare,putlocker,Justin.TV, Justin.TV etc.). We would like to thank you for your attention and understanding of this subject.
          </p>

          {/* Arabic Notice */}
          <div className="text-right" dir="rtl">
            <p className="text-primary leading-relaxed">
              تنبيه: موقعنا لا يبث أي من هذه القنوات على سيرفراتنا من سيرفرات أخرى إذا كان عندك مشكلة كود الإتصال بالسيرفر المستضيف للقناة
            </p>
          </div>

          {/* Images Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Images</h2>
            <p className="leading-relaxed">
              tunreplay.com may use external images. The images on this website are build by Us, or gathered/extracted automatically from videos which we collect from youtube,dailymotion and similar sites. We do not take credit for any of the images on our website. We give credit to the creator where ever applicable.
            </p>
            <p className="leading-relaxed mt-2">
              All products, images, logos and contents on this website are the property of their respective owners.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Contacting Us</h2>
            <p className="leading-relaxed">
              If there are any questions regarding this privacy policy you may contact us.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 