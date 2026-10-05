import InviteRegistrationForm from './InviteRegistrationForm';

export default function HomePage() {
  return (
    <main className="dualLayoutPage">

      {/* ================= MOBILE ================= */}

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

            <span className="mobileInviteEyebrow">
              CONFIRME SUA PRESENÇA
            </span>

            <h3>Digite seu código de convite</h3>

            <p>
              Insira o código que você recebeu para confirmar sua presença
              na Tardezinha com a Rocha.
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
              <small>Farol, Maceió - AL • CEP: 57.055-000</small>
            </article>
          </section>

          <section
            className="mobileHighlights"
            aria-label="Destaques da Tardezinha"
          >
            <article>
              <b>01</b>
              <strong>Conexões verdadeiras</strong>
              <small>
                Pessoas que constroem grandes histórias juntas.
              </small>
            </article>

            <article>
              <b>02</b>
              <strong>Premiação do trimestre</strong>
              <small>
                Reconhecimento para celebrar resultados e conquistas.
              </small>
            </article>

            <article>
              <b>03</b>
              <strong>Boa companhia</strong>
              <small>
                Um ambiente leve para fortalecer parcerias.
              </small>
            </article>

            <article>
              <b>04</b>
              <strong>Pagodinho e boa energia</strong>
              <small>
                Música, drinks e celebração do começo ao fim.
              </small>
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
              Mais que empreendimentos, construímos pessoas,
              parcerias e novos amanhãs.
            </p>
          </footer>

        </div>
      </section>

      {/* ================= DESKTOP ================= */}

      <section
        className="desktopExperience"
        aria-label="Tardezinha com a Rocha"
      >
        <div className="desktopShell">

          <header className="desktopHeaderLive">
            <img
              className="desktopHeaderLogo"
              src="/rocha-logo-header.png"
              alt="Rocha Empreendimentos"
            />

            <div className="desktopHeaderMark">
              Tardezinha com a Rocha
            </div>
          </header>

          <div className="desktopHeroLive">

            <div className="desktopHeroCopyLive">

              <span className="desktopEyebrowLive">
                Convite especial
              </span>

              <h1 className="desktopTitleLive">
                Tardezinha
              </h1>

              <span className="desktopScriptLive">
                com a Rocha
              </span>

              <p className="desktopLeadLive">
                Boas conversas, grandes conexões
                <br />
                e <strong>novas histórias.</strong>
              </p>

              <p className="desktopBodyLive">
                Um encontro especial para celebrar parcerias,
                brindar conquistas e seguir construindo
                o que vem pela frente.
              </p>

              <div className="desktopAwardPill">
                <b>★</b>
                <span>Premiação do trimestre</span>
              </div>

            </div>

            <div
              className="desktopVisualLive"
              aria-hidden="true"
            />

          </div>

          <section className="desktopInviteLive">

            <div className="desktopInviteHead">
              <span className="desktopInviteLink">↗</span>

              <strong>
                Digite seu código de convite
              </strong>
            </div>

            <p>
              Insira o código que você recebeu para confirmar
              sua presença na Tardezinha com a Rocha.
            </p>

            <InviteRegistrationForm variant="desktop" />

          </section>

          <section
            className="desktopMetaLive"
            aria-label="Informações do evento"
          >

            <div className="desktopMetaItem">
              <div className="desktopMetaIcon">▣</div>

              <div className="desktopMetaText">
                <span>Data</span>
                <strong>SEXTA-FEIRA</strong>
                <small>09/10/2026</small>
              </div>
            </div>

            <div className="desktopMetaItem">
              <div className="desktopMetaIcon">◷</div>

              <div className="desktopMetaText">
                <span>A partir das</span>
                <strong>17h</strong>
                <small>Fim de tarde com a Rocha</small>
              </div>
            </div>

            <div className="desktopMetaItem">
              <div className="desktopMetaIcon">⌖</div>

              <div className="desktopMetaText">
                <span>Local</span>

                <strong>
                  Avenida Fernandes Lima, 2229
                </strong>

                <small>
                  Farol, Maceió - AL • CEP: 57.055-000
                </small>
              </div>
            </div>

          </section>

          <section
            className="desktopCardsLive"
            aria-label="Destaques da Tardezinha"
          >

            <article className="desktopFeatureCard">
              <div className="desktopFeatureIcon">01</div>

              <strong>
                Conexões verdadeiras
              </strong>

              <small>
                Pessoas que constroem grandes histórias juntas.
              </small>
            </article>

            <article className="desktopFeatureCard">
              <div className="desktopFeatureIcon">02</div>

              <strong>
                Boa companhia
              </strong>

              <small>
                Um ambiente leve para fortalecer parcerias.
              </small>
            </article>

            <article className="desktopFeatureCard isAward">
              <div className="desktopFeatureIcon">★</div>

              <strong>
                Premiação do trimestre
              </strong>

              <small>
                Reconhecimento para celebrar resultados
                e conquistas.
              </small>
            </article>

            <article className="desktopFeatureCard">
              <div className="desktopFeatureIcon">♫</div>

              <strong>
                Pagodinho e boa energia
              </strong>

              <small>
                Música, drinks e celebração do começo ao fim.
              </small>
            </article>

          </section>

          <footer className="desktopFooterLive">

            <img
              className="desktopFooterLogo"
              src="/rocha-logo-footer.png"
              alt="Rocha Empreendimentos"
            />

            <div className="desktopFooterDivider" />

            <p>
              Mais que empreendimentos, construímos pessoas,
              parcerias e novos amanhãs.
            </p>

            <span className="desktopFooterSignature">
              Tardezinha com a Rocha
            </span>

          </footer>

        </div>
      </section>

    </main>
  );
}