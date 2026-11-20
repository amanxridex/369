import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { TESTIMONIALS } from '../data/content';

const ANGLE_PALETTE = [-7.5, 6.8, -5.5, 8.2, -8.5];

export function TestimonialsDeck() {
  const stageRef = useRef(null);
  const arrowRef = useRef(null);
  const cardRefs = useRef([]);
  const currentIdxRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const total = TESTIMONIALS.length;

  const reorderZIndices = (active) => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const order = (i - active + total) % total;
      card.style.zIndex = String(total - order);
      if (i !== active) {
        gsap.to(card, {
          rotation: ANGLE_PALETTE[i % ANGLE_PALETTE.length],
          xPercent: 0,
          yPercent: 0,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });
  };

  const goToNextCard = () => {
    if (isAnimatingRef.current || total <= 1) return;
    isAnimatingRef.current = true;

    const outgoingIdx = currentIdxRef.current;
    const outgoingCard = cardRefs.current[outgoingIdx];
    const nextIdx = (outgoingIdx + 1) % total;
    const incomingCard = cardRefs.current[nextIdx];

    if (incomingCard) {
      gsap.to(incomingCard, {
        rotation: 0,
        xPercent: 0,
        yPercent: 0,
        duration: 0.35,
        ease: 'power2.out',
      });
    }

    const tiltOffset = outgoingIdx % 2 === 0 ? 9 : -9;
    gsap.to(outgoingCard, {
      yPercent: -140,
      rotation: ANGLE_PALETTE[outgoingIdx % ANGLE_PALETTE.length] + tiltOffset,
      duration: 0.38,
      ease: 'power2.inOut',
      onComplete: () => {
        currentIdxRef.current = nextIdx;
        setActiveIndex(nextIdx);
        reorderZIndices(nextIdx);
        outgoingCard.style.zIndex = '1';

        gsap.to(outgoingCard, {
          yPercent: 0,
          rotation: ANGLE_PALETTE[outgoingIdx % ANGLE_PALETTE.length],
          duration: 0.38,
          ease: 'power2.out',
          onComplete: () => {
            reorderZIndices(nextIdx);
            isAnimatingRef.current = false;
          },
        });
      },
    });
  };

  const goToPrevCard = () => {
    if (isAnimatingRef.current || total <= 1) return;
    isAnimatingRef.current = true;

    const currIdx = currentIdxRef.current;
    const prevIdx = (currIdx - 1 + total) % total;
    const incomingCard = cardRefs.current[prevIdx];
    const currentCard = cardRefs.current[currIdx];

    if (currentCard) {
      gsap.to(currentCard, {
        rotation: ANGLE_PALETTE[currIdx % ANGLE_PALETTE.length],
        xPercent: 0,
        yPercent: 0,
        duration: 0.35,
        ease: 'power2.out',
      });
    }

    const tiltOffset = prevIdx % 2 === 0 ? 8 : -8;
    gsap.to(incomingCard, {
      yPercent: 120,
      rotation: ANGLE_PALETTE[prevIdx % ANGLE_PALETTE.length] + tiltOffset,
      duration: 0.38,
      ease: 'power2.inOut',
      onComplete: () => {
        currentIdxRef.current = prevIdx;
        setActiveIndex(prevIdx);
        reorderZIndices(prevIdx);
        incomingCard.style.zIndex = String(total + 10);

        gsap.to(incomingCard, {
          yPercent: 0,
          rotation: 0,
          duration: 0.38,
          ease: 'power2.out',
          onComplete: () => {
            reorderZIndices(prevIdx);
            isAnimatingRef.current = false;
          },
        });
      },
    });
  };

  useEffect(() => {
    const stage = stageRef.current;
    const arrow = arrowRef.current;
    if (!stage) return;

    // Initial deck setup
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const order = (i - 0 + total) % total;
      card.style.zIndex = String(total - order);
      gsap.set(card, {
        xPercent: 0,
        yPercent: 0,
        x: 0,
        y: 0,
        rotation: i === 0 ? 0 : ANGLE_PALETTE[i % ANGLE_PALETTE.length],
        opacity: 1,
        scale: 1,
        force3D: true,
        transformOrigin: 'center center',
      });
    });

    const isTouch = matchMedia('(pointer: coarse)').matches || window.innerWidth < 992;
    let currentArrowDir = 0;

    if (arrow && isTouch) {
      arrow.style.display = 'none';
    }

    if (arrow && !isTouch) {
      gsap.set(arrow, {
        scale: 0,
        opacity: 0,
        rotation: 0,
        xPercent: -50,
        yPercent: -50,
        transformOrigin: 'center center',
        force3D: true,
      });

      const setArrowX = gsap.quickTo(arrow, 'x', { duration: 0.15, ease: 'power2.out' });
      const setArrowY = gsap.quickTo(arrow, 'y', { duration: 0.15, ease: 'power2.out' });

      const onEnter = (e) => {
        const rect = stage.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        gsap.set(arrow, { x: mx, y: my });
        currentArrowDir = my < rect.height / 2 ? 0 : 180;
        gsap.set(arrow, { rotation: currentArrowDir });
        gsap.to(arrow, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)', overwrite: 'auto' });
      };

      const onMove = (e) => {
        const rect = stage.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        setArrowX(mx);
        setArrowY(my);
        const targetRot = my < rect.height / 2 ? 0 : 180;
        if (currentArrowDir !== targetRot) {
          currentArrowDir = targetRot;
          gsap.to(arrow, { rotation: targetRot, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
        }
      };

      const onLeave = () => {
        gsap.to(arrow, { scale: 0, opacity: 0, duration: 0.2, ease: 'power2.in', overwrite: 'auto' });
      };

      stage.addEventListener('mouseenter', onEnter);
      stage.addEventListener('mousemove', onMove);
      stage.addEventListener('mouseleave', onLeave);

      // Touch swipe support
      let startY = 0;
      let startX = 0;
      const onTouchStart = (e) => {
        if (e.touches.length === 1) {
          startY = e.touches[0].clientY;
          startX = e.touches[0].clientX;
        }
      };
      const onTouchEnd = (e) => {
        if (e.changedTouches.length === 1) {
          const dy = e.changedTouches[0].clientY - startY;
          const dx = e.changedTouches[0].clientX - startX;
          if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 30) {
            if (dy < 0) goToNextCard();
            else goToPrevCard();
          }
        }
      };
      stage.addEventListener('touchstart', onTouchStart, { passive: true });
      stage.addEventListener('touchend', onTouchEnd, { passive: true });

      return () => {
        stage.removeEventListener('mouseenter', onEnter);
        stage.removeEventListener('mousemove', onMove);
        stage.removeEventListener('mouseleave', onLeave);
        stage.removeEventListener('touchstart', onTouchStart);
        stage.removeEventListener('touchend', onTouchEnd);
      };
    }
  }, [total]);

  const handleStageClick = (e) => {
    if (e.target.closest('button, a')) return;
    const rect = stageRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    if (clickY < rect.height / 2) {
      goToNextCard();
    } else {
      goToPrevCard();
    }
  };

  return (
    <div ref={stageRef} className="testimonials-stage" onClick={handleStageClick}>
      {/* Floating Custom Cursor Navigation Arrow */}
      <div ref={arrowRef} className="nav-arrow" aria-hidden="true">
        <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.17285 16.1729L7.17285 1.17285M1.17285 6.79785L7.17285 1.17285L13.1729 6.79785"
            stroke="currentColor"
            strokeWidth="2.34564"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="testimonials-deck">
        {TESTIMONIALS.map((item, idx) => (
          <article
            key={item.id}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            className="testimonial-card"
          >
            <h3 className="testimonial-headline">{item.headline}</h3>
            <div className="testimonial-body-row">
              <div className="testimonial-author">
                <img className="testimonial-avatar" src={item.avatar} alt={item.name} />
                <div className="testimonial-name">{item.name}</div>
                <div className="testimonial-role">{item.role}</div>
              </div>
              <p className="testimonial-quote">{item.quote}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="testimonials-progress">
        {TESTIMONIALS.map((t, idx) => (
          <button
            key={t.id}
            type="button"
            aria-label={`Testimonial ${idx + 1}`}
            className={`progress-bar-btn ${idx === activeIndex ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (idx > currentIdxRef.current) goToNextCard();
              else if (idx < currentIdxRef.current) goToPrevCard();
            }}
          />
        ))}
      </div>
    </div>
  );
}
