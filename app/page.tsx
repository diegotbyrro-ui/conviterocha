'use client';

import { FormEvent, useEffect, useState } from 'react';
import InviteRegistrationForm from './InviteRegistrationForm';

type Product = {
  eyebrow: string;
  name: string;
  location: string;
  label: string;
  description: string;
  slides: { src: string; alt: string }[];
};

type BrokerageOption = {
  id: string;
  name: string;
  slug: string;
};

const products: Product[] = [
  {
    eyebrow: 'PRÉ-LANÇAMENTO',
    name: 'Easy Rota do Mar',
    location: 'Maceió • Serraria / José Tenório',
    label: '01',
    description:
      'Um novo produto da linha Easy para apresentar ao seu cliente. Conheça no stand os materiais, diferenciais e condições comerciais.',
    slides: [
      { src: '/easy-rota-01.jpg', alt: 'Vista geral do Easy Rota do Mar' },
      { src: '/easy-rota-02.jpg', alt: 'Fachada do Easy Rota do Mar' },
      { src: '/easy-rota-03.jpg', alt: 'Piscina do Easy Rota do Mar' },
    ],
  },
  {
    eyebrow: 'EM PIRANHAS',
    name: 'Vistas do Sino',
    location: 'Piranhas • Alagoas',
    label: '02',
    description:
      'Casas com uma proposta diferenciada em Piranhas. Um produto para ampliar seu portfólio e criar novas conversas de venda.',
    slides: [
      { src: '/vistas-sino-01.jpg', alt: 'Vista aérea das casas do Vistas do Sino' },
      { src: '/vistas-sino-02.jpg', alt: 'Casa do Vistas do Sino com área externa' },
      { src: '/vistas-sino-03.jpg', alt: 'Piscina e vista do Vistas do Sino' },
    ],
  },
  {
    eyebrow: 'ÚLTIMAS OPORTUNIDADES',
    name: 'Eco Vittá',
    location: 'Maceió • Santa Amélia',
    label: '03',
    description:
      'Um produto em fase avançada para clientes que querem comprar agora. Converse com o time Rocha sobre as oportunidades disponíveis.',
    slides: [
      { src: '/eco-vitta.jpg', alt: 'Eco Vittá da Rocha Empreendimentos' },
      { src: '/eco-vitta-piscina.jpg', alt: 'Área de lazer do Eco Vittá' },
    ],
  },
];

const visitingHours = [
  { day: 'Quinta-feira', date: '20/08', time: '14h às 22h' },
  { day: 'Sexta-feira', date: '21/08', time: '14h às 22h' },
  { day: 'Sábado', date: '22/08', time: '14h às 22h' },
  { day: 'Domingo', date: '23/08', time: '14h às 21h' },
];

const googleMapsQuery =
  'https://www.google.com/maps/search/?api=1&query=Centro+Cultural+e+de+Exposicoes+Ruth+Cardoso+Maceio';
const googleMapsEmbed =
  'https://www.google.com/maps?q=Centro%20Cultural%20e%20de%20Exposi%C3%A7%C3%B5es%20Ruth%20Cardoso%20Macei%C3%B3&z=15&output=embed';

function RochaLogo({ light = false }: { light?: boolean }) {
  return (
    <div className={`brandLogo ${light ? 'brandLogo--light' : ''}`}>
      <img
        src={light ? "/rocha-logo-footer.png" : "/rocha-logo-header.png"}
        alt="Rocha Empreendimentos"
        className={`brandLogoImage ${light ? 'brandLogoImage--light' : ''}`}
      />
    </div>
  );
}

function ProductShowcase({ product, index }: { product: Product; index: number }) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (product.slides.length < 2) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setSlide((current) => (current + 1) % product.slides.length);
    }, 4200 + index * 350);
    return () => window.clearInterval(timer);
  }, [product.slides.length, index]);

  return (
    <article className={`projectCard reveal ${index % 2 ? 'projectCard--reverse' : ''}`}>
      <div className="projectMedia">
        {product.slides.map((item, slideIndex) => (
          <img
            key={item.src}
            src={item.src}
            alt={item.alt}
            className={slideIndex === slide ? 'projectSlide projectSlide--active' : 'projectSlide'}
          />
        ))}
        <div className="projectCounter">
          {String(slide + 1).padStart(2, '0')} / {String(product.slides.length).padStart(2, '0')}
        </div>
        <div className="projectDots" aria-label={`Galeria ${product.name}`}>
          {product.slides.map((_, dotIndex) => (
            <button
              type="button"
              key={dotIndex}
              className={dotIndex === slide ? 'projectDot projectDot--active' : 'projectDot'}
              onClick={() => setSlide(dotIndex)}
              aria-label={`Ver imagem ${dotIndex + 1} de ${product.name}`}
            />
          ))}
        </div>
      </div>
      <div className="projectCopy">
        <div className="projectNumber">{product.label}</div>
        <span className="eyebrow">{product.eyebrow}</span>
        <h3>{product.name}</h3>
        <div className="projectLocation">{product.location}</div>
        <p>{product.description}</p>
        <a href="#cadastro" className="textLink">
          Quero conhecer no stand <span>↗</span>
        </a>
      </div>
    </article>
  );
}

