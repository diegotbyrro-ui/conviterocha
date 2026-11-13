'use client';

import { useEffect, useState } from 'react';

type TypeKey = 'slim' | 'premium' | 'master' | 'spazzio';
type Filter = 'todos' | 'acessos' | 'lazer' | 'conveniencia' | 'estrutura';
type GalleryKey = 'hero' | 'fachada' | 'piscina' | 'kids' | 'fitness' | 'market' | 'recarga';

const media = (id: string) => `/api/experiencia/easy-rota-do-mar/media/${id}`;
const official = 'https://meurocha.com.br/imoveis/easy-rota-do-mar';

const types: Record<TypeKey, {
  name: string; area: string; rooms: string; description: string;
  finish: string; parking: string; image: string;
}> = {
  slim: { name: 'Slim', area: '39,19 m²', rooms: '2 quartos', description: 'Ambientes funcionais para uma rotina prática.', finish: '01 e 08', parking: '1 vaga', image: 'slim' },
  premium: { name: 'Premium', area: '45,21 m²', rooms: '2 quartos com suíte', description: 'Uma configuração que equilibra conforto e praticidade.', finish: '02 e 03', parking: '1 vaga', image: 'premium' },
  master: { name: 'Master', area: '47,91 m²', rooms: '2 quartos com suíte master', description: 'Uma forma de viver com mais espaço e privacidade.', finish: '06 e 07', parking: '1 vaga', image: 'master' },
  spazzio: { name: 'Spazzio', area: '58,60 m²', rooms: '3 quartos', description: 'Três quartos, suíte master, suíte reversível e varanda gourmet.', finish: '04 e 05', parking: '2 vagas', image: 'spazzio' },
};

const endings: Record<TypeKey, number[]> = { slim: [1, 8], premium: [2, 3], master: [6, 7], spazzio: [4, 5] };
const endingToType: Record<number, TypeKey> = { 1: 'slim', 2: 'premium', 3: 'premium', 4: 'spazzio', 5: 'spazzio', 6: 'master', 7: 'master', 8: 'slim' };

const gallery: { id: GalleryKey; title: string; category: string }[] = [
  { id: 'hero', title: 'Vista geral', category: 'Arquitetura' },
  { id: 'fachada', title: 'Fachada', category: 'Arquitetura' },
  { id: 'piscina', title: 'Piscinas e lazer', category: 'Lazer' },
  { id: 'kids', title: 'Playground', category: 'Lazer' },
  { id: 'fitness', title: 'Espaço fitness', category: 'Bem-estar' },
  { id: 'market', title: 'Easy Market', category: 'Conveniência' },
  { id: 'recarga', title: 'Recarga elétrica', category: 'Mobilidade' },
];

const facilities: { number: number; name: string; category: Exclude<Filter, 'todos'>; image?: GalleryKey }[] = [
  { number: 1, name: 'Rua de acesso', category: 'acessos' },
  { number: 2, name: 'Calçada com gramado', category: 'acessos' },
  { number: 3, name: 'Guarita', category: 'acessos' },
  { number: 4, name: 'Acesso de pedestres', category: 'acessos' },
  { number: 5, name: 'Acesso de veículos', category: 'acessos' },
  { number: 6, name: 'Piscina adulto', category: 'lazer', image: 'piscina' },
  { number: 7, name: 'Piscina infantil', category: 'lazer', image: 'piscina' },
  { number: 8, name: 'Gazebo', category: 'lazer' },
  { number: 9, name: 'Espaço Grill', category: 'lazer' },
  { number: 10, name: 'Espaço Gourmet', category: 'lazer' },
  { number: 11, name: 'Espaço Fitness', category: 'lazer', image: 'fitness' },
  { number: 12, name: 'Easy Play', category: 'lazer', image: 'kids' },
  { number: 13, name: 'Easy Market', category: 'conveniencia', image: 'market' },
  { number: 14, name: 'Espaço Beleza', category: 'conveniencia' },
  { number: 15, name: 'Easy Work', category: 'conveniencia' },
  { number: 16, name: 'Rampas do edifício garagem', category: 'estrutura' },
  { number: 17, name: 'Bicicletários', category: 'estrutura' },
  { number: 18, name: 'Escadas do edifício garagem', category: 'estrutura' },
  { number: 19, name: 'Depósito', category: 'estrutura' },
  { number: 20, name: 'Restaurante colaboradores', category: 'estrutura' },
  { number: 21, name: 'Banheiros colaboradores', category: 'estrutura' },
  { number: 22, name: 'Easy Wash', category: 'conveniencia' },
  { number: 23, name: 'Espaço Ecumênico', category: 'lazer' },
  { number: 24, name: 'Recepção', category: 'acessos' },
  { number: 25, name: 'Espaço Pet', category: 'lazer' },
  { number: 26, name: 'Redário', category: 'lazer' },
  { number: 27, name: 'Boulevard Rota do Mar', category: 'lazer' },
  { number: 28, name: 'Praça', category: 'lazer' },
  { number: 29, name: 'Espaço Kids', category: 'lazer', image: 'kids' },
  { number: 30, name: 'Pista de Cooper', category: 'lazer' },
  { number: 31, name: 'Recarga de veículos elétricos', category: 'estrutura', image: 'recarga' },
  { number: 32, name: 'Vagas PNE', category: 'estrutura' },
  { number: 33, name: 'Lixo seco e molhado', category: 'estrutura' },
];

