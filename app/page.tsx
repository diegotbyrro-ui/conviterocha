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
            <h2>PremiaÃ§Ã£o do trimestre</h2>
            <p>
              Um fim de tarde para celebrar resultados, reconhecer conquistas,
              fortalecer parcerias e brindar tudo o que construÃ­mos juntos.
            </p>
          </section>

          <section className="mobileInviteCard">
            <div className="mobileInviteIcon">â†—</div>
            <span className="mobileInviteEyebrow">CONFIRME SUA PRESENÃ‡A</span>
            <h3>Digite seu cÃ³digo de convite</h3>
            <p>
              Insira o cÃ³digo que vocÃª recebeu para confirmar sua presenÃ§a na
              Tardezinha com a Rocha.
            </p>

            <InviteRegistrationForm variant="mobile" />
          </section>

          <section className="mobileEventGrid" aria-label="InformaÃ§Ãµes do evento">
            <article className="mobileEventCard">
              <span>DATA</span>
              <strong>SEXTA-FEIRA</strong>
              <small>09/10/2026</small>
            </article>

            <article className="mobileEventCard">
              <span>HORÃRIO</span>
              <strong>17h</strong>
              <small>A partir das 17h</small>
            </article>

            <article className="mobileEventCard mobileEventCardWide">
              <span>LOCAL</span>
              <strong>Avenida Fernandes Lima, 2229</strong>
              <small>Farol, MaceiÃ³ - AL â€¢ CEP: 57.055-000</small>
            </article>
          </section>

          <section className="mobileHighlights" aria-label="Destaques da Tardezinha">
            <article>
              <b>01</b>
              <strong>ConexÃµes verdadeiras</strong>
              <small>Pessoas que constroem grandes histÃ³rias juntas.</small>
            </article>

            <article>
              <b>02</b>
              <strong>PremiaÃ§Ã£o do trimestre</strong>
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
              <small>MÃºsica, drinks e celebraÃ§Ã£o do comeÃ§o ao fim.</small>
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
              Mais que empreendimentos, construímos pessoas, parcerias e novos amanhãs.
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
        <div className="formOverlay formOverlayDesktop">
          <InviteRegistrationForm variant="desktop" />
        </div>
      </section>
    </main>
  );
}
