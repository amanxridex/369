import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SVGS } from '../data/svgs';

const MASK_PATH_D =
  'M25.007 729.507C25.007 729.507 136.507 1065.7 290.007 969.007C506.711 832.495 -164.765 175.16 89.5069 44.5066C315.057 -71.3883 462.507 559.507 615.507 515.007C768.507 470.507 615.507 25.0068 615.507 25.0068';

export function ProjectCard({ project, index, onNavigate }) {
  const cardRef = useRef(null);
  const colorSplashRef = useRef(null);
  const maskStrokeRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const splashPath = colorSplashRef.current;
    const maskPath = maskStrokeRef.current;
    if (!card || !splashPath || !maskPath) return;

    const len = splashPath.getTotalLength();
    gsap.set([splashPath, maskPath], {
      strokeDasharray: len,
      strokeDashoffset: len,
      strokeWidth: 0,
    });

    const tl = gsap.timeline({ paused: true });
    tl.to(
      splashPath,
      {
        strokeDashoffset: 0,
        strokeWidth: 1200,
        duration: 0.62,
        ease: 'power2.inOut',
      },
      0
    ).to(
      maskPath,
      {
        strokeDashoffset: 0,
        strokeWidth: 1200,
        duration: 0.62,
        ease: 'power2.inOut',
      },
      0.1
    );

    if (arrowRef.current) {
      tl.to(
        arrowRef.current,
        { rotation: 45, scale: 1.08, duration: 0.35, ease: 'back.out(2)' },
        0
      );
    }

    const onEnter = () => tl.timeScale(1).play();
    const onLeave = () => tl.timeScale(1.35).reverse();

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      tl.kill();
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const maskId = `project-splash-mask-${index}`;

  return (
    <a
      ref={cardRef}
      href={project.href}
      className="project-card"
      onClick={(e) => {
        e.preventDefault();
        if (onNavigate && project.route) onNavigate(project.route);
      }}
    >
      <div className="project-card-clip-mask">
        <img className="project-img" src={project.image} alt={project.title} />

        {/* Layer 1: Brand Color Splash Brush Stroke */}
        <svg
          className="project-splash-svg"
          viewBox="0 0 709 1012"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path
            ref={colorSplashRef}
            d={MASK_PATH_D}
            fill="none"
            stroke={project.logoBg}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Layer 2: Masked Hover Image */}
        <svg
          className="project-mask-svg"
          viewBox="0 0 709 1012"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse">
              <path
                ref={maskStrokeRef}
                d={MASK_PATH_D}
                fill="none"
                stroke="#FFFFFF"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </mask>
          </defs>
          <image
            href={project.hoverImage}
            x="0"
            y="0"
            width="709"
            height="1012"
            preserveAspectRatio="xMidYMid slice"
            mask={`url(#${maskId})`}
          />
        </svg>
      </div>

      <div className="project-meta">
        <div className="project-meta-left">
          <div className="project-logo-badge" style={{ backgroundColor: project.logoBg }}>
            <img src={project.logo} alt={`${project.title} logo`} />
          </div>
          <div>
            <h3 className="project-title">{project.title}</h3>
            <div className="project-cat">{project.category}</div>
          </div>
        </div>
        <span
          ref={arrowRef}
          className="project-arrow-btn"
          dangerouslySetInnerHTML={{ __html: SVGS.projectArrow }}
        />
      </div>
    </a>
  );
}
