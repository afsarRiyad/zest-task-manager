'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useSpring } from 'framer-motion';

const SPRING = { type: 'spring', bounce: 0, duration: 0.42 };
const OPEN_EYES = new Set(['idle', 'happy', 'focus', 'concerned']);

function Sparkle({ x, y, size = 10, color = '#A78BFA', opacity = 1 }) {
  return (
    <path
      d="M0 -10 C1.2 -3.4 3.4 -1.2 10 0 C3.4 1.2 1.2 3.4 0 10 C-1.2 3.4 -3.4 1.2 -10 0 C-3.4 -1.2 -1.2 -3.4 0 -10Z"
      transform={`translate(${x} ${y}) scale(${size / 10})`}
      fill={color}
      opacity={opacity}
    />
  );
}

export default function AnimeCompanion({
  mood = 'idle',
  variant = 'full',
  greet = false,
  allDone = false,
  interactive = true,
  fit = 'meet',
  className = '',
  style,
}) {
  const uid = useId().replace(/:/g, '');
  const avatar = variant === 'avatar';
  const portrait = variant === 'portrait';
  const reduceMotion = useReducedMotion();
  const svgRef = useRef(null);
  const [blink, setBlink] = useState(false);

  const lookX = useSpring(0, { stiffness: 130, damping: 20 });
  const lookY = useSpring(0, { stiffness: 130, damping: 20 });

  useEffect(() => {
    if (!interactive || reduceMotion) return undefined;

    const handleMove = (event) => {
      const node = svgRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.46;
      lookX.set(Math.max(-2.6, Math.min(2.6, ((event.clientX - centerX) / rect.width) * 8)));
      lookY.set(Math.max(-2, Math.min(2, ((event.clientY - centerY) / rect.height) * 8)));
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [interactive, lookX, lookY, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !OPEN_EYES.has(mood)) {
      setBlink(false);
      return undefined;
    }

    let blinkTimer;
    let openTimer;
    let stopped = false;

    const schedule = () => {
      blinkTimer = window.setTimeout(
        () => {
          if (stopped) return;
          setBlink(true);
          openTimer = window.setTimeout(() => {
            if (stopped) return;
            setBlink(false);
            schedule();
          }, 115);
        },
        3200 + Math.random() * 2800
      );
    };

    schedule();

    return () => {
      stopped = true;
      window.clearTimeout(blinkTimer);
      window.clearTimeout(openTimer);
      setBlink(false);
    };
  }, [mood, reduceMotion]);

  const eyeScale = mood === 'sleepy' ? 0.46 : blink ? 0.08 : 1;

  let headAnimate = { rotate: 0, y: 0 };
  let headTransition = { duration: 0.4 };

  if (!reduceMotion) {
    if (mood === 'cheer') {
      headAnimate = { rotate: [0, -2.2, 1.4, 0], y: [0, -7, 0] };
      headTransition = { duration: 0.9, ease: 'easeOut' };
    } else if (mood === 'concerned') {
      headAnimate = { rotate: -1.6, y: 1 };
      headTransition = SPRING;
    } else if (mood === 'sleepy') {
      headAnimate = { rotate: 2.4, y: 2.5 };
      headTransition = SPRING;
    } else if (mood === 'happy') {
      headAnimate = { rotate: 1.4, y: -1 };
      headTransition = SPRING;
    } else if (greet) {
      headAnimate = { rotate: [0, -2, 1, 0], y: [0, -4, 0] };
      headTransition = { duration: 1.15, ease: 'easeOut' };
    } else {
      headAnimate = { y: [0, -2.6, 0], rotate: 0 };
      headTransition = { duration: 7.5, repeat: Infinity, ease: 'easeInOut' };
    }
  }

  const brows = (() => {
    if (mood === 'concerned') {
      return (
        <g stroke="#2B1D42" strokeWidth="3.1" strokeLinecap="round" fill="none">
          <path d="M131 157 C140 157 149 152 157 148" />
          <path d="M229 157 C220 157 211 152 203 148" />
        </g>
      );
    }
    if (mood === 'focus') {
      return (
        <g stroke="#2B1D42" strokeWidth="3.1" strokeLinecap="round" fill="none">
          <path d="M131 156 C140 154 150 157 158 162" />
          <path d="M229 156 C220 154 210 157 202 162" />
        </g>
      );
    }
    if (mood === 'sleepy') {
      return (
        <g stroke="#2B1D42" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.85">
          <path d="M132 159 C141 156 150 156 158 159" />
          <path d="M228 159 C219 156 210 156 202 159" />
        </g>
      );
    }
    return (
      <g stroke="#2B1D42" strokeWidth="3.1" strokeLinecap="round" fill="none">
        <path d="M132 160 C140 153 150 153 158 158" />
        <path d="M228 160 C220 153 210 153 202 158" />
      </g>
    );
  })();

  return (
    <svg
      ref={svgRef}
      viewBox={avatar ? '90 38 180 212' : portrait ? '40 26 280 314' : '0 0 360 440'}
      className={className || (avatar ? 'h-full w-full' : 'h-auto w-full')}
      style={style}
      role="img"
      aria-label="Nova, the Zest focus companion"
      preserveAspectRatio={fit === 'cover' ? 'xMidYMin slice' : 'xMidYMid meet'}
    >
      <defs>
        <linearGradient id={`${uid}-skin`} x1="132" y1="96" x2="242" y2="272" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8DCCD" />
          <stop offset="0.6" stopColor="#EEBFAF" />
          <stop offset="1" stopColor="#DCA293" />
        </linearGradient>
        <linearGradient id={`${uid}-hair`} x1="116" y1="64" x2="252" y2="332" gradientUnits="userSpaceOnUse">
          <stop stopColor="#372A57" />
          <stop offset="0.55" stopColor="#241B3C" />
          <stop offset="1" stopColor="#14101F" />
        </linearGradient>
        <linearGradient id={`${uid}-hair-edge`} x1="180" y1="60" x2="250" y2="300" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C5CFF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#67E8F9" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id={`${uid}-jacket`} x1="76" y1="340" x2="292" y2="440" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2B3144" />
          <stop offset="0.62" stopColor="#1A1F2C" />
          <stop offset="1" stopColor="#11141C" />
        </linearGradient>
        <linearGradient id={`${uid}-tee`} x1="156" y1="344" x2="208" y2="440" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3F0F8" />
          <stop offset="1" stopColor="#CFC8DD" />
        </linearGradient>
        <linearGradient id={`${uid}-iris`} x1="144" y1="180" x2="158" y2="204" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2DAFF" />
          <stop offset="0.38" stopColor="#B59AFB" />
          <stop offset="0.72" stopColor="#7C5CD6" />
          <stop offset="1" stopColor="#4C2E96" />
        </linearGradient>
        <linearGradient id={`${uid}-cyan`} x1="210" y1="108" x2="226" y2="156" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A5F3FC" stopOpacity="0.95" />
          <stop offset="1" stopColor="#67E8F9" stopOpacity="0.12" />
        </linearGradient>
        <radialGradient id={`${uid}-halo`} cx="50%" cy="48%" r="52%">
          <stop stopColor="#A78BFA" stopOpacity="0.2" />
          <stop offset="0.55" stopColor="#7C5CFF" stopOpacity="0.08" />
          <stop offset="1" stopColor="#7C5CFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-blush`} cx="50%" cy="50%" r="50%">
          <stop stopColor="#F28CA0" stopOpacity="0.34" />
          <stop offset="1" stopColor="#F28CA0" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-soft`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <clipPath id={`${uid}-eye-left`}>
          <path d="M130 191 C133 176 144 169 155 175 C162 179 165 188 161 197 C156 207 144 208 136 201 C132 197 130 194 130 191 Z" />
        </clipPath>
        <clipPath id={`${uid}-eye-right`}>
          <path d="M230 191 C227 176 216 169 205 175 C198 179 195 188 199 197 C204 207 216 208 224 201 C228 197 230 194 230 191 Z" />
        </clipPath>
      </defs>

      {!avatar ? (
        <g aria-hidden="true">
          <circle cx="180" cy="206" r="164" fill={`url(#${uid}-halo)`} />
          <circle
            cx="180"
            cy="206"
            r="146"
            fill="none"
            stroke="rgba(167,139,250,0.12)"
            strokeWidth="1"
            strokeDasharray="2 10"
          />
          <path d="M48 254 C42 214 56 176 82 146" stroke="#67E8F9" strokeOpacity="0.12" strokeWidth="1.2" fill="none" />
          <path d="M314 240 C322 202 312 170 292 142" stroke="#A78BFA" strokeOpacity="0.16" strokeWidth="1.2" fill="none" />
        </g>
      ) : null}

      <motion.g
        animate={reduceMotion ? {} : { y: [0, 1.4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path
          d="M48 440 C56 382 84 344 132 324 L180 356 L228 324 C276 344 304 382 312 440 Z"
          fill={`url(#${uid}-jacket)`}
        />
        <path
          d="M132 324 C143 339 163 351 180 357 C197 351 217 339 228 324"
          stroke="#0C0F16"
          strokeWidth="3"
          fill="none"
          opacity="0.8"
        />
        <path d="M150 340 L180 366 L210 340 L222 372 L218 440 L142 440 L138 372 Z" fill={`url(#${uid}-tee)`} />
        <path d="M150 340 L180 366 L210 340" stroke="#B3AAC4" strokeWidth="1.2" fill="none" opacity="0.65" />
        <path d="M152 390 L164 440 L146 440 L138 386 Z" fill="#0F1218" opacity="0.18" />
        <path d="M211 388 L200 440 L217 440 L223 385 Z" fill="#0F1218" opacity="0.14" />

        <path d="M96 366 C112 353 128 344 146 336" stroke="#0B0E14" strokeWidth="2" fill="none" opacity="0.55" />
        <path d="M264 366 C248 353 232 344 214 336" stroke="#0B0E14" strokeWidth="2" fill="none" opacity="0.55" />
        <path d="M82 398 C78 418 74 430 72 440" stroke="#0B0E14" strokeWidth="2" fill="none" opacity="0.45" />
        <path d="M278 398 C282 418 286 430 288 440" stroke="#0B0E14" strokeWidth="2" fill="none" opacity="0.45" />
        <path d="M118 390 L128 408 L132 402" stroke="#67E8F9" strokeWidth="1.6" fill="none" opacity="0.35" />
        <circle cx="128" cy="408" r="2.2" fill="#67E8F9" opacity="0.55" />

        <path
          d="M162 372 C160 398 159 420 159 434"
          stroke="#67E8F9"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.42"
        />
        <path
          d="M198 372 C200 398 201 420 201 434"
          stroke="#C4B5FD"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
        <rect x="157" y="431" width="4" height="8" rx="2" fill="#8B5CF6" opacity="0.75" />
        <rect x="199" y="431" width="4" height="8" rx="2" fill="#67E8F9" opacity="0.5" />

        <path
          d="M180 380 C181.5 387.5 184.5 390.5 192 392 C184.5 393.5 181.5 396.5 180 404 C178.5 396.5 175.5 393.5 168 392 C175.5 390.5 178.5 387.5 180 380Z"
          fill="#8B5CF6"
          opacity="0.8"
        />
        <path d="M169 414 L191 414" stroke="#A78BFA" strokeWidth="1.4" opacity="0.3" />
        <path d="M172 419 L188 419" stroke="#A78BFA" strokeWidth="1.2" opacity="0.2" />
      </motion.g>

      <path
        d="M159 242 L201 242 L205 314 C196 329 164 329 155 314 Z"
        fill={`url(#${uid}-skin)`}
      />
      <path
        d="M155 248 C165 272 195 272 205 248 L205 268 C195 292 165 292 155 268 Z"
        fill="#C48A7D"
        opacity="0.28"
      />

      <path
        d="M128 326 C139 310 158 304 180 336 L159 366 L126 344 Z"
        fill="#202536"
      />
      <path
        d="M232 326 C221 310 202 304 180 336 L201 366 L234 344 Z"
        fill="#1B202E"
      />
      <path d="M133 326 L180 348 L155 360" stroke="#8B5CF6" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M227 326 L180 348 L205 360" stroke="#A78BFA" strokeWidth="1.5" fill="none" opacity="0.28" />

      <path
        d="M137 307 C143 346 217 346 223 307"
        stroke="#6D4BD6"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <g transform="rotate(-9 133 354)">
        <rect x="117" y="333" width="32" height="45" rx="15" fill="#241B3A" stroke="#8B5CF6" strokeWidth="1.7" />
        <rect x="125" y="343" width="16" height="25" rx="8" fill="#A78BFA" opacity="0.16" />
        <circle cx="133" cy="355" r="3" fill="#67E8F9" opacity="0.75" />
      </g>
      <g transform="rotate(9 227 354)">
        <rect x="211" y="333" width="32" height="45" rx="15" fill="#241B3A" stroke="#8B5CF6" strokeWidth="1.7" />
        <rect x="219" y="343" width="16" height="25" rx="8" fill="#A78BFA" opacity="0.16" />
        <circle cx="227" cy="355" r="3" fill="#67E8F9" opacity="0.75" />
      </g>

      <path
        d="M161 283 C169 289 191 289 199 283"
        stroke="#16111F"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M180 289 C181 292.5 183.5 295 187 296 C183.5 296.8 181 299.3 180 303 C179 299.3 176.5 296.8 173 296 C176.5 295 179 292.5 180 289Z"
        fill="#67E8F9"
        opacity="0.9"
      />

      <motion.g
        animate={headAnimate}
        transition={headTransition}
        style={{ transformBox: 'view-box', transformOrigin: '180px 238px' }}
      >
        <path
          d="M104 158 C96 96 128 54 180 50 C232 54 264 96 256 158 L266 260 C268 298 252 324 234 332 L228 270 C226 236 220 212 212 188 L148 188 C140 212 134 236 132 270 L126 332 C108 324 92 298 94 260 Z"
          fill={`url(#${uid}-hair)`}
        />
        <path
          d="M118 270 C116 298 120 320 126 332 C108 324 92 298 94 260 L104 158 C100 214 110 248 118 270 Z"
          fill="#0F0B18"
          opacity="0.5"
        />
        <path
          d="M246 158 C252 206 250 244 244 276 C250 294 250 318 234 332 L228 270 C234 228 236 196 246 158 Z"
          fill="#67E8F9"
          opacity="0.045"
        />
        <path
          d="M142 92 C160 74 196 70 218 88"
          stroke="#6E579B"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />

        <path
          d="M128 174 C116 166 108 177 112 192 C116 206 124 210 132 203 Z"
          fill={`url(#${uid}-skin)`}
        />
        <path
          d="M232 174 C244 166 252 177 248 192 C244 206 236 210 228 203 Z"
          fill={`url(#${uid}-skin)`}
        />
        <path d="M123 181 C127 184 129 189 127 195" stroke="#C88F82" strokeWidth="1.3" fill="none" opacity="0.8" />
        <path d="M237 181 C233 184 231 189 233 195" stroke="#C88F82" strokeWidth="1.3" fill="none" opacity="0.8" />

        <path
          d="M126 138 C126 98 145 76 180 76 C215 76 234 98 234 138 L234 180 C234 228 212 258 180 268 C148 258 126 228 126 180 Z"
          fill={`url(#${uid}-skin)`}
        />
        <path
          d="M206 104 C224 124 228 166 222 200 C216 232 201 254 180 268 C209 254 228 224 230 186 C232 154 223 124 206 104 Z"
          fill="#C9887B"
          opacity="0.16"
        />
        <ellipse cx="112" cy="192" rx="16" ry="20" fill="#D99E90" opacity="0.12" filter={`url(#${uid}-soft)`} />
        <path d="M151 258 C162 265 198 265 209 258" stroke="#D49788" strokeWidth="1.2" fill="none" opacity="0.5" />

        <path
          d="M116 150 C108 102 134 60 180 56 C226 60 252 102 244 150 C234 132 228 116 220 100 C214 122 202 138 188 150 C184 128 178 110 170 94 C158 118 142 138 116 150 Z"
          fill={`url(#${uid}-hair)`}
        />
        <path
          d="M116 150 C114 180 120 204 134 224 C126 193 130 166 143 144 C134 149 125 151 116 150 Z"
          fill={`url(#${uid}-hair)`}
        />
        <path
          d="M244 150 C246 180 240 204 226 224 C234 193 230 166 217 144 C226 149 235 151 244 150 Z"
          fill={`url(#${uid}-hair)`}
        />
        <path
          d="M170 96 C162 122 150 142 133 158 C148 150 160 136 168 118 Z"
          fill="#35284F"
          opacity="0.85"
        />
        <path
          d="M220 100 C216 126 208 144 195 158 C209 148 218 132 225 112 Z"
          fill="#2A2042"
          opacity="0.9"
        />
        <path
          d="M221 99 C216 127 208 147 195 159 C207 142 214 122 218 102 Z"
          fill={`url(#${uid}-cyan)`}
          opacity="0.72"
        />
        <path
          d="M142 82 C158 71 176 66 194 69"
          stroke="#6E579B"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="0.38"
        />
        <path
          d="M232 120 C238 150 236 182 229 208"
          stroke="#7C5CFF"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M130 120 C125 152 127 186 135 212"
          stroke="#4F3B73"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.45"
        />
        <path
          d="M184 58 C190 40 206 38 210 48 C202 46 196 54 194 66"
          stroke={`url(#${uid}-hair)`}
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M130 148 C148 158 210 158 232 146 C226 168 208 178 180 178 C152 178 136 168 130 148 Z"
          fill="#0B0712"
          opacity="0.1"
        />

        {brows}

        {OPEN_EYES.has(mood) ? (
          <>
            <motion.g
              animate={{ scaleY: eyeScale }}
              transition={{ duration: mood === 'sleepy' ? 0.4 : 0.09 }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              <path
                d="M130 191 C133 176 144 169 155 175 C162 179 165 188 161 197 C156 207 144 208 136 201 C132 197 130 194 130 191 Z"
                fill="#FBF8FF"
              />
              <g clipPath={`url(#${uid}-eye-left)`}>
                <motion.g style={{ x: lookX, y: lookY }}>
                  <ellipse cx="150" cy="192" rx="10.4" ry="13.2" fill={`url(#${uid}-iris)`} />
                  <ellipse cx="150" cy="195" rx="4.4" ry="6.3" fill="#2A1745" />
                  <circle cx="146.4" cy="186.5" r="3.7" fill="#FFFFFF" opacity="0.95" />
                  <circle cx="154" cy="198.2" r="1.6" fill="#FFFFFF" opacity="0.8" />
                  <path
                    d="M141 200.5 C146 205 154 205 159 199"
                    stroke="#67E8F9"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.55"
                  />
                </motion.g>
              </g>
              <path
                d="M128 188 C133 171 148 165 161 177 L165 173"
                stroke="#171322"
                strokeWidth="4.4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M136 203 C143 209 154 208 160 199"
                stroke="#171322"
                strokeWidth="1.3"
                strokeLinecap="round"
                fill="none"
                opacity="0.55"
              />
              <path
                d="M135 176 C144 170 154 172 161 180"
                stroke="#B97C72"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
                opacity="0.55"
              />
            </motion.g>

            <motion.g
              animate={{ scaleY: eyeScale }}
              transition={{ duration: mood === 'sleepy' ? 0.4 : 0.09 }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              <path
                d="M230 191 C227 176 216 169 205 175 C198 179 195 188 199 197 C204 207 216 208 224 201 C228 197 230 194 230 191 Z"
                fill="#FBF8FF"
              />
              <g clipPath={`url(#${uid}-eye-right)`}>
                <motion.g style={{ x: lookX, y: lookY }}>
                  <ellipse cx="210" cy="192" rx="10.4" ry="13.2" fill={`url(#${uid}-iris)`} />
                  <ellipse cx="210" cy="195" rx="4.4" ry="6.3" fill="#2A1745" />
                  <circle cx="206.4" cy="186.5" r="3.7" fill="#FFFFFF" opacity="0.95" />
                  <circle cx="214" cy="198.2" r="1.6" fill="#FFFFFF" opacity="0.8" />
                  <path
                    d="M201 200.5 C206 205 214 205 219 199"
                    stroke="#67E8F9"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.55"
                  />
                </motion.g>
              </g>
              <path
                d="M232 188 C227 171 212 165 199 177 L195 173"
                stroke="#171322"
                strokeWidth="4.4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M224 203 C217 209 206 208 200 199"
                stroke="#171322"
                strokeWidth="1.3"
                strokeLinecap="round"
                fill="none"
                opacity="0.55"
              />
              <path
                d="M225 176 C216 170 206 172 199 180"
                stroke="#B97C72"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
                opacity="0.55"
              />
            </motion.g>
          </>
        ) : (
          <g stroke="#171322" strokeWidth="3.8" strokeLinecap="round" fill="none">
            <path d="M131 194 C140 182 152 182 161 194" />
            <path d="M199 194 C208 182 220 182 229 194" />
            <path d="M131 194 L126 190" strokeWidth="2.4" />
            <path d="M229 194 L234 190" strokeWidth="2.4" />
          </g>
        )}

        <ellipse cx="138" cy="219" rx="15" ry="8" fill={`url(#${uid}-blush)`} />
        <ellipse cx="222" cy="219" rx="15" ry="8" fill={`url(#${uid}-blush)`} />

        <path
          d="M178 208 C182 211.5 182 216 177 218"
          stroke="#C9887B"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <circle cx="172" cy="218" r="0.9" fill="#B8786D" opacity="0.45" />
        <circle cx="176" cy="221" r="0.8" fill="#B8786D" opacity="0.38" />
        <circle cx="187" cy="220" r="0.8" fill="#B8786D" opacity="0.34" />

        {mood === 'cheer' ? (
          <g>
            <path
              d="M161 232 C169 253 191 253 199 232 C191 239 169 239 161 232 Z"
              fill="#5B2338"
            />
            <path
              d="M170 238 C176 241 184 241 190 238 C187 247 173 247 170 238 Z"
              fill="#E889A0"
            />
            <path d="M166 235 C174 238 186 238 194 235" stroke="#F3C0CA" strokeWidth="1.6" fill="none" opacity="0.55" />
          </g>
        ) : mood === 'happy' ? (
          <g>
            <path d="M166 235 C173 246 187 246 194 235" stroke="#8E4E56" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M172 239 C176 241 184 241 188 239" stroke="#E8A0AF" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.6" />
          </g>
        ) : mood === 'concerned' ? (
          <path d="M168 241 C175 234 185 234 192 241" stroke="#8E4E56" strokeWidth="3" strokeLinecap="round" fill="none" />
        ) : mood === 'sleepy' ? (
          <path d="M172 238 C176 241 184 241 188 238" stroke="#8E4E56" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        ) : mood === 'focus' ? (
          <path d="M169 238 C175 242 185 242 191 238" stroke="#8E4E56" strokeWidth="2.9" strokeLinecap="round" fill="none" />
        ) : (
          <g>
            <path d="M167 237 C174 243 186 243 193 237" stroke="#8E4E56" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M173 240 C177 242 183 242 187 240" stroke="#E8A0AF" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.45" />
          </g>
        )}

        <circle cx="244" cy="207" r="5" stroke="#67E8F9" strokeWidth="2" fill="none" opacity="0.85" />
        <circle cx="244" cy="200" r="1.6" fill="#C4B5FD" opacity="0.9" />

        <path
          d="M126 150 C122 190 128 226 146 252"
          stroke="#67E8F9"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.16"
        />
        <path
          d="M234 148 C238 188 230 226 212 250"
          stroke="#A78BFA"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
          opacity="0.25"
        />
        <path
          d="M132 300 C130 318 126 332 120 344 C134 330 142 316 145 304 Z"
          fill={`url(#${uid}-hair)`}
          opacity="0.96"
        />
        <path
          d="M228 300 C230 318 234 332 240 344 C226 330 218 316 215 304 Z"
          fill={`url(#${uid}-hair)`}
          opacity="0.96"
        />
      </motion.g>

      <g aria-hidden="true">
        <path
          d="M290 92 C291.2 98.6 293.4 100.8 300 102 C293.4 103.2 291.2 105.4 290 112 C288.8 105.4 286.6 103.2 280 102 C286.6 100.8 288.8 98.6 290 92Z"
          fill="#67E8F9"
          opacity="0.7"
        />
        <circle cx="67" cy="156" r="2.6" fill="#A78BFA" opacity="0.7" />
        <path d="M72 278 L72 292 M65 285 L79 285" stroke="#A78BFA" strokeWidth="1.4" opacity="0.35" />
      </g>

      <AnimatePresence>
        {mood === 'cheer' ? (
          <motion.g
            key="sparkles"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={SPRING}
            style={{ transformBox: 'view-box', transformOrigin: '180px 170px' }}
          >
            <motion.g
              animate={{ y: [0, -5, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            >
              <Sparkle x={282} y={140} size={11} color="#67E8F9" />
              <Sparkle x={76} y={120} size={8} color="#A78BFA" opacity={0.85} />
            </motion.g>
            <motion.g
              animate={{ y: [0, 4, 0], rotate: [0, -8, 0] }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
            >
              <Sparkle x={296} y={196} size={6} color="#C4B5FD" opacity={0.8} />
              <Sparkle x={64} y={214} size={7} color="#67E8F9" opacity={0.65} />
            </motion.g>
          </motion.g>
        ) : null}
      </AnimatePresence>
    </svg>
  );
}
