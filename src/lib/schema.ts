export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TUNREPLAY',
  url: 'https://tunreplay.com',
  description: 'موقع TUNREPLAY لمشاهدة الافلام والمسلسلات الاجنبي والاسيوي والانمي',
  inLanguage: 'ar-AR',
  publisher: {
    '@type': 'Organization',
    name: 'TUNREPLAY',
    logo: {
      '@type': 'ImageObject',
      url: 'https://tunreplay.com/logo.png'
    }
  }
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TUNREPLAY',
  url: 'https://tunreplay.com',
  logo: 'https://tunreplay.com/logo.png',
  sameAs: [
    'https://facebook.com/tunreplay',
    'https://twitter.com/tunreplay'
  ]
};

export function generateCollectionPageSchema(data: {
  name: string;
  description: string;
  url: string;
  itemCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: data.name,
    description: data.description,
    url: `https://tunreplay.com${data.url}`,
    numberOfItems: data.itemCount,
    inLanguage: 'ar-AR',
    isPartOf: {
      '@type': 'WebSite',
      name: 'TUNREPLAY',
      url: 'https://tunreplay.com'
    },
    publisher: {
      '@type': 'Organization',
        name: 'TUNREPLAY',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tunreplay.com/logo.png'
      }
    }
  };
}

export function generateSeriesListSchema(series: Array<{
  title: string;
  poster: string;
  story: string;
  slug: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: series.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TVSeries',
        name: item.title,
        image: item.poster,
        description: item.story,
        url: `https://tunreplay.com/series/${item.slug}`
      }
    }))
  };
}

export function generateSchedulePageSchema(data: {
  day: string;
  dayAr: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SchedulePage',
    name: `مواعيد عرض حلقات ${data.dayAr} - TUNREPLAY`,
    description: `جدول مواعيد عرض الحلقات الجديدة ليوم ${data.dayAr} على موقع TUNREPLAY`,
    publisher: {
      '@type': 'Organization',
      name: 'TUNREPLAY',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tunreplay.com/logo.png'
      }
    }
  };
}

export function generateSeriesSchema(series: {
  title: string;
  story: string;
  poster: string;
  imdb?: string | null;
  duration?: string | null;
  category?: { name: string } | null;
  year?: { name: string } | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: series.title,
    description: series.story,
    image: series.poster,
    aggregateRating: series.imdb ? {
      '@type': 'AggregateRating',
      ratingValue: series.imdb,
      bestRating: '10',
      worstRating: '1'
    } : undefined,
    duration: series.duration,
    genre: series.category?.name,
    datePublished: series.year?.name,
    publisher: {
      '@type': 'Organization',
      name: 'TUNREPLAY',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tunreplay.com/logo.png'
      }
    }
  };
}

export function generateEpisodeSchema(episode: {
  title: string;
  number: string;
  cover: string;
  series: {
    title: string;
    slug: string;
  };
  date_created: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TVEpisode',
    name: `${episode.series.title} - ${episode.title}`,
    episodeNumber: episode.number,
    image: episode.cover,
    datePublished: episode.date_created,
    partOfSeries: {
      '@type': 'TVSeries',
      name: episode.series.title,
      url: `https://tunreplay.com/series/${episode.series.slug}`
    },
    publisher: {
      '@type': 'Organization',
      name: 'TUNREPLAY',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tunreplay.com/logo.png'
      }
    }
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://tunreplay.com${item.url}`
    }))
  };
} 