import type { Metadata } from 'next';
import './globals.css';
import { ToastContainerWrapper } from '@/components/ui/toast-wrapper';
import { StoreInitializerWrapper } from '@/components/layout/init-wrapper';

export const metadata: Metadata = {
  title: "Royale Construction Company's CRM",
  description: "Royale Construction Company's CRM - Pipeline, Leads, Bids & Project Management",
  openGraph: {
    title: "Royale Construction Company's CRM",
    description: "Streamline construction projects, pipeline, leads, bids, and client communication.",
    type: 'website',
    siteName: 'Royale Construction CRM',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Royale Construction Company's CRM",
    description: "Streamline construction projects, pipeline, leads, bids, and client communication.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  if (theme === 'dark' || !localStorage.getItem('theme')) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <ToastContainerWrapper />
        <StoreInitializerWrapper />
      </body>
    </html>
  );
}
