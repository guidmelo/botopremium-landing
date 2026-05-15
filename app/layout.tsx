import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@/components/ui/Analytics';
import { CustomCursor } from '@/components/ui/CustomCursor';

export const metadata: Metadata = {
  title: 'BotoPremium · Harmonização Facial Premium',
  description:
    'Procedimentos de alto padrão para mulheres que valorizam sofisticação, autoestima e resultados naturais. Harmonização facial, botox premium e bioestimuladores com excelência em todo o Brasil.',
  keywords:
    'botox, harmonização facial, preenchimento labial, bioestimuladores, skinbooster, full face, clínica estética premium, BotoPremium',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://botopremium.com.br'),
  openGraph: {
    title: 'BotoPremium · Harmonização Facial Premium',
    description:
      'Procedimentos de alto padrão para mulheres que valorizam sofisticação, autoestima e resultados naturais.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'BotoPremium',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BotoPremium – Harmonização Facial Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BotoPremium · Harmonização Facial Premium',
    description: 'Procedimentos de alto padrão para mulheres que valorizam sofisticação e resultados naturais.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://botopremium.com.br',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'BotoPremium',
  description:
    'Clínica de estética facial e corporal premium com mais de 80 unidades no Brasil. Especializada em harmonização facial, botox e procedimentos estéticos de alto padrão.',
  url: 'https://www.botopremium.com.br',
  logo: 'https://www.botopremium.com.br/logo.png',
  sameAs: [
    'https://www.instagram.com/botopremium/',
    'https://www.botopremium.com.br',
  ],
  medicalSpecialty: 'Aesthetic Medicine',
  priceRange: '$$$$',
  openingHours: 'Mo-Sa 08:00-20:00',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-obsidian text-warm-white antialiased">
        <Analytics />

        {/* Grain overlay */}
        <div className="grain-overlay" aria-hidden="true" />

        {/* Custom cursor (desktop only) */}
        <div className="hidden md:block">
          <CustomCursor />
        </div>

        {children}
      </body>
    </html>
  );
}
