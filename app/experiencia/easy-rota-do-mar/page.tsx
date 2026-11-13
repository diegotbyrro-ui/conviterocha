import type { Metadata } from 'next';
import EasyRotaClient from './EasyRotaClient';
import './easy-rota.css';

export const metadata: Metadata = {
  title: 'Easy Rota do Mar | Experiência Interativa — Homologação Rocha',
  description: 'Protótipo de apresentação interativa do Easy Rota do Mar, para revisão interna e homologação da Rocha Empreendimentos.',
  robots: { index: false, follow: false, nocache: true },
};

export default function EasyRotaDoMarHomologacao() {
  return <EasyRotaClient />;
}