export default function HomePage() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState('');
  const [brokerages, setBrokerages] = useState<BrokerageOption[]>([]);
  const [brokeragesLoading, setBrokeragesLoading] = useState(true);
  const [tracking, setTracking] = useState({ utm_source: '', utm_medium: '', utm_campaign: '', referrer: '' });
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());

  async function loadBrokerages() {
    try {
      setBrokeragesLoading(true);
      const res = await fetch('/api/brokerages', { cache: 'no-store' });
      if (!res.ok) throw new Error('Falha ao carregar imobiliárias');
      const data = (await res.json()) as BrokerageOption[];
      setBrokerages(data);
    } catch (error) {
      console.error(error);
      setMessage('Não foi possível carregar as imobiliárias. Atualize a página e tente novamente.');
    } finally {
      setBrokeragesLoading(false);
    }
  }

  useEffect(() => {
    loadBrokerages();
  }, []);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setTracking({
      utm_source: p.get('utm_source') || '',
      utm_medium: p.get('utm_medium') || '',
      utm_campaign: p.get('utm_campaign') || '',
      referrer: document.referrer || '',
    });

    const items = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setMessage('');
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ ...data, ...tracking, form_started_at: formStartedAt }),
      });

      if (res.ok) {
        setDone(true);
        e.currentTarget.reset();
        setFormStartedAt(Date.now());
        await loadBrokerages();
      } else {
        const json = await res.json().catch(() => ({}));
        setMessage(json.error || 'Não foi possível concluir seu cadastro.');
      }
    } catch {
      setMessage('Falha de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="invitePage">
      <header className="siteHeader">
        <div className="container headerInner">
          <RochaLogo />
          <div className="headerEvent">
            <span>20—23 AGO 2026</span>
            <b>SALÃO DO IMÓVEL ADEMI</b>
          </div>
          <a className="headerCta" href="#cadastro">
            Confirmar presença <span>↗</span>
          </a>
        </div>
      </header>

      <section className="motionHero">
        <div className="heroPhoto" aria-hidden="true">
          <img src="/easy-rota-01.jpg" alt="" />
        </div>
        <div className="heroShade" />
        <div className="heroGrid" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="heroMotionArt" aria-hidden="true">
          <span className="heroGiantWord">EASY</span>
          <span className="heroLine heroLine--one" />
          <span className="heroLine heroLine--two" />
          <span className="heroLine heroLine--three" />
          <span className="heroRing heroRing--one" />
          <span className="heroRing heroRing--two" />
        </div>
        <div className="container heroInner">
          <div className="heroCopy reveal is-visible">
            <span className="heroKicker">
              <i /> SALÃO DO IMÓVEL ADEMI 2026
            </span>
            <div className="prelaunchBadge">
              <span>PRÉ</span>
              <strong>LANÇAMENTO</strong>
            </div>
            <h1>
              Corretor,
              <br />
              venha saber
              <br />
              em primeira mão
              <br />
              <em>sobre os lançamentos da Rocha.</em>
            </h1>
            <p>
              Visite o stand da Rocha no Salão do Imóvel ADEMI e descubra antes de todo mundo o pré-lançamento Easy Rota do Mar, além de outras oportunidades do portfólio para ampliar seu repertório e vender com mais argumento.
            </p>
            <div className="heroActions">
              <a className="primaryCta" href="#cadastro">
                Quero visitar o stand Rocha <span>↗</span>
              </a>
              <a className="ghostCta" href="#empreendimentos">
                Ver empreendimentos
              </a>
            </div>
          </div>
          <div className="heroSide reveal is-visible">
            <div className="heroProductTag">
              <span>PRÉ-LANÇAMENTO • EASY ROTA DO MAR</span>
              <b>SERRARIA • MACEIÓ</b>
            </div>
            <div className="heroDate">
              <small>AGOSTO</small>
              <strong className="dateRange"><span>20</span><i>—</i><span>23</span></strong>
              <span>
                Centro de Convenções
                <br />
                Maceió • AL
              </span>
            </div>
            <div className="heroStand">
              <span>STAND</span>
              <strong>ROCHA</strong>
            </div>
          </div>
        </div>
        <div className="motionTicker" aria-hidden="true">
          <div className="tickerTrack">
            <span>PRÉ-LANÇAMENTO • EASY ROTA DO MAR</span>
            <b>•</b>
            <span>ROCHA EMPREENDIMENTOS</span>
            <b>•</b>
            <span>SALÃO DO IMÓVEL ADEMI 2026</span>
            <b>•</b>
            <span>CORRETORES</span>
            <b>•</b>
            <span>20 A 23 DE AGOSTO</span>
            <b>•</b>
            <span>PRÉ-LANÇAMENTO • EASY ROTA DO MAR</span>
            <b>•</b>
            <span>ROCHA EMPREENDIMENTOS</span>
            <b>•</b>
            <span>SALÃO DO IMÓVEL ADEMI 2026</span>
            <b>•</b>
            <span>CORRETORES</span>
            <b>•</b>
            <span>20 A 23 DE AGOSTO</span>
            <b>•</b>
          </div>
        </div>
      </section>

      <section className="projectsSection" id="empreendimentos">
        <div className="container projectsHead reveal">
          <span className="eyebrow">NO STAND DA ROCHA</span>
          <h2>
            Conheça os produtos.
            <br />
            <em>Venda com mais repertório.</em>
          </h2>
          <p className="projectsIntro">
            Três oportunidades para diferentes perfis de cliente, com destaque para o pré-lançamento do Easy Rota do Mar.
          </p>
        </div>
        <div className="container projectStack">{products.map((product, index) => <ProductShowcase key={product.name} product={product} index={index} />)}</div>
      </section>

      <section className="venueSection" id="localizacao">
        <div className="container venueGrid">
          <div className="venueCopy reveal">
            <span className="eyebrow">LOCAL DO EVENTO</span>
            <h2>
              Centro de Convenções
              <br />
              <em>de Maceió.</em>
            </h2>
            <p className="venueLead">
              O encontro acontece no Centro Cultural e de Exposições Ruth Cardoso, em Jaraguá. Abaixo você encontra os horários de visitação e a localização no mapa.
            </p>
            <div className="venueAddressCard">
              <span>ENDEREÇO</span>
              <strong>Centro Cultural e de Exposições Ruth Cardoso</strong>
              <small>Rua Celso Piatti, Jaraguá • Maceió - AL</small>
            </div>
            <div className="venueActions">
              <a className="primaryCta primaryCta--red" href={googleMapsQuery} target="_blank" rel="noreferrer">
                Abrir no Google Maps <span>↗</span>
              </a>
              <a className="ghostCta ghostCta--dark" href="#cadastro">Confirmar presença</a>
            </div>
          </div>

          <div className="venueMapWrap reveal">
            <div className="venueMapCard">
              <div className="venueMapLabel">MAPA DO LOCAL</div>
              <iframe
                title="Mapa do Centro de Convenções de Maceió"
                src={googleMapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="container scheduleBlock reveal">
          <div className="scheduleHead">
            <span className="eyebrow">HORÁRIOS DE VISITAÇÃO</span>
            <h3>Salão aberto ao público e corretores</h3>
          </div>
          <div className="scheduleTable">
            {visitingHours.map((item) => (
              <div className="scheduleRow" key={item.date}>
                <div>
                  <strong>{item.day}</strong>
                  <span>{item.date}</span>
                </div>
                <b>{item.time}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="formSection" id="cadastro">
        <div className="container formGrid">
          <div className="formIntro reveal">
            <div className="sectionIndex sectionIndex--red">
              <span>02</span>
              <i />
            </div>
            <span className="eyebrow">CONFIRME SUA PRESENÇA</span>
            <h2>
              Corretor,
              <br />
              a Rocha espera
              <br />
              <em>por você.</em>
            </h2>
            <p>
              Faça seu cadastro agora. Assim, a equipe comercial já recebe seu perfil e consegue direcionar sua visita para as oportunidades mais aderentes à sua atuação.
            </p>
            <div className="eventStamp">
              <div className="eventStampRange"><span>20</span><i>—</i><span>23</span></div>
              <small>
                AGOSTO 2026
                <br />
                CENTRO DE CONVENÇÕES
              </small>
            </div>
          </div>

          <div className="formCard reveal">
            <InviteRegistrationForm />
          </div>
        </div>
      </section>

      <footer className="siteFooter">
        <div className="container footerInner">
          <RochaLogo light />
          <p>
            Salão do Imóvel ADEMI 2026
            <br />
            <span>20 a 23 de agosto • Centro de Convenções de Maceió</span>
          </p>
          <a href="#cadastro">Confirmar presença ↑</a>
        </div>
      </footer>
    </main>
  );
}
