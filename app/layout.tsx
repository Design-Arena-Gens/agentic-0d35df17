import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Web Design Studio Reel | @six.solutions',
  description: 'A 5-second funny vertical reel for Instagram. Web design studio life.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  themeColor: '#00e5ff',
  openGraph: {
    title: 'Web Design Studio Reel | @six.solutions',
    description: 'Energetic, funny, clean motion graphics, meme-style pacing.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
