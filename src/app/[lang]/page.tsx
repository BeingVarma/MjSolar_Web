import { Metadata } from 'next';
import { translations, Language } from '@/lib/translations';
import ClientPage from './ClientPage';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const langCode = resolvedParams.lang;
  if (!['en', 'hi', 'te'].includes(langCode)) return {};

  const lang = langCode as Language;
  const t = translations[lang] as Record<string, string>;
  
  const title = t.seoTitle || "MjSolar | Premium Solar Energy";
  const description = t.seoDescription || "Pure Solar Energy. Engineered in 72 Hours. Powering premium residences and commercial hubs with the world's highest-efficiency panels.";
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://mjsolar.com/${lang === 'en' ? '' : lang}`,
      locale: lang === 'hi' || lang === 'te' ? `${lang}_IN` : `en_IN`,
      siteName: "MjSolar",
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "MjSolar - Premium Solar Energy",
        },
      ],
    },
    alternates: {
      canonical: `https://mjsolar.com/${lang === 'en' ? '' : lang}`,
      languages: {
        'en': 'https://mjsolar.com',
        'hi': 'https://mjsolar.com/hi',
        'te': 'https://mjsolar.com/te',
      }
    }
  };
}

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'hi' }, { lang: 'te' }];
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  if (!['en', 'hi', 'te'].includes(resolvedParams.lang)) {
    notFound();
  }
  return <ClientPage />;
}
