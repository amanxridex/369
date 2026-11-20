import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { SVGS } from './data/svgs';
import { PROJECTS, SHOWCASE_ITEMS, SERVICES, FAQS } from './data/content';
import { MagneticButton } from './components/MagneticButton';
import { ServiceIcon } from './components/ServiceIcon';
import { ProjectCard } from './components/ProjectCard';
import { TestimonialsDeck } from './components/TestimonialsDeck';
import { WorkPage } from './pages/WorkPage';
import { AboutPage } from './pages/AboutPage';
import { CaseStudyPage } from './pages/CaseStudyPage';
import { SplashLoader } from './components/SplashLoader';

gsap.registerPlugin(ScrollTrigger);

const ABOUT_TEXT =
  'We believe creative work needs focus. That’s why we keep our team tight and our involvement high, so every project gets our full attention. We build brands from scratch or make them better.';

export default function App() {
  const scrollerRef = useRef(null);
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const showcaseTrackRef = useRef(null);
  const servicesRef = useRef(null);
  const contactModalRef = useRef(null);
  const [splashDone, setSplashDone] = useState(false);

  const [route, setRoute] = useState(() => window.location.pathname || '/');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const aboutWords = ABOUT_TEXT.split(' ');
  const isHome = route === '/' || route === '';
  const isWork = route === '/work';
  const isAbout = route === '/about';
  const caseSlug = route.startsWith('/work/') ? route.replace('/work/', '').replace(/\/$/, '') : null;

  useEffect(() => {
    const onPop = () => {
      setRoute(window.location.pathname || '/');
      if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (to) => {
    setMobileMenuOpen(false);
    if (to === route) {
      if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
      return;
    }
    window.history.pushState({}, '', to);
    setRoute(to);
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
    setTimeout(() => ScrollTrigger.refresh(), 80);
  };

  // Lenis + GSAP ScrollTrigger choreography
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const lenis = new Lenis({
      wrapper: scroller,
      content: scroller.firstElementChild,
      duration: 1.15,
      smoothWheel: true,
    });

    ScrollTrigger.scrollerProxy(scroller, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return scroller.scrollTop;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onLenisScroll);

    const tickerFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // 1. Hero Entrance & Curved Marquee Draw (guaranteed completion once splash ends)
      if (isHome && splashDone) {
        gsap.fromTo(
          '.hero-h1-line',
          { yPercent: 110 },
          { yPercent: 0, duration: 0.75, stagger: 0.1, ease: 'power4.out', overwrite: 'auto' }
        );
        gsap.fromTo(
          '.hero-pill',
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.09, delay: 0.2, ease: 'back.out(2)', overwrite: 'auto' }
        );
      }

      // 2. Curved Marquee continuous textPath offset + immediate draw-in
      const textPaths = document.querySelectorAll('.curved-marquee-section textPath');
      if (textPaths.length) {
        gsap.to(textPaths, {
          attr: { startOffset: '-900' },
          duration: 18,
          repeat: -1,
          ease: 'none',
        });
      }
      const marqueePaths = document.querySelectorAll('.hero-marquee-bg, .hero-marquee-mask-path');
      marqueePaths.forEach((p) => {
        if (typeof p.getTotalLength !== 'function') return;
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: splashDone ? -len : 0 });
        if (splashDone) {
          gsap.to(p, {
            strokeDashoffset: 0,
            duration: 1.0,
            delay: 0.15,
            ease: 'power2.out',
          });
        }
      });

      // 3. About Pinned Word Color Scrub + Pills (CSS sticky track, zero pin-spacer DOM mutation)
      const words = gsap.utils.toArray('.about-word');
      const pills = gsap.utils.toArray('.about-pill');
      if (aboutRef.current && words.length) {
        gsap.set(pills, { scale: 0, opacity: 0 });
        const aboutTl = gsap.timeline({
          scrollTrigger: {
            trigger: aboutRef.current,
            scroller,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
          },
        });

        words.forEach((w, idx) => {
          const pos = (idx / words.length) * 1.0;
          aboutTl.to(w, { color: '#ff5400', duration: 0.08 }, pos);
          aboutTl.to(w, { color: '#000000', duration: 0.08 }, pos + 0.06);
        });

        if (pills[0]) aboutTl.to(pills[0], { scale: 1, opacity: 1, duration: 0.18, ease: 'back.out(2)' }, 0.2);
        if (pills[1]) aboutTl.to(pills[1], { scale: 1, opacity: 1, duration: 0.18, ease: 'back.out(2)' }, 0.48);
        if (pills[2]) aboutTl.to(pills[2], { scale: 1, opacity: 1, duration: 0.18, ease: 'back.out(2)' }, 0.75);
      }

      // 4. Showcase Continuous Horizontal Marquee
      if (showcaseTrackRef.current) {
        gsap.to(showcaseTrackRef.current, {
          xPercent: -50,
          duration: 28,
          repeat: -1,
          ease: 'none',
        });
      }

      // 5. Project Cards Clip-Mask Reveal
      gsap.utils.toArray('.project-card-clip-mask').forEach((card, i) => {
        gsap.from(card, {
          clipPath: 'inset(18% 0% 0% 0% round 12px)',
          opacity: 0,
          y: 40,
          duration: 0.75,
          delay: (i % 3) * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            scroller,
            start: 'top 86%',
            once: true,
          },
        });
      });

      // 6. Services Snake Path Draw on Scroll + Proximity Icon/Pill Pop (matching Script 17)
      const serviceDarkPaths = document.querySelectorAll(
        '.services-path-svg-dark path, .service-path-mobile-dark path'
      );
      serviceDarkPaths.forEach((path) => {
        if (typeof path.getTotalLength !== 'function') return;
        const len = path.getTotalLength();
        path.style.strokeLinecap = 'round';
        path.style.strokeLinejoin = 'round';
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      });

      const serviceNodes = gsap.utils.toArray('.service-node');
      serviceNodes.forEach((node) => {
        const iconWrap = node.querySelector('.service-icon-wrap');
        const pill = node.querySelector('.service-desc-pill');
        if (iconWrap) {
          gsap.set(iconWrap, { width: 0, scale: 0, opacity: 0, overflow: 'hidden' });
        }
        if (pill) {
          gsap.set(pill, { scale: 0, rotation: 0, opacity: 0 });
        }
      });

      if (servicesRef.current) {
        const servicesTl = gsap.timeline({
          scrollTrigger: {
            trigger: servicesRef.current,
            scroller,
            start: 'top 70%',
            end: 'bottom 70%',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        serviceDarkPaths.forEach((path) => {
          servicesTl.to(path, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0);
        });

        const total = serviceNodes.length;
        const iconTargetW = window.innerWidth <= 767 ? 44 : 68;
        serviceNodes.forEach((node, idx) => {
          const iconWrap = node.querySelector('.service-icon-wrap');
          const pill = node.querySelector('.service-desc-pill');
          const point = total > 1 ? idx / (total - 1) : 0;
          const startTime = Math.max(0, point - 0.04);

          if (iconWrap) {
            servicesTl.to(
              iconWrap,
              { width: iconTargetW, scale: 1, opacity: 1, duration: 0.14, ease: 'back.out(3.5)' },
              startTime
            );
          }
          if (pill) {
            servicesTl.to(
              pill,
              { scale: 1, rotation: -5, opacity: 1, duration: 0.14, ease: 'back.out(3.5)' },
              startTime + 0.02
            );
          }
        });
      }

      // 7. Footer Heading Reveal + Sponge Elastic Wordmark Stretch & Settle
      gsap.from('.footer-heading-line', {
        yPercent: 110,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.footer',
          scroller,
          start: 'top 80%',
          once: true,
        },
      });

      const footerLogo = document.querySelector('.footer-big-wordmark');
      if (footerLogo) {
        gsap.set(footerLogo, {
          scaleY: 0.15,
          transformOrigin: 'bottom center',
          willChange: 'transform',
        });

        let hasBounced = false;
        ScrollTrigger.create({
          trigger: '.footer',
          scroller,
          start: 'top bottom',
          end: 'bottom bottom',
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const vel = Math.abs(self.getVelocity() || 0);
            const velStretch = Math.min(vel / 1500, 0.25);

            if (self.progress >= 0.9) {
              if (!hasBounced) {
                hasBounced = true;
                gsap.killTweensOf(footerLogo);
                gsap.to(footerLogo, {
                  scaleY: 1,
                  duration: 1.4,
                  ease: 'elastic.out(1.2, 0.35)',
                  overwrite: 'auto',
                });
              }
            } else {
              hasBounced = false;
              const baseTarget =
                self.direction === 1
                  ? 0.15 + self.progress * 1.15 + velStretch
                  : 0.15 + self.progress * 0.95;
              const targetScaleY = Math.max(0.15, Math.min(baseTarget, 1.4));
              gsap.to(footerLogo, {
                scaleY: targetScaleY,
                duration: 0.1,
                ease: 'power1.out',
                overwrite: 'auto',
              });
            }
          },
          onLeave: () => {
            if (!hasBounced) {
              hasBounced = true;
              gsap.killTweensOf(footerLogo);
              gsap.to(footerLogo, {
                scaleY: 1,
                duration: 1.4,
                ease: 'elastic.out(1.2, 0.35)',
                overwrite: 'auto',
              });
            }
          },
          onLeaveBack: () => {
            hasBounced = false;
            gsap.killTweensOf(footerLogo);
            gsap.to(footerLogo, {
              scaleY: 0.15,
              duration: 0.25,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          },
        });
      }

      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(tickerFn);
      lenis.off('scroll', onLenisScroll);
      lenis.destroy();
    };
  }, [route, splashDone]);

  // Contact modal entrance animation
  useEffect(() => {
    if (!contactOpen || !contactModalRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(contactModalRef.current, { yPercent: 100, duration: 0.55, ease: 'power4.out' });
      gsap.from('.contact-char', {
        y: 60,
        rotation: 8,
        opacity: 0,
        duration: 0.65,
        stagger: 0.02,
        delay: 0.18,
        ease: 'back.out(1.6)',
      });
    }, contactModalRef);
    return () => ctx.revert();
  }, [contactOpen]);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el && scrollerRef.current) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Kinetic Splash Screen */}
      {!splashDone && (
        <SplashLoader
          onComplete={() => {
            setSplashDone(true);
            setTimeout(() => ScrollTrigger.refresh(), 50);
          }}
        />
      )}

      {/* Fixed Navbar (hidden on case study hero which has its own Back pill) */}
      {!caseSlug && (
        <header className="navbar">
          <div className="navbar-left">
            <a
              href="/work"
              className="navbar-link-btn"
              onClick={(e) => {
                e.preventDefault();
                navigate('/work');
              }}
            >
              <span>Work</span>
              <span className="stroke-fill" dangerouslySetInnerHTML={{ __html: SVGS.navbarStroke }} />
            </a>
            <a
              href="/about"
              className="navbar-link-btn"
              onClick={(e) => {
                e.preventDefault();
                navigate('/about');
              }}
            >
              <span>About us</span>
              <span className="stroke-fill" dangerouslySetInnerHTML={{ __html: SVGS.navbarStroke }} />
            </a>
          </div>

          <div className="navbar-center">
            <a
              href="/"
              className="brand-logo-link"
              aria-label="Two26 Studio Home"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              dangerouslySetInnerHTML={{ __html: SVGS.brandLogo }}
            />
          </div>

          <div className="navbar-right">
            <div className="navbar-hours">
              <div>Monday–Friday</div>
              <div>10:00–17:00</div>
            </div>
            <MagneticButton variant="dark" onClick={() => setContactOpen(true)}>
              Let&apos;s Talk
            </MagneticButton>
            <button
              type="button"
              className="mobile-menu-btn"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? (
                <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>✕</span>
              ) : (
                <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
                  <path d="M2 2H15C19.4183 2 22 5.13401 22 9C22 12.866 19.4183 16 15 16H2" stroke="#FF5400" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M2 9H14" stroke="#FF5400" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </header>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" onClick={() => setMobileMenuOpen(false)}>
          <a
            href="/work"
            className="mobile-drawer-pill"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/work');
            }}
          >
            Work
          </a>
          <a
            href="/about"
            className="mobile-drawer-pill"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/about');
            }}
          >
            About us
          </a>
          <div onClick={(e) => e.stopPropagation()}>
            <MagneticButton
              variant="dark"
              onClick={() => {
                setMobileMenuOpen(false);
                setContactOpen(true);
              }}
            >
              Let&apos;s Talk
            </MagneticButton>
          </div>
        </div>
      )}

      {/* Main Lenis Scroll Container */}
      <div ref={scrollerRef} className="page lenis">
        <main id="top">
          {isWork && <WorkPage onNavigate={navigate} />}
          {isAbout && <AboutPage onOpenContact={() => setContactOpen(true)} />}
          {caseSlug && <CaseStudyPage slug={caseSlug} onNavigate={navigate} />}

          {isHome && (
            <>
          {/* 1. Hero Section */}
          <section ref={heroRef} className="hero-section">
            <div className="hero-headline-wrap">
              <h1 className="hero-h1">
                <span className="hero-line-mask">
                  <span className="hero-h1-line" style={{ display: 'inline-block' }}>LOOKING</span>
                </span>
                <span className="hero-line-mask">
                  <span className="hero-h1-line" style={{ display: 'inline-block' }}>SUSPICIOUSLY GOOD</span>
                </span>
              </h1>
              <div className="hero-pill hero-pill-1">Independent studio</div>
              <div className="hero-pill hero-pill-2">Branding &amp; design</div>
              <div className="hero-pill hero-pill-3">No funny business</div>
            </div>

            <div className="hero-video-wrap">
              <video
                className="hero-video"
                src="/assets/videos/Hero_mp4.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </section>

          {/* 2. Curved Marquee Ribbon */}
          <div
            className="curved-marquee-section"
            dangerouslySetInnerHTML={{ __html: SVGS.curvedMarquee }}
          />

          {/* 3. About Pinned Section */}
          <div id="about" ref={aboutRef} className="about-pin-track">
            <section className="about-section">
              <div className="section-eyebrow">A BIT ABOUT US</div>
              <div className="about-copy-wrap">
                <p className="about-copy">
                  {aboutWords.map((word, idx) => (
                    <React.Fragment key={idx}>
                      <span className="about-word">{word}</span>{' '}
                    </React.Fragment>
                  ))}
                </p>
                <div className="about-pill about-pill-1">Professional overthinkers</div>
                <div className="about-pill about-pill-2">Nerding out on design</div>
                <div className="about-pill about-pill-3">Allergic to generic</div>
              </div>
            </section>
          </div>

          {/* 4. Showcase Continuous Marquee */}
          <section className="showcase-marquee-section" aria-label="Studio visual showcase">
            <div ref={showcaseTrackRef} className="showcase-track">
              {[...SHOWCASE_ITEMS, ...SHOWCASE_ITEMS].map((item, idx) => (
                <div key={idx} className="showcase-card">
                  {item.type === 'video' ? (
                    <video src={item.src} autoPlay loop muted playsInline />
                  ) : (
                    <img src={item.src} alt={item.alt} />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 5. Selected Works */}
          <section id="works" className="works-section">
            <div className="works-header">
              <div className="section-eyebrow">FEATURED PROJECTS</div>
              <h2 className="works-heading">
                SELECTED
                <br />
                WORKS
              </h2>
              <div />
            </div>

            <div className="projects-grid">
              {PROJECTS.map((proj, idx) => (
                <ProjectCard key={proj.id} project={proj} index={idx} onNavigate={navigate} />
              ))}
            </div>

            <div className="works-callout">
              <h2 className="works-callout-h2">
                WE COULD KEEP
                <br />
                GOING, BUT THERE’S A
                <br />
                WHOLE PAGE FOR THAT.
              </h2>
              <div className="callout-pill callout-pill-1">The plot thickens</div>
              <div className="callout-pill callout-pill-2">Very convenient</div>
              <div className="callout-pill callout-pill-3">There’s more</div>
              <MagneticButton variant="orange" onClick={() => navigate('/work')}>
                See all projects
              </MagneticButton>
            </div>
          </section>

          {/* 6. Services Curved Snake Path */}
          <section id="services" ref={servicesRef} className="services-section">
            <div className="services-header">
              <div className="section-eyebrow">OUR SERVICES</div>
              <h2 className="works-heading">
                THIS IS OUR
                <br />
                THING
              </h2>
              <div />
            </div>

            <div className="services-path-container">
              <div className="services-svg-layer services-svg-desktop">
                <div className="services-path-svg" style={{ position: 'absolute', inset: 0, opacity: 0.28 }} dangerouslySetInnerHTML={{ __html: SVGS.servicesPath }} />
                <div className="services-path-svg-dark" style={{ position: 'absolute', inset: 0 }} dangerouslySetInnerHTML={{ __html: SVGS.servicesPathDark }} />
              </div>
              <div className="services-svg-layer services-svg-mobile">
                <div className="service-path-mobile" style={{ position: 'absolute', inset: 0, opacity: 0.28 }} dangerouslySetInnerHTML={{ __html: SVGS.servicesPathMobile }} />
                <div className="service-path-mobile-dark" style={{ position: 'absolute', inset: 0 }} dangerouslySetInnerHTML={{ __html: SVGS.servicesPathMobileDark }} />
              </div>

              <div className="services-list">
                {SERVICES.map((srv) => (
                  <div key={srv.id} className={`service-node align-${srv.align}`}>
                    <div className="service-title-row">
                      <span className="service-title-word">{srv.left}</span>
                      <span className="service-icon-wrap">
                        <ServiceIcon type={srv.icon} />
                      </span>
                      {srv.right && <span className="service-title-word">{srv.right}</span>}
                    </div>
                    <div className="service-desc-pill">{srv.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 7. Testimonials Stacked Card Deck */}
          <section className="testimonials-section">
            <div className="testimonials-header">
              <div className="section-eyebrow">TESTIMONIALS</div>
              <h2 className="works-heading">
                APPARENTLY,
                <br />
                THEY LIKE US
              </h2>
              <div />
            </div>

            <TestimonialsDeck />
          </section>

          {/* 8. FAQ Section */}
          <section className="faq-section">
            <div className="faq-layout">
              <div className="faq-left">
                <div className="section-eyebrow">FREQUENTLY ASKED QUESTIONS</div>
                <h2 className="faq-heading">
                  THINGS YOU
                  <br />
                  MIGHT ASK
                </h2>
                <div
                  className="faq-cat-illustration"
                  dangerouslySetInnerHTML={{ __html: SVGS.sleepingCat }}
                />
              </div>

              <div className="faq-list">
                {FAQS.map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                      <button
                        type="button"
                        className="faq-question-btn"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      >
                        {item.q}
                      </button>
                      <div
                        className="faq-answer-row"
                        style={{
                          maxHeight: isOpen ? '360px' : '0px',
                          opacity: isOpen ? 1 : 0,
                          pointerEvents: isOpen ? 'auto' : 'none',
                        }}
                      >
                        <div className="faq-answer-bubble">{item.a}</div>
                        <div
                          className="faq-badge-26"
                          dangerouslySetInnerHTML={{ __html: SVGS.faqBadge26 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
            </>
          )}

          {/* 9. Footer */}
          <footer className="footer">
            <img
              src="/assets/images/footer-texture.svg"
              alt=""
              className="footer-texture-bg"
              aria-hidden="true"
            />
            <div className="footer-top-grid">
              <div>
                <h2 className="footer-heading">
                  <span className="hero-line-mask"><span className="footer-heading-line" style={{ display: 'inline-block' }}>Okay, that&apos;s</span></span>
                  <span className="hero-line-mask"><span className="footer-heading-line" style={{ display: 'inline-block' }}>enough</span></span>
                  <span className="hero-line-mask"><span className="footer-heading-line" style={{ display: 'inline-block' }}>website</span></span>
                </h2>
                <MagneticButton variant="dark" onClick={() => setContactOpen(true)}>
                  Let&apos;s Talk
                </MagneticButton>
                <div style={{ marginTop: 28 }}>
                  <div className="footer-label">Email us</div>
                  <a href="mailto:bogdan@two26.studio?subject=Hey%20Two26!" className="footer-link">
                    bogdan@two26.studio
                  </a>
                </div>
              </div>

              <div className="footer-link-col">
                <div className="footer-label">Main Menu</div>
                <a href="/work" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/work'); }}>
                  Work
                </a>
                <a href="/about" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>
                  About us
                </a>
              </div>

              <div className="footer-link-col">
                <a href="https://www.instagram.com/two26_studio/" target="_blank" rel="noreferrer" className="footer-link">
                  Instagram <span className="footer-arrow-icon" dangerouslySetInnerHTML={{ __html: SVGS.footerArrow }} />
                </a>
                <a href="#top" className="footer-link" onClick={(e) => e.preventDefault()}>
                  Behance <span className="footer-arrow-icon" dangerouslySetInnerHTML={{ __html: SVGS.footerArrow }} />
                </a>
                <a href="https://www.linkedin.com/company/two26-studio/" target="_blank" rel="noreferrer" className="footer-link">
                  LinkedIn <span className="footer-arrow-icon" dangerouslySetInnerHTML={{ __html: SVGS.footerArrow }} />
                </a>
              </div>
            </div>

            <div className="footer-bottom-meta">
              <div className="footer-copyright">© Copyright 2026 - Two26 Studio</div>
              <div>
                Handmade by humans.
                <br />
                Well, digitally
              </div>
              <div>
                Bucharest,
                <br />
                Romania
              </div>
            </div>

            <div
              className="footer-big-wordmark"
              dangerouslySetInnerHTML={{ __html: SVGS.footerBigLogo }}
            />
          </footer>
        </main>
      </div>

      {/* Let's Talk Fullscreen Modal */}
      {contactOpen && (
        <div ref={contactModalRef} className="contact-modal" role="dialog" aria-modal="true">
          <div className="contact-modal-header">
            <div
              className="brand-logo-link"
              style={{ color: '#fdf8f5' }}
              dangerouslySetInnerHTML={{ __html: SVGS.brandLogo }}
            />
            <button type="button" className="contact-close-btn" onClick={() => setContactOpen(false)}>
              ✕ Close
            </button>
          </div>

          <div className="contact-modal-body">
            <div>
              <h2 className="contact-h2">
                {['WANT TO', 'START', 'A NEW', 'PROJECT?'].map((line, li) => (
                  <div key={li}>
                    {line.split('').map((ch, ci) => (
                      <span key={ci} className="contact-char" style={{ display: 'inline-block' }}>
                        {ch === ' ' ? '\u00A0' : ch}
                      </span>
                    ))}
                  </div>
                ))}
              </h2>
              <div className="contact-sub">or just say hello!</div>
            </div>

            <div className="contact-info-col">
              <div>
                <div className="footer-label">INQUIRIES &amp; COMMISSIONS</div>
                <a href="mailto:bogdan@two26.studio?subject=Inquiries%20%26%20commissions" className="contact-email-link">
                  bogdan@two26.studio
                </a>
              </div>
              <div>
                <div className="footer-label">JOB APPLICATIONS</div>
                <a href="mailto:diana@two26.studio?subject=Inquiries%20%26%20commissions" className="contact-email-link">
                  diana@two26.studio
                </a>
              </div>
              <img
                src="/assets/images/contact.svg"
                alt="Hand holding Let's Talk card"
                className="contact-hand-img"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, fontSize: 14 }}>
            <a href="https://www.linkedin.com/company/two26-studio/" target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
            <a href="https://www.instagram.com/two26_studio/" target="_blank" rel="noreferrer">
              Instagram ↗
            </a>
          </div>
        </div>
      )}
    </>
  );
}
