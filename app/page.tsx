import InviteRegistrationForm from './InviteRegistrationForm';

const ROCHA_LOGO = '/rocha-logo-vivaalem.png';
const DESKTOP_BG = '/tardezinha-desktop-final-20261005.png';
const MOBILE_HERO = '/tardezinha-mobile-final-20261005.png';

type HighlightType =
  | 'connections'
  | 'award'
  | 'company'
  | 'music';

type HighlightIconProps = {
  type: HighlightType;
};

function HighlightIcon({ type }: HighlightIconProps) {
  if (type === 'award') {
    return (
      <span className="highlightIcon" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <path d="M22 12h20v9c0 10-4 17-10 20-6-3-10-10-10-20v-9Z" />
          <path d="M22 17H13v4c0 8 4 13 12 14" />
          <path d="M42 17h9v4c0 8-4 13-12 14" />
          <path d="M32 41v8" />
          <path d="M24 54h16" />
          <path d="M27 49h10" />
        </svg>
      </span>
    );
  }

  if (type === 'company') {
    return (
      <span className="highlightIcon" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="20" r="8" />
          <circle cx="15" cy="25" r="6" />
          <circle cx="49" cy="25" r="6" />
          <path d="M19 49v-5c0-8 5-13 13-13s13 5 13 13v5" />
          <path d="M5 49v-4c0-7 4-11 10-11 3 0 5 1 7 3" />
          <path d="M59 49v-4c0-7-4-11-10-11-3 0-5 1-7 3" />
        </svg>
      </span>
    );
  }

  if (type === 'music') {
    return (
      <span className="highlightIcon" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <path d="M25 45V17l27-5v28" />
          <ellipse cx="18" cy="46" rx="8" ry="6" />
          <ellipse cx="45" cy="41" rx="8" ry="6" />
          <path d="M25 25l27-5" />
        </svg>
      </span>
    );
  }

  return (
    <span className="highlightIcon" aria-hidden="true">
      <svg viewBox="0 0 64 64">
        <path d="M23 21l7 7-12 12-7-7a8 8 0 0 1 12-12Z" />
        <path d="M41 21l-7 7 12 12 7-7a8 8 0 0 0-12-12Z" />
        <path d="M25 35l7 7 7-7" />
        <path d="M16 15l-4-5" />
        <path d="M48 15l4-5" />
      </svg>
    </span>
  );
}

const highlights = [
  {
    type: 'connections' as HighlightType,
    title: 'Conexões verdadeiras',
    text: 'Pessoas que constroem grandes histórias juntas.'
  },
  {
    type: 'award' as HighlightType,
    title: 'Premiação do trimestre',
    text: 'Reconhecimento para celebrar resultados e conquistas.'
  },
  {
    type: 'company' as HighlightType,
    title: 'Boa companhia',
    text: 'Um ambiente leve para fortalecer parcerias.'
  },
  {
    type: 'music' as HighlightType,
    title: 'Música ao vivo',
    text: 'Música ao vivo, drinks e celebração do começo ao fim.'
  }
];

