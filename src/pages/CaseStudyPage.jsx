import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PAGES_DATA } from '../data/pagesData';
import { ALL_PROJECTS } from '../data/content';
import { ProjectCard } from '../components/ProjectCard';

gsap.registerPlugin(ScrollTrigger);

export function CaseStudyPage({ slug, onNavigate }) {
  const rootRef = useRef(null);
  const study = PAGES_DATA.caseStudies[slug] || PAGES_DATA.caseStudies.heygluco;

  const moreWorks = ALL_PROJECTS.filter((p) => p.id !== study.slug).slice(0, 3);

  useEffect(() => {
    const scroller = document.querySelector('.page');
    const ctx = gsap.context(() => {
      gsap.from('.case-hero-title', {
        y: 60,
        opacity: 0,
        duration: 0.75,
        ease: 'power4.out',
      });
      gsap.utils.toArray('.case-gallery-item').forEach((item) => {
        gsap.from(item, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            scroller,
            start: 'top 86%',
            once: true,
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [slug]);

  return (
    <div ref={rootRef} className="case-study-page">
      {/* Full-bleed Hero */}
      <section className="case-hero">
        <img src={study.heroImage} alt={study.title} className="case-hero-img" />
        <div className="case-hero-overlay" />
        <a
          href="/work"
          className="case-back-btn"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/work');
          }}
        >
          ← Back to our work
        </a>
        <div className="case-hero-bottom">
          <div className="case-hero-cat">{study.category}</div>
          <h1 className="case-hero-title">{study.title}</h1>
        </div>
      </section>

      {/* Context & Solution */}
      <section className="case-brief-section">
        <div className="case-brief-grid">
          <div className="case-brief-col">
            <h2 className="case-brief-heading">The Context</h2>
            {study.context.map((p, i) => (
              <p key={i} className="case-brief-p">{p}</p>
            ))}
          </div>
          <div className="case-brief-col">
            <h2 className="case-brief-heading">The Solution</h2>
            {study.solution.map((p, i) => (
              <p key={i} className="case-brief-p">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="case-gallery-section">
        {study.gallery.map((src, i) => (
          <div key={`${slug}-${i}`} className="case-gallery-item">
            <img src={src} alt={`${study.title} showcase ${i + 1}`} />
          </div>
        ))}
      </section>

      {/* More Works */}
      <section className="works-section">
        <h2 className="works-heading" style={{ marginBottom: 48 }}>MORE WORKS</h2>
        <div className="projects-grid">
          {moreWorks.map((proj, idx) => (
            <ProjectCard key={proj.id} project={proj} index={idx} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
    </div>
  );
}
