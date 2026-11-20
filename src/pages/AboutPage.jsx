import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from '../components/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const TEAM = [
  {
    name: 'Aman Mishra',
    role: 'SENIOR FULL STACK DEVELOPER & AI/ML ENGINEER',
    initials: 'AM',
  },
  {
    name: 'Abhishek',
    role: 'SENIOR VIDEO EDITOR & DESIGNER',
    initials: 'AB',
  },
];

const MOODBOARD = [
  '/assets/images/1a.jpg',
  '/assets/images/2a.jpg',
  '/assets/images/3a.jpg',
  '/assets/images/4a.jpg',
  '/assets/images/5a.jpg',
];

const RULES = [
  {
    num: 'THE OFFICE RULES 01',
    title: 'THE BRIEF IS NOT SET IN STONE',
    desc: 'A brief is a starting point, not a set of commandments. We’ll challenge it if we think there’s a better way to get where we need to go.',
  },
  {
    num: 'THE OFFICE RULES 02',
    title: 'GOOD IDEAS NEED SPACE',
    desc: 'We don’t believe in rushing to the first solution that kind of works. Give an idea enough room to breathe, and it might just be the one.',
  },
  {
    num: 'THE OFFICE RULES 03',
    title: 'PRETTY IS NOT A STRATEGY',
    desc: 'We love beautiful things. But looking good is only part of the job. First, we search for meaning. Everything we put out there needs to have a reason to be.',
  },
  {
    num: 'THE OFFICE RULES 04',
    title: 'IF IT CAN BE SIMPLE, SIMPLIFY',
    desc: 'Complexity for complexity’s sake is not cool, actually. And people’s attention span is at an ATL. If your brand can say more with less, we’ll make it happen.',
  },
];

const CAPABILITIES = [
  'Brand Strategy',
  'Brand Identity',
  'Visual Identity',
  'Logo Design',
  'Brand Guidelines',
  'Art Direction',
  'Illustration',
  'Iconography',
  'Motion Design',
  '2D Animation',
  'Packaging Design',
  'Web Design',
  'Landing Pages',
  'Key Visuals',
  'Social Media Design',
  'Digital Ads',
  'OOH',
  'Editorial Design',
  'Pitch Decks',
  'Catalogues',
  'Menus',
  'Posters',
  'Signage',
  'Merchandise',
  'Brand Collateral',
];

export function AboutPage({ onOpenContact }) {
  const rootRef = useRef(null);
  const moodTrackRef = useRef(null);

  useEffect(() => {
    const scroller = document.querySelector('.page');
    const ctx = gsap.context(() => {
      gsap.from('.about-hero-line', {
        yPercent: 110,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power4.out',
      });
      gsap.from('.about-hero-pill', {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.25,
        ease: 'back.out(2)',
      });
      if (moodTrackRef.current) {
        gsap.to(moodTrackRef.current, {
          xPercent: -50,
          duration: 24,
          repeat: -1,
          ease: 'none',
        });
      }
      gsap.utils.toArray('.office-rule-card').forEach((card, i) => {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.65,
          delay: (i % 2) * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            scroller,
            start: 'top 86%',
            once: true,
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="about-page">
      {/* Hero */}
      <section className="about-page-hero">
        <div className="about-hero-title-wrap">
          <h1 className="about-page-h1">
            <span className="hero-line-mask">
              <span className="about-hero-line" style={{ display: 'inline-block' }}>SMALL STUDIO,</span>
            </span>
            <span className="hero-line-mask">
              <span className="about-hero-line" style={{ display: 'inline-block' }}>BIG BRAND ENERGY</span>
            </span>
          </h1>
          <div className="hero-pill about-hero-pill about-h-pill-1">design studio</div>
          <div className="hero-pill about-hero-pill about-h-pill-2">Independent</div>
        </div>

        <div className="about-hero-grid">
          <img src="/assets/images/about-hero.svg" alt="Bogdan and Diana illustrated" className="about-hero-svg" />
          <p className="about-hero-intro">
            Founded in Bucharest by Bogdan and Diana Apalaghiei, Two26 brings together years of experience across
            advertising, branding and digital.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="about-story-section">
        <div className="about-story-block">
          <div className="section-eyebrow">HOW WE STARTED</div>
          <h2 className="about-story-h2">Two ’90s kids, one shared itch to make better brands.</h2>
          <p className="about-story-p">
            After years working for others, we changed course in early 2024 and decided to put all that experience into
            a dream of our own. What started with some recommendations and a few familiar faces quickly grew into
            something of its own. A studio where we could question the brief, really look into the details and make the
            kind of work that makes us smile.
          </p>
        </div>

        <div className="about-story-illustrations">
          <img src="/assets/images/illustration_5.svg" alt="" aria-hidden="true" />
          <img src="/assets/images/chair.svg" alt="" aria-hidden="true" />
        </div>

        <div className="about-story-block">
          <div className="section-eyebrow">NOW WE’RE HERE</div>
          <h2 className="about-story-h2">Less size, more scope</h2>
          <p className="about-story-p">
            We have grown, but not into a maze of departments. Instead, Two26 is a three-person core team, supported by
            top notch collaborators whenever a project demands it. It means we can stay involved, move quickly and
            build the right team around each situation. We do not chase work for the sake of filling a portfolio. We like
            projects with a real challenge and people who care about getting it right.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="about-team-section">
        <div className="section-eyebrow" style={{ textAlign: 'center' }}>THE TEAM</div>
        <h2 className="works-heading" style={{ marginBottom: 48 }}>THIS IS PRETTY MUCH EVERYONE</h2>
        <div className="team-grid team-grid-two">
          {TEAM.map((m) => (
            <div key={m.name} className="team-card">
              <div className="team-monogram-card">
                <span className="team-monogram-text">{m.initials}</span>
              </div>
              <h3 className="team-name">{m.name}</h3>
              <div className="team-role">{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Moodboard */}
      <section className="about-moodboard-section">
        <div className="section-eyebrow" style={{ textAlign: 'center' }}>OFF THE CLOCK — BEHIND THE WORK</div>
        <div className="showcase-marquee-section" style={{ paddingBottom: 40 }}>
          <div ref={moodTrackRef} className="showcase-track">
            {[...MOODBOARD, ...MOODBOARD].map((src, i) => (
              <div key={i} className="showcase-card">
                <img src={src} alt={`Behind the work ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Rules */}
      <section className="about-rules-section">
        <div className="rules-grid">
          {RULES.map((r) => (
            <div key={r.num} className="office-rule-card">
              <div className="rule-num">{r.num}</div>
              <h3 className="rule-title">{r.title}</h3>
              <p className="rule-desc">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="about-capabilities-section">
        <div className="section-eyebrow" style={{ textAlign: 'center' }}>CAPABILITIES</div>
        <h2 className="works-heading" style={{ marginBottom: 40 }}>WE’VE GOT RANGE</h2>
        <div className="capabilities-cloud">
          {CAPABILITIES.map((c) => (
            <span key={c} className="capability-pill">{c}</span>
          ))}
        </div>
        <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center' }}>
          <MagneticButton variant="orange" onClick={onOpenContact}>
            Let&apos;s Talk
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}