export default function HomePage() {
  return (
    <main className="tardezinhaPage">

      {/* MOBILE */}
      <section
        className="mobileExperience"
        aria-label="Tardezinha com a Rocha - mobile"
      >
        <div className="mobileHeroFrame">
          <img
            className="mobileHeroImage"
            src={MOBILE_HERO}
            alt="Tardezinha com a Rocha"
          />
        </div>

        <div className="mobileContent">

          <section className="mobileAwardCard">
            <span className="mobileAwardEyebrow">
              MOMENTO ESPECIAL
            </span>

            <h2>Premiação do trimestre</h2>

            <p>
              Um fim de tarde para celebrar resultados,
              reconhecer conquistas, fortalecer parcerias
              e brindar tudo o que construímos juntos.
            </p>
          </section>

          <section className="mobileInviteCard">
            <div className="mobileInviteIcon">↗</div>

            <span className="mobileInviteEyebrow">
              CONFIRME SUA PRESENÇA
            </span>

            <h3>Digite seu código de convite</h3>

            <p>
              Insira o código que você recebeu para confirmar
              sua presença na Tardezinha com a Rocha.
            </p>

            <InviteRegistrationForm variant="mobile" />
          </section>

          <section
            className="mobileEventGrid"
            aria-label="Informações do evento"
          >
            <article className="mobileEventCard">
              <span>DATA</span>
              <strong>SEXTA-FEIRA</strong>
              <small>09/10/2026</small>
            </article>

            <article className="mobileEventCard">
              <span>HORÁRIO</span>
              <strong>17h</strong>
              <small>A partir das 17h</small>
            </article>

            <article className="mobileEventCard mobileEventCardWide">
              <span>LOCAL</span>
              <strong>Avenida Fernandes Lima, 2229</strong>
              <small>
                Farol, Maceió - AL • CEP: 57.055-000
              </small>
            </article>
          </section>

          <section
            className="mobileHighlights"
            aria-label="Destaques do evento"
          >
            {highlights.map((item) => (
              <article
                key={item.type}
                className={item.type === 'award' ? 'isAward' : ''}
              >
                <HighlightIcon type={item.type} />

                <div className="highlightCopy">
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </div>
              </article>
            ))}
          </section>

          <footer className="mobileFooter">
            <img
              src={ROCHA_LOGO}
              alt="Rocha Empreendimentos"
              className="mobileFooterLogo"
            />

            <p>
              Mais que empreendimentos, construímos pessoas,
              parcerias e novos amanhãs.
            </p>
          </footer>

        </div>
      </section>

      {/* DESKTOP */}
      <section
        className="desktopExperience"
        aria-label="Tardezinha com a Rocha - desktop"
      >

        <div
          className="desktopScene"
          style={{
            backgroundImage:
              `linear-gradient(
                90deg,
                rgba(0,14,30,0.96) 0%,
                rgba(0,14,30,0.90) 22%,
                rgba(0,14,30,0.76) 40%,
                rgba(0,14,30,0.38) 58%,
                rgba(0,14,30,0.10) 100%
              ),
              url(${DESKTOP_BG})`
          }}
        />

        <div className="desktopWrap">

          <header className="desktopTopbar">
            <img
              src={ROCHA_LOGO}
              alt="Rocha Empreendimentos"
              className="desktopLogo"
            />

            <span className="desktopTopline">
              TARDEZINHA COM A ROCHA
            </span>
          </header>

          <div className="desktopHeroGrid">

            <img
              className="desktopTrophyArt"
              src="/trofeu-trimestre.png"
              alt=""
              aria-hidden="true"
            />

            <div className="desktopLeft">

              <span className="desktopEyebrow">
                CONVITE ESPECIAL
              </span>

              <h1 className="desktopTitle">
                TARDEZINHA
                <span>com a Rocha</span>
              </h1>

              <h2 className="desktopSubtitle">
                Boas conversas, grandes conexões
                <br />
                e novas histórias.
              </h2>

              <p className="desktopDescription">
                Um encontro especial para celebrar parcerias,
                brindar conquistas e seguir construindo
                o que vem pela frente.
              </p>

              <div className="desktopAwardPill">
                <HighlightIcon type="award" />

                <div>
                  <small>3º TRIMESTRE DE 2026</small>
                  <strong>PREMIAÇÃO DO TRIMESTRE</strong>
                </div>
              </div>

            </div>
          </div>

          <section className="desktopInviteCard">

            <div className="desktopInviteHead">
              <span>↗</span>
              <strong>
                DIGITE SEU CÓDIGO DE CONVITE
              </strong>
            </div>

            <p>
              Insira o código que você recebeu para confirmar
              sua presença na Tardezinha com a Rocha.
            </p>

            <div className="desktopInviteForm">
              <InviteRegistrationForm variant="desktop" />
            </div>

          </section>

          <section
            className="desktopInfoBar"
            aria-label="Informações do evento"
          >
            <article>
              <small>DATA</small>
              <strong>SEXTA-FEIRA</strong>
              <span>09/10/2026</span>
            </article>

            <article>
              <small>HORÁRIO</small>
              <strong>17h</strong>
              <span>A partir das 17h</span>
            </article>

            <article className="desktopInfoBarLocation">
              <small>LOCAL</small>
              <strong>
                Avenida Fernandes Lima, 2229
              </strong>
              <span>
                Farol, Maceió - AL • CEP: 57.055-000
              </span>
            </article>
          </section>

          <section className="desktopHighlights">

            {highlights.map((item) => (
              <article
                key={item.type}
                className={item.type === 'award' ? 'isAward' : ''}
              >
                {item.type === 'award' && (
                  <span className="awardCardTag">
                    DESTAQUE
                  </span>
                )}

                <HighlightIcon type={item.type} />

                <div className="highlightCopy">
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </div>

              </article>
            ))}

          </section>

        </div>
      </section>

    </main>
  );
}