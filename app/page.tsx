import InviteRegistrationForm from './InviteRegistrationForm';

export default function HomePage() {
  return (
    <main className="dualLayoutPage">
      <section className="mobileExperience" aria-label="Tardezinha com a Rocha">
        <div className="mobileHeroFrame">
          <img
            className="mobileHeroImage"
            src="/tardezinha-mobile-hero.png"
            alt="Tardezinha com a Rocha"
          />
        </div>

        <div className="mobileContent">
          <section className="mobileAwardCard">
            <span className="mobileAwardEyebrow">MOMENTO ESPECIAL</span>
            <h2>PremiaÃƒÂ§ÃƒÂ£o do trimestre</h2>
            <p>
              Um fim de tarde para celebrar resultados, reconhecer conquistas,
              fortalecer parcerias e brindar tudo o que construÃƒÂ­mos juntos.
            </p>
          </section>

          <section className="mobileInviteCard">
            <div className="mobileInviteIcon">Ã¢â€ â€”</div>
            <span className="mobileInviteEyebrow">CONFIRME SUA PRESENÃƒâ€¡A</span>
            <h3>Digite seu cÃƒÂ³digo de convite</h3>
            <p>
              Insira o cÃƒÂ³digo que vocÃƒÂª recebeu para confirmar sua presenÃƒÂ§a na
              Tardezinha com a Rocha.
            </p>

            <InviteRegistrationForm variant="mobile" />
          </section>

          <section className="mobileEventGrid" aria-label="InformaÃƒÂ§ÃƒÂµes do evento">
            <article className="mobileEventCard">
              <span>DATA</span>
              <strong>SEXTA-FEIRA</strong>
              <small>09/10/2026</small>
            </article>

            <article className="mobileEventCard">
              <span>HORÃƒÂRIO</span>
              <strong>17h</strong>
              <small>A partir das 17h</small>
            </article>

            <article className="mobileEventCard mobileEventCardWide">
              <span>LOCAL</span>
              <strong>Avenida Fernandes Lima, 2229</strong>
              <small>Farol, MaceiÃƒÂ³ - AL Ã¢â‚¬Â¢ CEP: 57.055-000</small>
            </article>
          </section>

          <section className="mobileHighlights" aria-label="Destaques da Tardezinha">
            <article>
              <b>01</b>
              <strong>ConexÃƒÂµes verdadeiras</strong>
              <small>Pessoas que constroem grandes histÃƒÂ³rias juntas.</small>
            </article>

            <article>
              <b>02</b>
              <strong>PremiaÃƒÂ§ÃƒÂ£o do trimestre</strong>
              <small>Reconhecimento para celebrar resultados e conquistas.</small>
            </article>

            <article>
              <b>03</b>
              <strong>Boa companhia</strong>
              <small>Um ambiente leve para fortalecer parcerias.</small>
            </article>

            <article>
              <b>04</b>
              <strong>Pagodinho e boa energia</strong>
              <small>MÃƒÂºsica, drinks e celebraÃƒÂ§ÃƒÂ£o do comeÃƒÂ§o ao fim.</small>
            </article>
          </section>

          <footer className="mobileFooter">
            <img
              className="mobileFooterLogo"
              src="/rocha-logo-footer.png"
              alt="Rocha Empreendimentos"
            />

            <div className="mobileFooterDivider" />

            <p className="mobileFooterTagline">
              Mais que empreendimentos, construÃ­mos pessoas, parcerias e novos amanhÃ£s.
            </p>
          </footer>
        </div>
      </section>

      <section className="artboard artboardDesktop" aria-label="Tardezinha com a Rocha - desktop">
        <img
          className="artboardImage"
          src="/tardezinha-desktop-final-20261005.png"
          alt="Convite Tardezinha com a Rocha para desktop"
        />
                <div className="desktopAwardOverlay" aria-label="Premiação do trimestre">
          <div className="desktopAwardIcon" aria-hidden="true">
            <svg viewBox="0 0 64 64" role="img">
              <path d="M22 12h20v8c0 9-4 16-10 19-6-3-10-10-10-19v-8Z" />
              <path d="M22 17H13v4c0 8 4 13 12 14" />
              <path d="M42 17h9v4c0 8-4 13-12 14" />
              <path d="M32 39v9" />
              <path d="M23 53h18" />
              <path d="M27 48h10" />
            </svg>
          </div>

          <div className="desktopAwardCopy">
            <strong>PREMIAÇÃO DO<br />TRIMESTRE</strong>
            <span>Reconhecimento para celebrar<br />resultados e conquistas.</span>
          </div>
        </div>
        <div className="formOverlay formOverlayDesktop">
          <InviteRegistrationForm variant="desktop" />
        </div>
      </section>
    </main>
  );
}
