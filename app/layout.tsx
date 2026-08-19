import './styles.css';
import './mobile-fixes.css';
import './invite-system.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rocha + Corretores | Salão do Imóvel ADEMI 2026',
  description:
    'Convite exclusivo para corretores visitarem o stand da Rocha Empreendimentos no Salão do Imóvel ADEMI 2026.',
  robots: {
    index: false,
    follow: false,
    nocache: true
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any'
      },
      {
        url: '/icon.png',
        type: 'image/png',
        sizes: '256x256'
      }
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
