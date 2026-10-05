import InviteRegistrationForm from './InviteRegistrationForm';

export default function HomePage() {
  return (
    <main className="dualLayoutPage">
      <section className="artboard artboardMobile" aria-label="Tardezinha com a Rocha - celular">
        <img
          className="artboardImage"
          src="/tardezinha-mobile.png"
          alt="Convite Tardezinha com a Rocha para celular"
        />
        <div className="formOverlay formOverlayMobile">
          <InviteRegistrationForm variant="mobile" />
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



