import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SVGS } from '../data/svgs';

export function SplashLoader({ onComplete }) {
  const loaderRef = useRef(null);
  const bgRef = useRef(null);
  const logoWrapRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const loader = loaderRef.current;
    const bgEl = bgRef.current;
    const logoWrap = logoWrapRef.current;
    if (!loader || !bgEl || !logoWrap) return;

    const bgPaths = Array.from(bgEl.querySelectorAll('path'));
    const pathOrangeBg = bgPaths[0];
    const pathPinkBg = bgPaths[1];

    const logoSvg = logoWrap.querySelector('svg');
    const logoPaths = logoSvg ? Array.from(logoSvg.querySelectorAll('path')) : [];

    const ctx = gsap.context(() => {
      // 1. Setup background wipe strokes (#FF5400 & #F9E2E1)
      [pathOrangeBg, pathPinkBg].forEach((p) => {
        if (!p) return;
        p.style.strokeLinecap = 'round';
        const len = p.getTotalLength ? p.getTotalLength() : 2500;
        gsap.set(p, {
          x: 0,
          y: 0,
          strokeWidth: 3000,
          strokeDasharray: len,
          strokeDashoffset: 0,
        });
      });

      // 2. Setup kinetic logo paths
      const logoTl = gsap.timeline({ delay: 0.15 }).timeScale(1.25);

      if (logoPaths.length >= 6) {
        const pathRibbon = logoPaths[0];
        const letter2 = logoPaths[1];
        const letter6 = logoPaths[2];
        const pathW = logoPaths[3];
        const letterT = logoPaths[4];
        const letterO = logoPaths[5];
        const letters = [letterT, letterO, letter2, letter6];

        if (pathRibbon) {
          const len = pathRibbon.getTotalLength ? pathRibbon.getTotalLength() : 2500;
          pathRibbon.style.strokeLinecap = 'round';
          pathRibbon.style.strokeLinejoin = 'round';
          gsap.set(pathRibbon, {
            strokeDasharray: `${len * 0.08} ${len}`,
            strokeDashoffset: len,
            strokeWidth: 0,
          });
          logoTl
            .to(pathRibbon, { strokeWidth: 19, duration: 0.7, ease: 'power2.in' }, 0)
            .to(pathRibbon, { strokeDashoffset: len * 0.55, duration: 1.3, ease: 'power1.inOut' }, 0);
        }

        if (pathW) {
          const lenW = pathW.getTotalLength ? pathW.getTotalLength() : 800;
          pathW.style.strokeLinecap = 'butt';
          pathW.style.strokeLinejoin = 'miter';
          gsap.set(pathW, { strokeDasharray: lenW, strokeDashoffset: lenW, strokeWidth: 19 });
          logoTl.to(pathW, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out' }, '-=0.45');
        }

        if (pathRibbon) {
          const len = pathRibbon.getTotalLength ? pathRibbon.getTotalLength() : 2500;
          logoTl
            .to(pathRibbon, { strokeDashoffset: -len * 0.08, duration: 0.85, ease: 'power2.inOut' }, '-=0.45')
            .to(pathRibbon, { strokeWidth: 0, duration: 0.35, ease: 'power2.in' }, '-=0.4');
        }

        letters.forEach((letter) => {
          if (!letter) return;
          const bbox = letter.getBBox();
          const cx = bbox.x + bbox.width / 2;
          const cy = bbox.y + bbox.height / 2;
          letter.setAttribute('stroke', '#FF5400');
          letter.setAttribute('stroke-linejoin', 'round');
          gsap.set(letter, {
            scale: 0,
            rotation: gsap.utils.random(-25, 25),
            strokeWidth: 6,
            svgOrigin: `${cx} ${cy}`,
          });
        });

        logoTl
          .to(letters, { scale: 1, rotation: 0, duration: 0.55, stagger: 0.09, ease: 'back.out(3)' }, '-=0.25')
          .to(letters, { strokeWidth: 0, duration: 0.5, stagger: 0.09, ease: 'power1.in' }, '<');
      }

      // 3. Exit Sequence: Logo fades/shrinks -> Pink Wipe -> Orange Wipe
      logoTl.add(() => {
        const exitTl = gsap.timeline({
          onComplete: () => {
            setDone(true);
            if (onComplete) onComplete();
          },
        });

        exitTl.to({}, { duration: 0.15 });
        exitTl.to(logoWrap, { scale: 0.85, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.05);

        if (pathPinkBg) {
          const len1 = pathPinkBg.getTotalLength ? pathPinkBg.getTotalLength() : 2500;
          exitTl
            .to(pathPinkBg, { strokeWidth: 1000, duration: 0.25, ease: 'power2.in' }, 0.1)
            .to(pathPinkBg, { strokeDashoffset: -len1, x: 900, y: 1800, duration: 0.65, ease: 'power3.inOut' }, 0.15);
        }

        if (pathOrangeBg) {
          const len0 = pathOrangeBg.getTotalLength ? pathOrangeBg.getTotalLength() : 2500;
          exitTl
            .to(pathOrangeBg, { strokeWidth: 1000, duration: 0.25, ease: 'power2.in' }, 0.28)
            .to(pathOrangeBg, { strokeDashoffset: -len0, x: -900, y: 1800, duration: 0.65, ease: 'power3.inOut' }, 0.33);
        }
      });
    }, loaderRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (done) return null;

  return (
    <div ref={loaderRef} className="two26-loader" aria-hidden="true">
      <div
        ref={bgRef}
        className="two26-loader-bg"
        dangerouslySetInnerHTML={{ __html: SVGS.loaderBg }}
      />
      <div
        ref={logoWrapRef}
        className="two26-loader-inner"
        dangerouslySetInnerHTML={{ __html: SVGS.loaderLogo }}
      />
    </div>
  );
}
