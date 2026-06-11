import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const universityLogos = [
  { src: '/assets/ponder-hero-marquee/university_1.1093bb61.png', alt: 'University of Cambridge', height: 30 },
  { src: '/assets/ponder-hero-marquee/university_2.06f66a2c.png', alt: 'MIT', height: 40 },
  { src: '/assets/ponder-hero-marquee/university_3.8a3e8950.png', alt: 'Stanford University', height: 42 },
  { src: '/assets/ponder-hero-marquee/university_4.3d8e540d.png', alt: 'Harvard University', height: 35 },
  { src: '/assets/ponder-hero-marquee/university_5.be017aa2.png', alt: 'University of Oxford', height: 42 },
  { src: '/assets/ponder-hero-marquee/university_6.84700b54.png', alt: 'University of Zurich', height: 64 },
  { src: '/assets/ponder-hero-marquee/university_7.791111e7.png', alt: 'Tsinghua University', height: 92 },
  { src: '/assets/ponder-hero-marquee/university_8.d484effc.png', alt: 'National University of Singapore', height: 61 },
  { src: '/assets/ponder-hero-marquee/university_9.ad54b625.png', alt: 'University of California, Berkeley', height: 87 },
  { src: '/assets/ponder-hero-marquee/university_10.d747aa52.png', alt: 'University of Tokyo', height: 106 },
  { src: '/assets/ponder-hero-marquee/university_11.0dbc1581.png', alt: 'Seoul National University', height: 107 },
];

const insightCards = [
  {
    title: 'Key Contributions',
    note: 'Eliminates recurrence via self-attention',
    icon: '✦',
  },
  {
    title: 'Limitations',
    note: 'Quadratic memory at long sequences',
    icon: '!',
  },
  {
    title: 'Applications',
    note: 'Translation, summarisation, parsing',
    icon: '▦',
  },
  {
    title: 'Future Directions',
    note: 'Extending to vision & audio domains',
    icon: '→',
  },
  {
    title: 'Methodology',
    note: 'BLEU evaluation on WMT 2014 EN–DE',
    icon: '▥',
  },
];

const agentSteps = [
  ['Thought', ''],
  ['View directory', 'root'],
  ['Read file', 'neural-nets-survey.pdf'],
  ['Task plan', '4 completed'],
  ['Edit board', 'Research Canvas'],
];

const question = 'What are the key insights from this paper?';
const DEMO_DESIGN_WIDTH = 672;

type DemoStage = 'chat' | 'canvas' | 'full';

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="menu-icon">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="discord-icon">
      <path d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.08.08 0 0 0-.08.04c-.21.38-.44.86-.61 1.25a18.3 18.3 0 0 0-5.48 0 12.6 12.6 0 0 0-.62-1.25.08.08 0 0 0-.08-.04A19.7 19.7 0 0 0 3.68 4.37a.07.07 0 0 0-.03.03C.53 9.05-.32 13.58.1 18.06c0 .02.02.04.03.06a19.9 19.9 0 0 0 5.99 3.03.08.08 0 0 0 .09-.03c.46-.63.87-1.3 1.23-2a.08.08 0 0 0-.04-.1 13.1 13.1 0 0 1-1.88-.9.08.08 0 0 1 0-.13l.37-.29a.07.07 0 0 1 .08 0c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 0 1 .08 0c.12.1.25.2.37.3a.08.08 0 0 1 0 .12c-.6.35-1.23.65-1.87.9a.08.08 0 0 0-.04.1c.36.7.77 1.36 1.22 2a.08.08 0 0 0 .09.03 19.8 19.8 0 0 0 6-3.03.08.08 0 0 0 .03-.05c.5-5.18-.84-9.68-3.55-13.66a.06.06 0 0 0-.03-.04ZM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.96 2.42-2.16 2.42Zm7.98 0c-1.19 0-2.16-1.08-2.16-2.42 0-1.33.95-2.42 2.16-2.42s2.18 1.1 2.16 2.42c0 1.34-.95 2.42-2.16 2.42Z" />
    </svg>
  );
}

function PonderLogo() {
  return (
    <a className="brand" href="#top" aria-label="Ponder home">
      <img className="brand-logo" src="/assets/ponder-brand-logo.png" alt="Ponder" width="100" height="24" />
    </a>
  );
}

function PonderNav() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const onScroll = () => {
      el.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="nav-inner">
        <PonderLogo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="https://ponder.ing/dashboard">Dashboard</a>
          <a href="https://ponder.ing/pricing">Pricing</a>
          <a href="https://ponder.ing/blog">Blog</a>
          <a href="https://ponder.ing/features">Features</a>
        </nav>
        <div className="nav-actions">
          <a className="icon-link" href="https://discord.gg/dVDUHf4Cqj" target="_blank" rel="noreferrer" aria-label="Join Ponder on Discord">
            <DiscordIcon />
          </a>
          <a className="signin" href="#login">Sign in</a>
          <a className="nav-cta" href="#signup">Start for free</a>
        </div>
        <details className="mobile-menu">
          <summary aria-label="Open menu">
            <MenuIcon />
          </summary>
          <div className="mobile-panel">
            <a href="https://ponder.ing/dashboard">Dashboard</a>
            <a href="https://ponder.ing/pricing">Pricing</a>
            <a href="https://ponder.ing/blog">Blog</a>
            <a href="https://ponder.ing/features">Features</a>
            <a href="https://discord.gg/dVDUHf4Cqj" target="_blank" rel="noreferrer">Join Discord</a>
            <a href="#login">Sign in</a>
            <a className="mobile-cta" href="#signup">Start for free</a>
          </div>
        </details>
      </div>
    </header>
  );
}

function useHeroProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      node.style.setProperty('--hero-progress', progress.toFixed(4));
    };
    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  return ref;
}

function FloatingThoughts() {
  const thoughts = [
    ['Compare sources', '12%', '26%', '0s'],
    ['Turn note → insight', '74%', '22%', '1.4s'],
    ['Find weak claims', '8%', '66%', '2.7s'],
    ['Map the argument', '78%', '70%', '4.1s'],
  ];

  return (
    <div className="floating-thoughts" aria-hidden="true">
      {thoughts.map(([label, left, top, delay]) => (
        <span key={label} style={{ left, top, animationDelay: delay }}>
          {label}
        </span>
      ))}
    </div>
  );
}

function LogoMarquee() {
  const logos = [...universityLogos, ...universityLogos];
  const [hoveredLogo, setHoveredLogo] = useState<number | null>(null);

  return (
    <div className="logo-trust" aria-label="Trusted by researchers, analysts, creators, and deep thinkers around the world">
      <p>Trusted by researchers, analysts, creators, and deep thinkers around the world</p>
      <div className="logo-mask">
        <div className={hoveredLogo === null ? 'logo-track' : 'logo-track is-paused'}>
          {logos.map((logo, index) => (
            <img
              key={`${logo.src}-${index}`}
              src={logo.src}
              alt={index < universityLogos.length ? logo.alt : ''}
              aria-hidden={index >= universityLogos.length ? true : undefined}
              className={hoveredLogo === index ? 'is-hovered' : undefined}
              loading={index < universityLogos.length ? 'eager' : 'lazy'}
              decoding="async"
              onPointerEnter={() => setHoveredLogo(index)}
              onPointerLeave={() => setHoveredLogo((current) => (current === index ? null : current))}
              style={{
                height: `clamp(${Math.max(20, Math.round(logo.height * 0.55))}px, ${(logo.height / 6.2).toFixed(2)}vw, ${logo.height}px)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatScreen({ fileVisible, typed }: { fileVisible: boolean; typed: string }) {
  return (
    <div className="chat-screen">
      <p className="chat-greeting">Hi Alex. Ready to Dive Into Knowledge?</p>
      <div className="prompt-card">
        <div className="file-row">
          <span className={fileVisible ? 'file-chip is-visible' : 'file-chip'}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z" /><path d="M14 2v5h5" /></svg>
            neural-nets-survey.pdf
            <b>×</b>
          </span>
        </div>
        <div className="typed-line" aria-label={typed}>
          {typed}
          {typed.length > 0 && typed.length < question.length && <span className="caret" />}
        </div>
        <div className="prompt-footer">
          <div className="prompt-tools">
            <button type="button">+</button>
            <button type="button">Playground</button>
          </div>
          <div className="prompt-send">
            <span>Agent</span>
            <i aria-hidden="true" />
            <button type="button" aria-label="Send question">
              <ArrowIcon />
            </button>
          </div>
        </div>
      </div>
      <div className="prompt-chips" aria-hidden="true">
        <span>Analyze files</span>
        <span>Research a topic</span>
        <span>Create visuals</span>
        <span>Guided reading</span>
      </div>
    </div>
  );
}

function CanvasScreen({
  stage,
  cardsVisible,
  topicVisible,
  stepsVisible,
  showResponse,
}: {
  stage: DemoStage;
  cardsVisible: number;
  topicVisible: boolean;
  stepsVisible: number;
  showResponse: boolean;
}) {
  return (
    <div className={`canvas-screen ${stage === 'full' ? 'is-full' : ''}`}>
      <div className="app-topbar">
        <div>
          <button type="button">Resources</button>
          <button type="button" className="active">Editor</button>
          <button type="button">Agent</button>
        </div>
        <strong>Research Canvas</strong>
        <span>⌘K</span>
      </div>
      <div className="app-workspace">
        <aside className="tool-rail" aria-hidden="true">
          <span>▦</span>
          <span>◰</span>
          <span>✎</span>
        </aside>
        <section className="mind-map" aria-label="Research mind map">
          <div className={topicVisible ? 'topic-card is-visible' : 'topic-card'}>
            <strong>Topic</strong>
            <span>Neural Networks Survey</span>
          </div>
          <div className="connector" aria-hidden="true">
            <span className="stem" />
            {insightCards.map((card, index) => (
              <span key={card.title} className={`branch branch-${index + 1} ${index < cardsVisible ? 'is-visible' : ''}`} />
            ))}
          </div>
          <div className="insight-list">
            {insightCards.map((card, index) => (
              <article key={card.title} className={index < cardsVisible ? 'insight-card is-visible' : 'insight-card'}>
                <div>
                  <span>{card.icon}</span>
                  <strong>{card.title}</strong>
                </div>
                <p>{card.note}</p>
                <i style={{ width: `${92 - index * 7}%` }} />
              </article>
            ))}
          </div>
        </section>
        <aside className="agent-panel" aria-label="AI analysis panel">
          <div className="agent-question">{question}</div>
          <div className="agent-stream">
            {agentSteps.map(([label, note], index) => (
              <div key={label} className={index < stepsVisible ? 'agent-step is-visible' : 'agent-step'}>
                <b>✓</b>
                <span>{label}</span>
                {note && <em>{note}</em>}
              </div>
            ))}
            <div className={showResponse ? 'agent-response is-visible' : 'agent-response'}>
              <strong>Here's what I found:</strong>
              <p>• Self-attention reduces path length to O(1)</p>
              <i />
              <p>• SOTA on EN–DE & EN–FR translation</p>
              <i className="short" />
              <div>✦ Research Canvas — visualize into graphics</div>
            </div>
          </div>
          <div className="agent-input">Tell Ponder what to do or type @ to add files.<span /></div>
        </aside>
      </div>
    </div>
  );
}

function PonderDemoBlock() {
  const [stage, setStage] = useState<DemoStage>('chat');
  const [fileVisible, setFileVisible] = useState(false);
  const [typed, setTyped] = useState('');
  const [topicVisible, setTopicVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(0);
  const [stepsVisible, setStepsVisible] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const scale = entry.contentRect.width / DEMO_DESIGN_WIDTH;
      el.style.setProperty('--demo-content-scale', String(scale));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

    async function run() {
      while (!cancelled) {
        setStage('chat');
        setFileVisible(false);
        setTyped('');
        setTopicVisible(false);
        setCardsVisible(0);
        setStepsVisible(0);
        setShowResponse(false);
        await wait(520);
        if (cancelled) return;
        setFileVisible(true);
        await wait(620);
        for (let i = 1; i <= question.length; i += 1) {
          if (cancelled) return;
          setTyped(question.slice(0, i));
          await wait(30);
        }
        await wait(620);
        if (cancelled) return;
        setStage('canvas');
        await wait(380);
        setTopicVisible(true);
        await wait(460);
        for (let i = 1; i <= insightCards.length; i += 1) {
          if (cancelled) return;
          setCardsVisible(i);
          await wait(390);
        }
        await wait(540);
        if (cancelled) return;
        setStage('full');
        await wait(460);
        for (let i = 1; i <= agentSteps.length; i += 1) {
          if (cancelled) return;
          setStepsVisible(i);
          await wait(250);
        }
        await wait(360);
        setShowResponse(true);
        await wait(5200);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="demo-shell" ref={shellRef} role="img" aria-label="Animated Ponder product demo">
      <div className="browser-chrome" aria-hidden="true">
        <span className="traffic red" />
        <span className="traffic yellow" />
        <span className="traffic green" />
        <div className="address-bar">
          ponder.ing
        </div>
      </div>
      <div className="demo-viewport" aria-hidden="true">
        <div className="demo-stage">
          {stage === 'chat' ? (
            <ChatScreen fileVisible={fileVisible} typed={typed} />
          ) : (
            <CanvasScreen
              stage={stage}
              cardsVisible={cardsVisible}
              topicVisible={topicVisible}
              stepsVisible={stepsVisible}
              showResponse={showResponse}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function PonderHero() {
  const heroRef = useHeroProgress<HTMLElement>();

  return (
    <section id="top" ref={heroRef} className="hero-section">
      <div className="hero-sticky">
        <div className="warm-bg" aria-hidden="true" />
        <div className="paper-grain" aria-hidden="true" />
        <FloatingThoughts />
        <div className="orb orb-a" aria-hidden="true" />
        <div className="orb orb-b" aria-hidden="true" />

        <div className="hero-content">
          <div className="hero-copy">
            <h1>
              <span>Where Thinking</span>{' '}
              <span>Happens</span>
            </h1>
            <p className="hero-subtitle">
              Gather your materials, think alongside AI, and map your insights—all within a
              single, quiet canvas that turns fleeting thoughts into structured knowledge.
            </p>
            <div className="hero-actions">
              <a className="primary-cta" href="#signup">
                Start pondering
                <ArrowIcon />
              </a>
              <a className="secondary-cta" href="https://ponder.ing/blog/ponder-where-thinking-happens">Learn more</a>
            </div>
          </div>

          <div className="demo-wrap">
            <PonderDemoBlock />
          </div>

          <LogoMarquee />
        </div>
        <div className="bottom-fade" aria-hidden="true" />
      </div>
    </section>
  );
}

function App() {
  return (
    <main>
      <PonderNav />
      <PonderHero />
      <section id="features" className="continuation" aria-label="Ponder feature preview">
        <div>
          <p>Designed to stay out of the way</p>
          <h2>Research, reason, and reshape ideas without leaving the canvas.</h2>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
