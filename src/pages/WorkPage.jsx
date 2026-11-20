import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ALL_PROJECTS } from '../data/content';
import { ProjectCard } from '../components/ProjectCard';

gsap.registerPlugin(ScrollTrigger);

export function WorkPage({ onNavigate }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const scroller = document.querySelector('.page');
    const ctx = gsap.context(() => {
      gsap.from('.work-page-line', {
        yPercent: 110,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power4.out',
      });
      gsap.from('.work-page-pill', {
        scale: 0,
        opacity: 0,
        duration: 0.55,
        stagger: 0.12,
        delay: 0.25,
        ease: 'back.out(2)',
      });
      gsap.utils.toArray('.work-page-grid .project-card-clip-mask').forEach((card, i) => {
        gsap.from(card, {
          clipPath: 'inset(16% 0% 0% 0% round 12px)',
          opacity: 0,
          y: 36,
          duration: 0.7,
          delay: (i % 3) * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            scroller,
            start: 'top 88%',
            once: true,
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="work-page">
      <section className="work-hero-section">
        <div className="work-hero-title-wrap">
          <h1 className="work-hero-h1">
            <span className="hero-line-mask">
              <span className="work-page-line" style={{ display: 'inline-block' }}>A FEW PROJECTS</span>
            </span>
            <span className="hero-line-mask">
              <span className="work-page-line" style={{ display: 'inline-block' }}>TO BRAG ABOUT</span>
            </span>
          </h1>
          <div className="hero-pill work-page-pill work-pill-1">Just a few</div>
          <div className="hero-pill work-page-pill work-pill-2">Kind of proud</div>
        </div>
        <p className="work-hero-desc">
          A selection of brands, identities, websites and other things we’ve helped bring to life. Different
          challenges, various approaches, same focus on getting everything right.
        </p>
      </section>

      <section className="works-section" style={{ paddingTop: 20 }}>
        <div className="projects-grid work-page-grid">
          {ALL_PROJECTS.map((proj, idx) => (
            <ProjectCard key={proj.id} project={proj} index={idx} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
    </div>
  );
}
