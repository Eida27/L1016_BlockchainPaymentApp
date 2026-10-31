export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header>
        <nav className="shell" aria-label="Main navigation">
          <a className="brand" href="#main-content" aria-label="GameTrust home">
            <span className="brand-mark" aria-hidden="true">
              G
            </span>
            GameTrust
          </a>
          <div className="nav-links">
            <a className="nav-how" href="#how-it-works">
              Our approach
            </a>
            <span className="badge">Local sandbox</span>
          </div>
        </nav>
      </header>
      <main className="shell" id="main-content" tabIndex={-1}>
        <section className="hero" aria-labelledby="hero-title">
          <div>
            <p className="eyebrow">Better together, in every game</p>
            <h1 id="hero-title">
              Good games.
              <br />
              <span>Great teammates.</span>
            </h1>
            <p className="hero-copy">
              A place to find gaming services, agree on the details, and team up
              with confidence. Built around clear expectations, from the first
              hello to the final GG.
            </p>
            <a className="cta" href="#how-it-works">
              How it works <span aria-hidden="true">↗</span>
            </a>
            <p className="disclosure">
              Local prototype. No real money. No wallet connection.
            </p>
          </div>
          <article className="preview" aria-label="Fictional service preview">
            <div className="preview-top">
              <span className="preview-label">A glimpse of the idea</span>
              <span className="badge">Fictional game</span>
            </div>
            <div className="arena-art" aria-hidden="true">
              <span className="arena-symbol">◇</span>
            </div>
            <h2>Sandbox Arena</h2>
            <p>Find your footing. Build your strategy.</p>
            <div className="preview-footer">
              <span>Fictional coaching example</span>
              <strong>Demo only</strong>
            </div>
          </article>
        </section>
        <section className="how" id="how-it-works" aria-labelledby="how-title">
          <div className="section-heading">
            <h2 id="how-title">A clearer way to team up.</h2>
            <p>
              The planned experience. Service workflows are not available yet.
            </p>
          </div>
          <div className="steps">
            <article>
              <span className="step-number" aria-hidden="true">
                01
              </span>
              <h3>Start with your goal</h3>
              <p>
                Describe the help you need and what a good result looks like.
              </p>
            </article>
            <article>
              <span className="step-number" aria-hidden="true">
                02
              </span>
              <h3>Find your teammate</h3>
              <p>
                Compare applications and choose the person who fits your goal.
              </p>
            </article>
            <article>
              <span className="step-number" aria-hidden="true">
                03
              </span>
              <h3>Agree before you begin</h3>
              <p>
                Set clear deliverables, timing, and evidence before work starts.
              </p>
            </article>
          </div>
        </section>
      </main>
      <footer>
        <div className="shell footer-inner">
          <span>GameTrust · A work in progress</span>
          <span>
            Fictional game content. Services and payments unavailable.
          </span>
        </div>
      </footer>
    </>
  );
}