const filterNames: Record<Filter, string> = {
  todos: 'Todos', acessos: 'Acessos', lazer: 'Lazer', conveniencia: 'Conveniência', estrutura: 'Estrutura',
};

function Picture({ id, alt, className = '', eager = false }: { id: string; alt: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [id]);
  if (failed) return <div className={`erm19-imageError ${className}`} role="img" aria-label={`${alt}. Imagem indisponível.`}>Imagem indisponível na origem oficial</div>;
  return <img className={className} src={media(id)} alt={alt} loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)} />;
}

export default function EasyRotaClient() {
  const [selectedTower, setSelectedTower] = useState<'norte' | 'sul'>('norte');
  const [selectedType, setSelectedType] = useState<TypeKey>('spazzio');
  const [selectedEnding, setSelectedEnding] = useState(4);
  const [is3d, setIs3d] = useState(false);
  const [filter, setFilter] = useState<Filter>('todos');
  const [facilityNumber, setFacilityNumber] = useState(6);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const selected = types[selectedType];
  const feature = facilities.find((item) => item.number === facilityNumber) || facilities[0];
  const activeGallery = gallery[galleryIndex];
  const visibleFacilities = facilities.filter((item) => filter === 'todos' || item.category === filter);

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(false);
      if (event.key === 'ArrowRight') setGalleryIndex((x) => (x + 1) % gallery.length);
      if (event.key === 'ArrowLeft') setGalleryIndex((x) => (x + gallery.length - 1) % gallery.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightbox]);

  const changeGallery = (delta: number) => setGalleryIndex((x) => (x + delta + gallery.length) % gallery.length);

  return (
    <main className="erm19" id="inicio">
      <header className="erm19-header">
        <a className="erm19-brand" href="#inicio" aria-label="Rocha — voltar ao início">
          <img src="/rocha-logo-vivaalem.png" alt="Rocha Empreendimentos" />
          <span className="erm19-brandDivider" aria-hidden="true" />
          <span className="erm19-brandSubtitle">EXPERIÊNCIAS</span>
        </a>
        <nav aria-label="Navegação da experiência" className={mobileMenu ? 'erm19-nav erm19-navOpen' : 'erm19-nav'}>
          <a onClick={() => setMobileMenu(false)} href="#conceito">O projeto</a>
          <a onClick={() => setMobileMenu(false)} href="#plantas">Plantas</a>
          <a onClick={() => setMobileMenu(false)} href="#implantacao">Implantação</a>
          <a onClick={() => setMobileMenu(false)} href="#galeria">Galeria</a>
          <a onClick={() => setMobileMenu(false)} href="#localizacao">Localização</a>
        </nav>
        <div className="erm19-headerRight">
          <span className="erm19-status"><i aria-hidden="true" /> HOMOLOGAÇÃO R19</span>
          <button className="erm19-menuToggle" type="button" aria-label={mobileMenu ? 'Fechar menu' : 'Abrir menu'} aria-expanded={mobileMenu} onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? '×' : '☰'}</button>
        </div>
      </header>

      <section className="erm19-hero" aria-labelledby="erm19-title">
        <div className="erm19-heroVisual"><Picture id="hero" alt="Perspectiva ilustrativa da fachada do Easy Rota do Mar" eager /><div className="erm19-heroShade" /></div>
        <div className="erm19-heroContent">
          <span className="erm19-eyebrow erm19-eyebrowLight"><span className="erm19-line" /> UM NOVO JEITO DE VIVER MACEIÓ</span>
          <span className="erm19-heroName">EASY <b>ROTA DO MAR</b></span>
          <h1 id="erm19-title">Seu próximo capítulo começa <em>por aqui.</em></h1>
          <p>Um empreendimento pensado para conectar a praticidade da Serraria a novas possibilidades de viver bem.</p>
          <div className="erm19-heroActions"><a className="erm19-primary" href="#plantas">Conheça as plantas <span aria-hidden="true">↗</span></a><a className="erm19-textLink" href="#galeria">Explorar o empreendimento <span aria-hidden="true">↓</span></a></div>
        </div>
        <span className="erm19-heroCredit">IMAGEM MERAMENTE ILUSTRATIVA</span>
        <div className="erm19-heroBottom"><span>01 / 05 &nbsp; EXPERIÊNCIA EASY</span><span>SCROLL PARA EXPLORAR <span aria-hidden="true">↓</span></span></div>
      </section>

      <section className="erm19-metrics" id="conceito" aria-label="O empreendimento em números">
        <div className="erm19-metricsIntro"><span className="erm19-eyebrow">O CAMINHO MAIS CURTO ENTRE A SERRARIA E O MAR</span><h2>Um lugar para viver <em>além do comum.</em></h2></div>
        <div className="erm19-metric"><strong>02</strong><span>Torres<br />Norte e Sul</span></div>
        <div className="erm19-metric"><strong>04</strong><span>Tipologias<br />de planta</span></div>
        <div className="erm19-metric"><strong>208</strong><span>Apartamentos<br />no projeto</span></div>
      </section>

      <section className="erm19-section erm19-plants" id="plantas">
        <div className="erm19-heading"><div><span className="erm19-eyebrow">01 · ESCOLHA SEU ESPAÇO</span><h2>Cada estilo de vida <em>tem sua planta.</em></h2><p>Explore as tipologias do Easy Rota do Mar. Esta navegação apresenta o projeto, não unidades disponíveis para venda.</p></div><span className="erm19-sectionIndex">01 — 04</span></div>
        <div className="erm19-towerBar"><span>SELECIONE A TORRE <small>referência visual, sem consulta de estoque</small></span><div role="group" aria-label="Selecionar torre" className="erm19-towerButtons"><button type="button" aria-pressed={selectedTower === 'norte'} className={selectedTower === 'norte' ? 'isActive' : ''} onClick={() => setSelectedTower('norte')}>Torre Norte <small>1ª fase comercial</small></button><button type="button" aria-pressed={selectedTower === 'sul'} className={selectedTower === 'sul' ? 'isActive' : ''} onClick={() => setSelectedTower('sul')}>Torre Sul <small>visualização do projeto</small></button></div></div>
        <div className="erm19-plantsGrid">
          <div className="erm19-typeList" aria-label="Tipologias disponíveis para exploração">
            {(Object.keys(types) as TypeKey[]).map((key, index) => (
              <button type="button" key={key} className={`erm19-typeCard ${selectedType === key ? 'isActive' : ''}`} onClick={() => { setSelectedType(key); setSelectedEnding(endings[key][0]); setIs3d(false); }} aria-pressed={selectedType === key}>
                <span className="erm19-typeNumber">0{index + 1}</span><span className="erm19-typeCopy"><strong>{types[key].name}</strong><small>{types[key].rooms}</small></span><span className="erm19-typeArea">{types[key].area}</span><span className="erm19-typeArrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <div className="erm19-plantVisual">
            <div className="erm19-plantVisualTop"><span>PLANTA {selected.name.toUpperCase()} · TORRE {selectedTower.toUpperCase()}</span><span>REFERÊNCIA COMERCIAL</span></div>
            <div className="erm19-plantImage"><Picture id={selectedType === 'spazzio' && is3d ? 'spazzio-3d' : selected.image} alt={`Planta ilustrativa ${selected.name} do Easy Rota do Mar`} /><span className="erm19-plantWatermark">IMAGEM ILUSTRATIVA</span></div>
            {selectedType === 'spazzio' && <div className="erm19-plantView"><button type="button" aria-pressed={!is3d} onClick={() => setIs3d(false)} className={!is3d ? 'isActive' : ''}>Planta 2D</button><button type="button" aria-pressed={is3d} onClick={() => setIs3d(true)} className={is3d ? 'isActive' : ''}>Planta 3D ilustrada</button></div>}
          </div>
          <aside className="erm19-plantInfo"><span className="erm19-eyebrow">SUA ESCOLHA</span><h3>{selected.name}<span>{selected.area}</span></h3><p>{selected.description}</p><dl><div><dt>Tipologia</dt><dd>{selected.rooms}</dd></div><div><dt>Garagem</dt><dd>{selected.parking}</dd></div><div><dt>Terminação selecionada</dt><dd>{String(selectedEnding).padStart(2, '0')}</dd></div><div><dt>Torre selecionada</dt><dd>{selectedTower === 'norte' ? 'Norte' : 'Sul'}</dd></div></dl><div className="erm19-endingPanel"><span>ESCOLHA UMA TERMINAÇÃO DE REFERÊNCIA</span><div role="group" aria-label="Selecionar terminação para visualizar sua tipologia">{Array.from({ length: 8 }, (_, i) => i + 1).map((end) => <button key={end} type="button" className={selectedEnding === end ? 'isActive' : ''} aria-pressed={selectedEnding === end} onClick={() => { setSelectedEnding(end); setSelectedType(endingToType[end]); setIs3d(false); }}>{String(end).padStart(2, '0')}</button>)}</div><small>Seleção de tipologia, não de unidade ou disponibilidade. Dados por torre sujeitos a validação.</small></div><a className="erm19-outline" href={official} target="_blank" rel="noopener noreferrer">Consultar empreendimento oficial <span aria-hidden="true">↗</span></a><small className="erm19-legal">Correspondência entre torre, posição, planta e unidade sujeita à confirmação da Rocha. Sem consulta de estoque ou preços nesta versão.</small></aside>
        </div>
      </section>

      <section className="erm19-section erm19-master" id="implantacao">
        <div className="erm19-heading"><div><span className="erm19-eyebrow">02 · CONHEÇA CADA DETALHE</span><h2>Mais espaços para <em>viver seus momentos.</em></h2><p>Explore os 33 pontos documentados no material do empreendimento. A posição exata de cada um será aplicada após a validação da implantação original.</p></div><span className="erm19-sectionIndex">02 — 04</span></div>
        <div className="erm19-masterGrid">
          <div className="erm19-masterScene"><div className="erm19-masterBlueprint"><span className="erm19-blueprintKicker">IMPLANTAÇÃO INTERATIVA</span><div className="erm19-masterIcon" aria-hidden="true"><span>R</span></div><strong>33 pontos.<br /><em>Uma experiência completa.</em></strong><p>Mapa de implantação original e coordenadas dos pontos em preparação para homologação.</p><div className="erm19-planGhost" aria-hidden="true"><span /><span /><span /></div><span className="erm19-mapFlag">MAPA ESQUEMÁTICO NÃO EXIBIDO PARA EVITAR POSIÇÕES INCORRETAS</span></div>
            <div className="erm19-selectedFeature"><span className="erm19-featureNumber">{String(feature.number).padStart(2, '0')}</span><div><span className="erm19-eyebrow">PONTO SELECIONADO</span><h3>{feature.name}</h3><p>{feature.image ? 'Há imagem ilustrativa relacionada na galeria oficial.' : 'Ponto identificado no book. Imagem e localização visual aguardam validação.'}</p></div></div>
            {feature.image && <div className="erm19-featurePhoto"><Picture id={feature.image} alt={`Imagem ilustrativa relacionada a ${feature.name}`} /><span>REFERÊNCIA VISUAL · IMAGEM ILUSTRATIVA</span></div>}
          </div>
          <div className="erm19-facilities"><div className="erm19-facilitiesHeader"><strong>Explore os ambientes</strong><span>{visibleFacilities.length} pontos</span></div><div className="erm19-filter" role="group" aria-label="Filtrar pontos de implantação">{(Object.keys(filterNames) as Filter[]).map((f) => <button key={f} type="button" className={filter === f ? 'isActive' : ''} aria-pressed={filter === f} onClick={() => { setFilter(f); const match = facilities.find((item) => f === 'todos' || item.category === f); if (match) setFacilityNumber(match.number); }}>{filterNames[f]}</button>)}</div><div className="erm19-facilityList">{visibleFacilities.map((item) => <button key={item.number} className={facilityNumber === item.number ? 'isActive' : ''} aria-pressed={facilityNumber === item.number} type="button" onClick={() => setFacilityNumber(item.number)}><span>{String(item.number).padStart(2, '0')}</span><strong>{item.name}</strong><span aria-hidden="true">↗</span></button>)}</div><span className="erm19-facilitiesFoot">LISTA OFICIAL DO BOOK · POSICIONAMENTO VISUAL EM REVISÃO</span></div>
        </div>
      </section>

      <section className="erm19-gallerySection" id="galeria"><div className="erm19-section erm19-galleryInner"><div className="erm19-heading erm19-headingLight"><div><span className="erm19-eyebrow">03 · VISUALIZE SEU FUTURO</span><h2>Encontre seu lugar <em>em cada detalhe.</em></h2><p>Perspectivas ilustrativas originalmente publicadas pela Rocha Empreendimentos.</p></div><span className="erm19-sectionIndex">03 — 04</span></div><div className="erm19-galleryStage"><button type="button" className="erm19-photoButton" onClick={() => setLightbox(true)} aria-label={`Ampliar imagem: ${activeGallery.title}`}><Picture id={activeGallery.id} alt={`${activeGallery.title} — Easy Rota do Mar, imagem ilustrativa`} /><span className="erm19-photoExpand">AMPLIAR ↗</span></button><div className="erm19-galleryOverlay"><div><span>{activeGallery.category.toUpperCase()}</span><h3>{activeGallery.title}</h3><small>IMAGEM MERAMENTE ILUSTRATIVA</small></div><div className="erm19-galleryControls"><button type="button" onClick={() => changeGallery(-1)} aria-label="Foto anterior">←</button><span>{String(galleryIndex + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}</span><button type="button" onClick={() => changeGallery(1)} aria-label="Próxima foto">→</button></div></div></div><div className="erm19-thumbs" aria-label="Escolher imagem da galeria">{gallery.map((item, i) => <button key={item.id} className={galleryIndex === i ? 'isActive' : ''} type="button" aria-pressed={galleryIndex === i} onClick={() => setGalleryIndex(i)}><Picture id={item.id} alt={`Miniatura: ${item.title}`} /><span>{item.title}</span></button>)}</div></div></section>

      <section className="erm19-section erm19-location" id="localizacao"><div className="erm19-heading"><div><span className="erm19-eyebrow">04 · ONDE TUDO SE ENCONTRA</span><h2>Na Serraria, perto <em>do que importa.</em></h2><p>Estrada Gerson Lopes, s/n — Serraria, Maceió/AL.</p></div><span className="erm19-sectionIndex">04 — 04</span></div><div className="erm19-locationGrid"><div className="erm19-locationVisual"><div className="erm19-locationCircle"><span>AL</span><strong>MACEIÓ</strong><small>SERRARIA</small></div><span className="erm19-locationCorner">LOCALIZAÇÃO DO EMPREENDIMENTO</span></div><div className="erm19-locationText"><span className="erm19-eyebrow">UM NOVO TRAJETO PARA O SEU DIA A DIA</span><h3>Entre a cidade <em>e novas possibilidades.</em></h3><p>O Easy Rota do Mar conecta a rotina da Serraria à proposta de uma vida prática, com espaços de convivência, comodidades e bem-estar.</p><p className="erm19-locationDisclaimer">O acesso direto à Rota do Mar descrito no material comercial é futuro e depende de confirmação; não é indicado aqui como concluído.</p><a className="erm19-primary" href={official} target="_blank" rel="noopener noreferrer">Conhecer o site oficial <span aria-hidden="true">↗</span></a></div></div></section>

      <footer className="erm19-footer"><div><img src="/rocha-logo-vivaalem.png" alt="Rocha Empreendimentos" /><p>Viva além do comum.</p></div><div><strong>Uma nova maneira de apresentar empreendimentos.</strong><span>PROTÓTIPO R19 · AMBIENTE DE HOMOLOGAÇÃO</span></div><a href="#inicio">Voltar ao topo ↑</a></footer>
      <div className="erm19-reviewBanner" role="note"><span>AMBIENTE DE HOMOLOGAÇÃO · R19</span><span>Sem consulta de disponibilidade, sem cadastro de leads e sem simulações financeiras.</span></div>

      {lightbox && <div className="erm19-lightbox" role="dialog" aria-modal="true" aria-label={`Imagem ampliada: ${activeGallery.title}`}><button type="button" className="erm19-lightboxClose" aria-label="Fechar imagem" onClick={() => setLightbox(false)}>×</button><button type="button" className="erm19-lightboxArrow" onClick={() => changeGallery(-1)} aria-label="Imagem anterior">←</button><div className="erm19-lightboxCenter"><Picture id={activeGallery.id} alt={`${activeGallery.title} — imagem ilustrativa`} /><span>{activeGallery.title} · IMAGEM ILUSTRATIVA · {galleryIndex + 1}/{gallery.length}</span></div><button type="button" className="erm19-lightboxArrow" onClick={() => changeGallery(1)} aria-label="Próxima imagem">→</button></div>}
    </main>
  );
}
