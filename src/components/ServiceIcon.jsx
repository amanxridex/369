import React from 'react';

export function ServiceIcon({ type }) {
  switch (type) {
    case 'strategy':
      return (
        <svg viewBox="0 0 80 80" className="service-badge-svg" fill="none">
          <rect x="6" y="10" width="68" height="60" rx="14" fill="#F8EEE8" />
          <circle cx="40" cy="40" r="20" fill="#FF5400" stroke="#000" strokeWidth="2.5" />
          <path d="M30 40c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10" stroke="#F8EEE8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M40 40l14-14M54 26h-7m7 0v7" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'identity':
      return (
        <svg viewBox="0 0 80 80" className="service-badge-svg" fill="none">
          <g transform="rotate(14 40 40)">
            <rect x="14" y="16" width="38" height="38" rx="6" fill="#FF5400" stroke="#000" strokeWidth="2.5" />
            <path d="M52 18l12 8v34l-12-6" fill="#F8EEE8" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M16 54l12 8h36" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
            <text x="25" y="42" fill="#000" fontSize="22" fontWeight="800" fontFamily="Mdnichrometest, sans-serif">B</text>
            <text x="55" y="45" fill="#000" fontSize="18" fontWeight="800" fontFamily="Mdnichrometest, sans-serif">I</text>
          </g>
        </svg>
      );
    case 'web':
      return (
        <svg viewBox="0 0 80 80" className="service-badge-svg" fill="none">
          <rect x="10" y="16" width="60" height="46" rx="6" fill="#FF5400" stroke="#000" strokeWidth="2.5" />
          <rect x="10" y="16" width="60" height="11" rx="4" fill="#000" />
          <circle cx="18" cy="21.5" r="2" fill="#F8EEE8" />
          <circle cx="25" cy="21.5" r="2" fill="#F8EEE8" />
          <circle cx="32" cy="21.5" r="2" fill="#F8EEE8" />
          <path d="M22 44l6 16 4-6 6-2-16-8z" fill="#F8EEE8" stroke="#000" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case 'illustration':
      return (
        <svg viewBox="0 0 80 80" className="service-badge-svg" fill="none">
          <g transform="rotate(-12 40 40)">
            <rect x="12" y="18" width="56" height="44" rx="5" fill="#F8EEE8" stroke="#000" strokeWidth="2.5" />
            <path d="M12 48c14-12 34-12 56 0v14H12V48z" fill="#FF5400" stroke="#000" strokeWidth="2.5" />
            <circle cx="32" cy="34" r="6" fill="#FF5400" stroke="#000" strokeWidth="2" />
            <path d="M48 30l14-8 3 5-14 8-5-1 2-4z" fill="#000" />
          </g>
        </svg>
      );
    case 'motion':
      return (
        <svg viewBox="0 0 80 80" className="service-badge-svg" fill="none">
          <rect x="10" y="24" width="60" height="40" rx="5" fill="#FF5400" stroke="#000" strokeWidth="2.5" />
          <path d="M10 24l6-10h54l-6 10H10z" fill="#F8EEE8" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M24 14l-4 10M40 14l-4 10M56 14l-4 10" stroke="#000" strokeWidth="2.5" />
          <polygon points="34,35 34,53 50,44" fill="#F8EEE8" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
    case 'packaging':
      return (
        <svg viewBox="0 0 80 80" className="service-badge-svg" fill="none">
          <g transform="rotate(-10 40 40)">
            <rect x="20" y="22" width="40" height="46" rx="5" fill="#FF5400" stroke="#000" strokeWidth="2.5" />
            <rect x="33" y="8" width="14" height="14" rx="3" fill="#F8EEE8" stroke="#000" strokeWidth="2.5" />
            <circle cx="40" cy="45" r="10" fill="#F8EEE8" stroke="#000" strokeWidth="2.5" />
          </g>
        </svg>
      );
    case 'art':
    default:
      return (
        <svg viewBox="0 0 80 80" className="service-badge-svg" fill="none">
          <ellipse cx="40" cy="40" rx="26" ry="15" fill="#F8EEE8" stroke="#000" strokeWidth="2.5" />
          <circle cx="40" cy="40" r="8" fill="#000" />
          <circle cx="42" cy="38" r="2.5" fill="#F8EEE8" />
          <path d="M14 40c-4-8 2-18 10-16M66 40c4 8-2 18-10 16" stroke="#FF5400" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
  }
}
