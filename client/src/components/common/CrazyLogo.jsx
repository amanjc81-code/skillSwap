import React from 'react';

/**
 * Cute, warm, human-crafted Card-Head mascot SVG
 * Features warm cardboard tones, folded box flaps/ears, kawaii gloss eyes,
 * rosy blushing cheeks, mint washi tape, and a lively learning sprout 🌱.
 */
export const CardHeadLogo = ({ size = 34, className = '', animate = true }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={`cardhead-mascot-logo ${className}`}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        filter: 'drop-shadow(0 2px 6px rgba(226, 183, 124, 0.45))'
      }}
    >
      <defs>
        {/*  Warm Creamy Paper Background Gradient  */}
        <radialGradient id="chWarmStickerBg" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFFDF9" />
          <stop offset="65%" stopColor="#FFF4E6" />
          <stop offset="100%" stopColor="#FDE8D0" />
        </radialGradient>

        {/*  Warm Cardboard Kraft Gradients  */}
        <linearGradient id="chKraftFace" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FDF0DB" />
          <stop offset="35%" stopColor="#F5D4A4" />
          <stop offset="85%" stopColor="#E2B77C" />
          <stop offset="100%" stopColor="#D19E5D" />
        </linearGradient>

        <linearGradient id="chKraftInner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C58E4F" />
          <stop offset="100%" stopColor="#DEAA6D" />
        </linearGradient>

        {/*  Warm Blush Radial Gradient  */}
        <radialGradient id="chBlushGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF758F" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#FF9EAA" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFA8B6" stopOpacity="0" />
        </radialGradient>

        {/*  Fresh Learning Sprout Gradient  */}
        <linearGradient id="chSproutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="60%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>

        {animate && (
          <style>{`
            @keyframes chGentleBob {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-2.5px) rotate(1deg); }
            }
            @keyframes chSproutSway {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(7deg); }
            }
            .ch-anim-mascot {
              transform-origin: 64px 80px;
              animation: chGentleBob 3.5s ease-in-out infinite;
            }
            .ch-anim-sprout {
              transform-origin: 64px 34px;
              animation: chSproutSway 3s ease-in-out infinite;
            }
          `}</style>
        )}
      </defs>

      {/* 1. Soft Warm Die-Cut Sticker Card Base */}
      <rect x="8" y="11" width="112" height="110" rx="36" fill="#E8D1BE" opacity="0.75" />
      <rect x="8" y="8" width="112" height="110" rx="36" fill="url(#chWarmStickerBg)" stroke="#F3DEC8" strokeWidth="2.5" />

      {/* Doodled Warm Accents in Background */}
      <path
        d="M 104 22 C 104 26 106 28 110 28 C 106 28 104 30 104 34 C 104 30 102 28 98 28 C 102 28 104 26 104 22 Z"
        fill="#F59E0B"
      />
      <circle cx="20" cy="30" r="2.5" fill="#10B981" opacity="0.8" />
      <path
        d="M 21 95 C 19 93 17 95 17 97 C 17 99 21 102 21 102 C 21 102 25 99 25 97 C 25 95 23 93 21 95 Z"
        fill="#FB7185"
        opacity="0.85"
      />

      {/* 2. The Mascot: Cute Warm Card-Head Student */}
      <g className={animate ? 'ch-anim-mascot' : ''}>
        {/* Cardboard Box Folded Ear Flaps */}
        <polygon points="34,44 15,22 45,31 49,44" fill="url(#chKraftInner)" stroke="#381E11" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="32,43 17,24 43,32" fill="#E7B87E" />

        <polygon points="94,44 113,22 83,31 79,44" fill="url(#chKraftInner)" stroke="#381E11" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="96,43 111,24 85,32" fill="#E7B87E" />

        {/* The Learning Sprout 🌱 */}
        <g className={animate ? 'ch-anim-sprout' : ''}>
          <path
            d="M 64 35 C 64 24 61 17 67 11"
            fill="none"
            stroke="#15803D"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 65 17 C 53 16 51 29 65 25 Z"
            fill="url(#chSproutGrad)"
            stroke="#15803D"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M 67 13 C 79 11 82 23 68 21 Z"
            fill="url(#chSproutGrad)"
            stroke="#15803D"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M 64 20 Q 59 21 57 24" fill="none" stroke="#BBF7D0" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Main Cardboard Box Head */}
        <rect
          x="27"
          y="40"
          width="74"
          height="58"
          rx="14"
          fill="url(#chKraftFace)"
          stroke="#381E11"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Cardboard Box Top Crease Line */}
        <path d="M 33 46 L 95 46" stroke="#D19E5D" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

        {/* Cute Pastel Mint Washi Tape */}
        <g>
          <polygon
            points="75,32 97,24 100,34 78,42"
            fill="#A7F3D0"
            stroke="#381E11"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <line
            x1="78"
            y1="37"
            x2="97"
            y2="29"
            stroke="#047857"
            strokeWidth="1.8"
            strokeDasharray="2 3"
            strokeLinecap="round"
          />
        </g>

        {/* Sweet Kawaii Blush Cheeks */}
        <circle cx="41" cy="73" r="8" fill="url(#chBlushGlow)" />
        <circle cx="87" cy="73" r="8" fill="url(#chBlushGlow)" />

        {/* Big Sparkling Kawaii Eyes */}
        <g>
          <ellipse cx="49" cy="65" rx="5.5" ry="7" fill="#381E11" />
          <circle cx="47.2" cy="62.5" r="2.6" fill="#FFFFFF" />
          <circle cx="51.2" cy="67.5" r="1.3" fill="#FFFFFF" />
        </g>

        <g>
          <ellipse cx="79" cy="65" rx="5.5" ry="7" fill="#381E11" />
          <circle cx="77.2" cy="62.5" r="2.6" fill="#FFFFFF" />
          <circle cx="81.2" cy="67.5" r="1.3" fill="#FFFFFF" />
        </g>

        {/* Cheerful Smile */}
        <path
          d="M 58 70 Q 64 77 70 70 Q 64 83 58 70 Z"
          fill="#E11D48"
          stroke="#381E11"
          strokeWidth="2.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path d="M 60 75 Q 64 72 68 75 Q 64 80 60 75 Z" fill="#FDA4AF" />

        {/* Tiny Warm Doodle Heart */}
        <path
          d="M 37 84 C 35.5 82.5 33 83.5 33 85 C 33 87 37 89.5 37 89.5 C 37 89.5 41 87 41 85 C 41 83.5 38.5 82.5 37 84 Z"
          fill="#F43F5E"
          opacity="0.9"
        />

        {/* Cute Cardboard Paws */}
        <rect
          x="39"
          y="92"
          width="13"
          height="10"
          rx="5"
          fill="#F5D4A4"
          stroke="#381E11"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <rect
          x="76"
          y="92"
          width="13"
          height="10"
          rx="5"
          fill="#F5D4A4"
          stroke="#381E11"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

// Also export as CrazyLogo for backward compatibility with existing imports
export const CrazyLogo = CardHeadLogo;

export default CardHeadLogo;
