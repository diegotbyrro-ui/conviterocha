import './styles.css';
import './mobile-fixes.css';
import './invite-system.css';
import './tardezinha.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tardezinha com a Rocha | Convite Especial',
  description:
    'Convite especial para a Tardezinha com a Rocha. Confirme sua presença para o encontro do dia 09 de outubro de 2026, às 17h.',
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
