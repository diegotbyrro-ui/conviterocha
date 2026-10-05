import InviteRegistrationForm from './InviteRegistrationForm';

const ROCHA_LOGO = '/rocha-logo-vivaalem.png';
const DESKTOP_BG = '/tardezinha-desktop-final-20261005.png';
const MOBILE_HERO = '/tardezinha-mobile-final-20261005.png';

const highlights = [
  {
    number: '01',
    title: 'Conexões verdadeiras',
    text: 'Pessoas que constroem grandes histórias juntas.'
  },
  {
    number: '02',
    title: 'Premiação do trimestre',
    text: 'Reconhecimento para celebrar resultados e conquistas.'
  },
  {
    number: '03',
    title: 'Boa companhia',
    text: 'Um ambiente leve para fortalecer parcerias.'
  },
  {
    number: '04',
    title: 'Pagodinho e boa energia',
    text: 'Música, drinks e celebração do começo ao fim.'
  }
];

export default function HomePage() {
  return (
    <main className="tardezinhaPage">
      {/* MOBILE */}
      <section className="mobileExperience" aria-label="Tardezinha com a Rocha - mobile">
        <div className="mobileHeroFrame">
          <img
            className="mobileHeroImage"
            src={MOBILE_HERO}
            alt="Tardezinha com a Rocha"
          />
        </div>

        <div className="mobileContent">
          <section className="mobileAwardCard">
            <span className="mobileAwardEyebrow">MOMENTO ESPECIAL</span>
            <h2>Premiação do trimestre</h2>
            <p>
              Um fim de tarde para celebrar resultados, reconhecer conquistas,
              fortalecer parcerias e brindar tudo o que construímos juntos.
            </p>
          </section>

          <section className="mobileInviteCard">
            <div className="mobileInviteIcon">↗</div>
            <span className="mobileInviteEyebrow">CONFIRME SUA PRESENÇA</span>
            <h3>Digite seu código de convite</h3>
            <p>
              Insira o código que você recebeu para confirmar sua presença na
              Tardezinha com a Rocha.
            </p>
            <InviteRegistrationForm variant="mobile" />
          </section>

          <section className="mobileEventGrid" aria-label="Informações do evento">
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
              <small>Farol, Maceió - AL • CEP: 57.055-000</small>
            </article>
          </section>

          <section className="mobileHighlights" aria-label="Destaques do evento">
            {highlights.map((item) => (
              <article key={item.number}>
                <b>{item.number}</b>
                <strong>{item.title}</strong>
                <small>{item.text}</small>
              </article>
            ))}
          </section>

          <footer className="mobileFooter">
            <img src={ROCHA_LOGO} alt="Rocha Empreendimentos" className="mobileFooterLogo" />
            <p>Mais que empreendimentos, construímos pessoas, parcerias e novos amanhãs.</p>
          </footer>
        </div>
      </section>

      {/* DESKTOP */}
      <section className="desktopExperience" aria-label="Tardezinha com a Rocha - desktop">
        <div
          className="desktopScene"
          style={{ backgroundImage: `linear-gradient(90deg, rgba(0,14,30,0.96) 0%, rgba(0,14,30,0.90) 22%, rgba(0,14,30,0.76) 40%, rgba(0,14,30,0.38) 58%, rgba(0,14,30,0.10) 100%), url(${DESKTOP_BG})` }}
        />

        <div className="desktopWrap">
          <header className="desktopTopbar">
            <img src={ROCHA_LOGO} alt="Rocha Empreendimentos" className="desktopLogo" />
            <span className="desktopTopline">TARDEZINHA COM A ROCHA</span>
          </header>

          <div className="desktopHeroGrid">
            <div className="desktopLeft">
              <span className="desktopEyebrow">CONVITE ESPECIAL</span>

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
                Um encontro especial para celebrar parcerias, brindar conquistas
                e seguir construindo o que vem pela frente.
              </p>

              <div className="desktopAwardPill">
                <span>★</span>
                <strong>PREMIAÇÃO DO TRIMESTRE</strong>
              </div>
            </div>
          </div>

          <section className="desktopInviteCard">
            <div className="desktopInviteHead">
              <span>↗</span>
              <strong>DIGITE SEU CÓDIGO DE CONVITE</strong>
            </div>
            <p>
              Insira o código que você recebeu para confirmar sua presença na
              Tardezinha com a Rocha.
            </p>

            <div className="desktopInviteForm">
              <InviteRegistrationForm variant="desktop" />
            </div>
          </section>

          <section className="desktopInfoBar" aria-label="Informações do evento">
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
              <strong>Avenida Fernandes Lima, 2229</strong>
              <span>Farol, Maceió - AL • CEP: 57.055-000</span>
            </article>
          </section>

          <section className="desktopHighlights">
            {highlights.map((item) => (
              <article key={item.number}>
                <b>{item.number}</b>
                <div>
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
