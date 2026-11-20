import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SVGS } from '../data/svgs';

export function MagneticButton({
  children,
  onClick,
  href,
  className = '',
  variant = 'dark',
  ariaLabel,
}) {
  const btnRef = useRef(null);
  const textRef = useRef(null);
  const arrowRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    let arrowLoop = null;

    const onEnter = () => {
      if (fillRef.current) {
        gsap.to(fillRef.current, { scale: 1.08, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      }
      if (arrowRef.current) {
        gsap.set(arrowRef.current, { transformOrigin: 'center center' });
        if (arrowLoop) arrowLoop.kill();
        arrowLoop = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
        arrowLoop
          .to(arrowRef.current, { rotation: -25, duration: 0.22, ease: 'power2.out' })
          .to(arrowRef.current, { rotation: 0, duration: 0.4, ease: 'back.out(2.5)' });
      }
    };

    const onMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const currentX = gsap.getProperty(btn, 'x') || 0;
      const currentY = gsap.getProperty(btn, 'y') || 0;
      const originCenterX = rect.left - currentX + rect.width / 2;
      const originCenterY = rect.top - currentY + rect.height / 2;
      const deltaX = e.clientX - originCenterX;
      const deltaY = e.clientY - originCenterY;

      gsap.to(btn, {
        x: deltaX * 0.35,
        y: deltaY * 0.35,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      const inner = [textRef.current, arrowRef.current].filter(Boolean);
      if (inner.length) {
        gsap.to(inner, {
          x: deltaX * 0.15,
          y: deltaY * 0.15,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    const onLeave = () => {
      if (arrowLoop) {
        arrowLoop.kill();
        arrowLoop = null;
      }
      if (arrowRef.current) {
        gsap.to(arrowRef.current, { rotation: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      }
      gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1.1, 0.4)', overwrite: 'auto' });
      const inner = [textRef.current, arrowRef.current].filter(Boolean);
      if (inner.length) {
        gsap.to(inner, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1.1, 0.4)', overwrite: 'auto' });
      }
      if (fillRef.current) {
        gsap.to(fillRef.current, { scale: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
      }
    };

    btn.addEventListener('mouseenter', onEnter);
    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);
    return () => {
      if (arrowLoop) arrowLoop.kill();
      btn.removeEventListener('mouseenter', onEnter);
      btn.removeEventListener('mousemove', onMove);
      btn.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const content = (
    <>
      <span ref={textRef} className="cta-btn-text">{children}</span>
      <span ref={fillRef} className="cta-btn-circle">
        <span
          ref={arrowRef}
          className="cta-btn-arrow"
          dangerouslySetInnerHTML={{ __html: SVGS.arrowCta }}
        />
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={btnRef}
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        className={`cta-magnetic-btn cta-${variant} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`cta-magnetic-btn cta-${variant} ${className}`}
    >
      {content}
    </button>
  );
}
