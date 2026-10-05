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

          <section className="mobileHighlights" aria-label="Destaques da Tardezinha">
            <article>
              <b>01</b>
              <strong>Conexões verdadeiras</strong>
              <small>Pessoas que constroem grandes histórias juntas.</small>
            </article>

            <article>
              <b>02</b>
              <strong>Premiação do trimestre</strong>
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
              <small>Música, drinks e celebração do começo ao fim.</small>
            </article>
          </section>

          <footer className="mobileFooter">
            <strong>ROCHA</strong>
            <span>empreendimentos</span>
            <p>Mais que empreendimentos, construímos pessoas, parcerias e novos amanhãs.</p>
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
