import { useState, useEffect, useRef } from "react";

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #13120f;
    --bg2:     #171610;
    --bg3:     #1c1a13;
    --surface: #201e16;
    --border:  #2a2720;
    --border2: #333026;
    --text:    #e2ddd4;
    --text2:   #b5af9f;
    --muted:   #6b6456;
    --accent:  #c9a96e;
    --accent2: #a8854a;
    --accent-dim: rgba(201,169,110,0.07);
    --serif: 'Playfair Display', Georgia, serif;
    --sans:  'Inter', system-ui, sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    overflow-x: hidden;
    cursor: none;
    -webkit-font-smoothing: antialiased;
  }

  /* LOFI GRAIN + VIGNETTE */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 1000;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E");
    opacity: 0.055;
    mix-blend-mode: overlay;
  }
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 999;
    pointer-events: none;
    background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%);
  }

  .lofi-bg {
    position: fixed; inset: 0; z-index: -1;
    background:
      radial-gradient(ellipse 80% 60% at 15% 85%, rgba(120,90,40,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 85% 20%, rgba(80,70,50,0.10) 0%, transparent 55%),
      #13120f;
  }
  .lofi-lines {
    position: fixed; inset: 0; z-index: -1;
    background-image: repeating-linear-gradient(
      0deg, transparent, transparent 3px,
      rgba(255,255,255,0.007) 3px, rgba(255,255,255,0.007) 4px
    );
  }

  /* CURSOR */
  .cursor {
    position: fixed; width: 6px; height: 6px;
    background: var(--accent); border-radius: 50%;
    pointer-events: none; z-index: 9999;
  }
  .cursor-ring {
    position: fixed; width: 30px; height: 30px;
    border: 1px solid rgba(201,169,110,0.3); border-radius: 50%;
    pointer-events: none; z-index: 9998;
    transition: all 0.2s ease;
  }

  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--muted); }

  /* NAV */
  nav {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 500; display: flex;
    justify-content: space-between; align-items: center;
    padding: 24px 64px; transition: all 0.4s;
  }
  nav.scrolled {
    background: rgba(19,18,15,0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    font-family: var(--serif); font-size: 18px;
    font-weight: 400; font-style: italic;
    color: var(--text); text-decoration: none;
  }
  .nav-links { display: flex; gap: 40px; list-style: none; }
  .nav-links a {
    font-family: var(--sans); font-size: 13px;
    font-weight: 400; color: var(--muted);
    text-decoration: none; letter-spacing: 0.3px;
    transition: color 0.3s; position: relative;
  }
  .nav-links a::after {
    content: ''; position: absolute;
    bottom: -3px; left: 0; width: 0; height: 1px;
    background: var(--accent); transition: width 0.35s ease;
  }
  .nav-links a:hover { color: var(--text2); }
  .nav-links a:hover::after { width: 100%; }

  /* HERO */
  .hero {
    min-height: 100vh; display: flex;
    align-items: flex-end; padding: 0 64px 100px;
    position: relative; overflow: hidden;
  }
  .hero-content { position: relative; z-index: 2; width: 100%; }
  .hero-eyebrow {
    font-family: var(--sans); font-size: 13px;
    font-weight: 400; color: var(--accent);
    letter-spacing: 3px; text-transform: uppercase;
    margin-bottom: 28px; display: flex;
    align-items: center; gap: 14px;
    opacity: 0; animation: fadeUp 0.9s 0.2s forwards;
  }
  .hero-eyebrow::before {
    content: ''; width: 28px; height: 1px;
    background: var(--accent); opacity: 0.6;
  }
  .hero-name {
    font-family: var(--serif);
    font-size: clamp(68px, 9.5vw, 136px);
    font-weight: 500; font-style: italic;
    line-height: 0.92; letter-spacing: -1px;
    color: var(--text); margin-bottom: 44px;
    opacity: 0; animation: fadeUp 0.9s 0.35s forwards;
  }
  .hero-name span {
    display: block; font-style: normal;
    font-weight: 400; font-size: 0.42em;
    color: var(--text2); letter-spacing: 3px;
    text-transform: uppercase; font-family: var(--sans);
    margin-top: 16px;
  }
  .hero-bottom {
    display: flex; justify-content: space-between;
    align-items: flex-end; flex-wrap: wrap; gap: 32px;
    opacity: 0; animation: fadeUp 0.9s 0.55s forwards;
  }
  .hero-desc {
    font-family: var(--sans); font-size: 15px;
    font-weight: 300; color: var(--muted);
    line-height: 1.85; max-width: 380px;
  }
  .hero-cta { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }
  .btn-primary {
    padding: 14px 36px; background: var(--accent);
    color: #13120f; font-family: var(--sans);
    font-size: 13px; font-weight: 500;
    border: none; cursor: none; text-decoration: none;
    display: inline-block; transition: all 0.3s;
  }
  .btn-primary:hover { background: var(--text); transform: translateY(-2px); }
  .btn-outline {
    padding: 13px 36px; background: transparent;
    color: var(--text2); font-family: var(--sans);
    font-size: 13px; font-weight: 400;
    border: 1px solid var(--border2); cursor: none;
    text-decoration: none; display: inline-block;
    transition: all 0.3s;
  }
  .btn-outline:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }

  .hero-scroll {
    position: absolute; bottom: 100px; right: 64px;
    display: flex; flex-direction: column;
    align-items: center; gap: 10px; z-index: 2;
    opacity: 0; animation: fadeIn 1s 1s forwards;
  }
  .hero-scroll span {
    font-family: var(--sans); font-size: 9px;
    font-weight: 400; color: var(--muted);
    letter-spacing: 3px; text-transform: uppercase;
    writing-mode: vertical-rl;
  }
  .scroll-line {
    width: 1px; height: 52px;
    background: linear-gradient(var(--muted), transparent);
    animation: scrollLine 2.5s infinite;
  }

  /* SECTIONS */
  section { padding: 128px 64px; position: relative; z-index: 2; }
  .section-eyebrow {
    font-family: var(--sans); font-size: 11px;
    font-weight: 500; color: var(--accent);
    letter-spacing: 4px; text-transform: uppercase;
    margin-bottom: 16px; display: flex;
    align-items: center; gap: 12px; opacity: 0.8;
  }
  .section-eyebrow::before {
    content: ''; width: 20px; height: 1px;
    background: var(--accent); opacity: 0.5;
  }
  .section-title {
    font-family: var(--serif);
    font-size: clamp(38px, 5vw, 64px);
    font-weight: 500; font-style: italic;
    letter-spacing: -0.5px; line-height: 1.05;
    margin-bottom: 72px; color: var(--text);
  }

  /* ABOUT */
  .about-grid {
    display: grid; grid-template-columns: 1.4fr 0.6fr;
    gap: 100px; align-items: start;
  }
  .about-text {
    font-family: var(--sans); font-size: 17px;
    font-weight: 300; color: var(--text2); line-height: 1.9;
  }
  .about-text p { margin-bottom: 22px; }
  .about-text strong { color: var(--text); font-weight: 500; }
  .about-stats {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1px; background: var(--border);
  }
  .stat { background: var(--bg2); padding: 30px 24px; transition: background 0.35s; }
  .stat:hover { background: var(--accent-dim); }
  .stat-num {
    font-family: var(--serif); font-size: 48px;
    font-weight: 400; font-style: italic;
    color: var(--accent); letter-spacing: -1px; line-height: 1;
  }
  .stat-label {
    font-family: var(--sans); font-size: 11px;
    font-weight: 400; color: var(--muted);
    letter-spacing: 1.5px; text-transform: uppercase; margin-top: 8px;
  }

  /* SKILLS */
  .skills-bg { background: rgba(23,22,16,0.7); }
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1px; background: var(--border);
  }
  .skill-card {
    background: var(--bg2); padding: 44px 36px;
    transition: background 0.4s; position: relative; overflow: hidden;
  }
  .skill-card::before {
    content: ''; position: absolute; top: 0; left: 0;
    width: 1px; height: 0; background: var(--accent);
    transition: height 0.5s ease; opacity: 0.7;
  }
  .skill-card:hover { background: var(--bg3); }
  .skill-card:hover::before { height: 100%; }
  .skill-icon { font-size: 22px; margin-bottom: 20px; display: block; opacity: 0.7; }
  .skill-name {
    font-family: var(--serif); font-size: 22px;
    font-weight: 500; font-style: italic;
    margin-bottom: 12px; color: var(--text);
  }
  .skill-desc {
    font-family: var(--sans); font-size: 14px;
    font-weight: 300; color: var(--muted); line-height: 1.8;
  }
  .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 20px; }
  .tag {
    font-family: var(--sans); font-size: 11px;
    font-weight: 400; padding: 4px 12px;
    background: transparent; color: var(--muted);
    letter-spacing: 0.3px; border: 1px solid var(--border2);
    transition: all 0.3s;
  }
  .skill-card:hover .tag { color: var(--text2); border-color: rgba(201,169,110,0.2); }

  /* PROJECTS */
  .projects-list { display: flex; flex-direction: column; gap: 1px; background: var(--border); }
  .project-item {
    background: var(--bg); padding: 52px 64px;
    display: grid; grid-template-columns: 1fr auto;
    gap: 48px; align-items: center; transition: background 0.4s;
    cursor: none; position: relative; overflow: hidden;
    text-decoration: none; color: inherit;
  }
  .project-item::before {
    content: ''; position: absolute; top: 0; left: 0;
    width: 1px; height: 0; background: var(--accent);
    transition: height 0.5s ease; opacity: 0.7;
  }
  .project-item:hover { background: var(--accent-dim); }
  .project-item:hover::before { height: 100%; }
  .project-num {
    font-family: var(--sans); font-size: 11px;
    font-weight: 400; color: var(--muted);
    letter-spacing: 2px; margin-bottom: 12px; text-transform: uppercase;
  }
  .project-name {
    font-family: var(--serif); font-size: 30px;
    font-weight: 500; font-style: italic;
    margin-bottom: 12px; color: var(--text); line-height: 1.1;
  }
  .project-desc {
    font-family: var(--sans); font-size: 14px;
    font-weight: 300; color: var(--muted);
    line-height: 1.85; max-width: 560px; margin-bottom: 20px;
  }
  .project-tech { display: flex; gap: 8px; flex-wrap: wrap; }
  .tech-tag {
    font-family: var(--sans); font-size: 11px;
    font-weight: 400; padding: 4px 12px;
    border: 1px solid var(--border2); color: var(--text2);
  }
  .project-arrow { font-size: 22px; color: var(--muted); transition: all 0.3s; flex-shrink: 0; }
  .project-item:hover .project-arrow { color: var(--accent); transform: translate(3px,-3px); }

  /* EXPERIENCE */
  .exp-bg { background: rgba(23,22,16,0.6); }
  .exp-timeline { position: relative; max-width: 800px; }
  .exp-timeline::before {
    content: ''; position: absolute;
    left: 0; top: 10px; bottom: 0; width: 1px;
    background: linear-gradient(var(--border2), transparent);
  }
  .exp-item { padding-left: 52px; padding-bottom: 64px; position: relative; }
  .exp-item::before {
    content: ''; position: absolute; left: -3px; top: 10px;
    width: 7px; height: 7px; background: transparent;
    border: 1px solid var(--accent); border-radius: 50%;
  }
  .exp-period {
    font-family: var(--sans); font-size: 11px;
    font-weight: 400; color: var(--accent);
    letter-spacing: 2px; margin-bottom: 8px;
    text-transform: uppercase; opacity: 0.8;
  }
  .exp-role {
    font-family: var(--serif); font-size: 26px;
    font-weight: 500; font-style: italic;
    margin-bottom: 4px; color: var(--text); line-height: 1.2;
  }
  .exp-company {
    font-family: var(--sans); font-size: 13px;
    font-weight: 400; color: var(--muted); margin-bottom: 16px;
  }
  .exp-desc {
    font-family: var(--sans); font-size: 15px;
    font-weight: 300; color: var(--text2); line-height: 1.85;
  }
  .exp-projects { margin-top: 20px; display: flex; flex-direction: column; gap: 12px; }
  .exp-project-tag {
    display: inline-flex; align-items: flex-start;
    gap: 10px; font-family: var(--sans); font-size: 13px;
    font-weight: 300; color: var(--text2); line-height: 1.6;
  }
  .exp-project-tag::before {
    content: '→'; color: var(--accent);
    font-size: 12px; margin-top: 2px; flex-shrink: 0; opacity: 0.7;
  }

  /* CONTACT */
  .contact-inner { max-width: 740px; }
  .contact-big {
    font-family: var(--serif);
    font-size: clamp(44px, 6.5vw, 88px);
    font-weight: 500; font-style: italic;
    letter-spacing: -1px; line-height: 1.0;
    margin-bottom: 32px; color: var(--text);
  }
  .contact-big span { color: var(--accent); }
  .contact-desc {
    font-family: var(--sans); font-size: 16px;
    font-weight: 300; color: var(--muted);
    line-height: 1.85; margin-bottom: 48px; max-width: 440px;
  }
  .contact-links { display: flex; gap: 14px; flex-wrap: wrap; }
  .contact-link {
    font-family: var(--sans); font-size: 13px;
    font-weight: 400; padding: 13px 28px;
    border: 1px solid var(--border2); color: var(--text2);
    text-decoration: none; letter-spacing: 0.3px;
    transition: all 0.3s; display: flex; align-items: center; gap: 8px;
  }
  .contact-link:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }

  /* FOOTER */
  footer {
    padding: 28px 64px; border-top: 1px solid var(--border);
    display: flex; justify-content: space-between;
    align-items: center; position: relative; z-index: 2;
  }
  footer p {
    font-family: var(--sans); font-size: 12px;
    font-weight: 300; color: var(--muted); letter-spacing: 0.3px;
  }
  .footer-dot { width: 5px; height: 5px; background: var(--accent); border-radius: 50%; opacity: 0.5; }

  /* ANIMATIONS */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scrollLine {
    0%   { transform: scaleY(0); transform-origin: top; }
    50%  { transform: scaleY(1); transform-origin: top; }
    51%  { transform: scaleY(1); transform-origin: bottom; }
    100% { transform: scaleY(0); transform-origin: bottom; }
  }
  .fade-in-section {
    opacity: 0; transform: translateY(28px);
    transition: opacity 0.9s ease, transform 0.9s ease;
  }
  .fade-in-section.visible { opacity: 1; transform: translateY(0); }

  /* ── MUSIC PLAYER ── */
  .music-player {
    position: fixed;
    bottom: 28px; left: 28px;
    z-index: 800;
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(19,18,15,0.92);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border2);
    padding: 12px 16px;
    transition: border-color 0.4s ease;
    max-width: 260px;
  }
  .music-player:hover { border-color: rgba(201,169,110,0.3); }
  .music-player.playing {
    animation: playerBlink 2.5s ease-in-out infinite;
  }
  @keyframes playerBlink {
    0%, 100% { border-color: rgba(201,169,110,0.15); box-shadow: 0 0 0px rgba(201,169,110,0); }
    50%       { border-color: rgba(201,169,110,0.55); box-shadow: 0 0 10px rgba(201,169,110,0.12); }
  }

  .music-vinyl {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: radial-gradient(circle at center,
      #1a1810 0%, #1a1810 25%,
      #2a2520 26%, #2a2520 45%,
      #1e1c14 46%, #1e1c14 65%,
      #252218 66%, #252218 85%,
      #1a1810 86%
    );
    border: 1px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform 0.1s linear;
  }
  .music-vinyl.spinning {
    animation: spin 3s linear infinite;
  }
  .music-vinyl::after {
    content: '';
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--accent);
    opacity: 0.8;
  }

  .music-info { flex: 1; min-width: 0; }
  .music-title {
    font-family: var(--sans);
    font-size: 11px; font-weight: 400;
    color: var(--text2); white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis;
    letter-spacing: 0.3px;
  }
  .music-status {
    font-family: var(--sans);
    font-size: 9px; font-weight: 300;
    color: var(--muted); letter-spacing: 1px;
    text-transform: uppercase; margin-top: 2px;
  }

  .music-controls { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .music-btn {
    background: none; border: none; cursor: none;
    color: var(--muted); font-size: 14px;
    padding: 4px; transition: color 0.2s;
    display: flex; align-items: center; justify-content: center;
    line-height: 1;
  }
  .music-btn:hover { color: var(--accent); }
  .music-btn.play-btn {
    width: 28px; height: 28px;
    border: 1px solid var(--border2);
    border-radius: 50%;
    font-size: 11px;
    transition: all 0.2s;
  }
  .music-btn.play-btn:hover {
    border-color: var(--accent);
    background: var(--accent-dim);
  }

  .music-volume {
    display: flex; align-items: center; gap: 6px;
  }
  .volume-icon { font-size: 11px; color: var(--muted); }
  .volume-slider {
    -webkit-appearance: none;
    width: 52px; height: 2px;
    background: var(--border2);
    border-radius: 2px; outline: none; cursor: none;
  }
  .volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--accent);
    cursor: none;
  }
  .volume-slider::-moz-range-thumb {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--accent);
    border: none; cursor: none;
  }

  .equalizer {
    display: flex; align-items: flex-end;
    gap: 2px; height: 14px;
  }
  .eq-bar {
    width: 2px; background: var(--accent);
    border-radius: 1px; opacity: 0.7;
    animation: none;
  }
  .eq-bar.active:nth-child(1) { animation: eq1 0.6s ease-in-out infinite alternate; }
  .eq-bar.active:nth-child(2) { animation: eq2 0.5s ease-in-out infinite alternate; }
  .eq-bar.active:nth-child(3) { animation: eq3 0.7s ease-in-out infinite alternate; }
  .eq-bar.active:nth-child(4) { animation: eq2 0.4s ease-in-out infinite alternate; }

  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes eq1 { from { height: 3px; } to { height: 13px; } }
  @keyframes eq2 { from { height: 6px; } to { height: 10px; } }
  @keyframes eq3 { from { height: 2px; } to { height: 14px; } }

  @media (max-width: 768px) {
    .music-player { bottom: 20px; left: 16px; right: 16px; max-width: none; padding: 10px 14px; }
    .volume-slider { width: 60px; }
  }


  /* ── MUSIC HINT TOAST ── */
  .music-hint {
    position: fixed;
    bottom: 100px; left: 28px;
    z-index: 800;
    background: rgba(19,18,15,0.95);
    border: 1px solid rgba(201,169,110,0.3);
    padding: 10px 16px;
    display: flex; align-items: center; gap: 10px;
    backdrop-filter: blur(16px);
    animation: hintSlideIn 0.4s ease forwards;
    max-width: 220px;
  }
  .music-hint-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent); flex-shrink: 0;
    animation: pulse2 1.5s ease-in-out infinite;
  }
  .music-hint p {
    font-family: var(--sans); font-size: 11px;
    font-weight: 300; color: var(--text2); line-height: 1.5;
  }
  .music-hint p span { color: var(--accent); }
  .music-hint-close {
    background: none; border: none; cursor: none;
    color: var(--muted); font-size: 14px; line-height: 1;
    flex-shrink: 0; transition: color 0.2s; padding: 0 2px;
  }
  .music-hint-close:hover { color: var(--text2); }
  @keyframes hintSlideIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse2 {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }
  @media (max-width: 768px) {
    .music-hint { bottom: 80px; left: 16px; right: 16px; max-width: none; }
  }

  /* ── HAMBURGER MENU ── */
  .hamburger {
    display: none; flex-direction: column; gap: 5px;
    cursor: none; padding: 4px; z-index: 600; background: none; border: none;
  }
  .hamburger span {
    display: block; width: 24px; height: 1.5px;
    background: var(--text2); transition: all 0.35s ease; transform-origin: center;
  }
  .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  .mobile-menu {
    display: none; position: fixed; inset: 0; z-index: 400;
    background: rgba(19,18,15,0.97); backdrop-filter: blur(24px);
    flex-direction: column; justify-content: center;
    align-items: center; gap: 36px;
    opacity: 0; pointer-events: none; transition: opacity 0.35s ease;
  }
  .mobile-menu.open { opacity: 1; pointer-events: all; }
  .mobile-menu a {
    font-family: var(--serif); font-size: 38px; font-weight: 400;
    font-style: italic; color: var(--text2); text-decoration: none;
    letter-spacing: -0.5px; transition: color 0.2s;
  }
  .mobile-menu a:hover { color: var(--accent); }

  /* ── MOBILE ── */
  @media (max-width: 768px) {
    body { cursor: auto; }
    .cursor, .cursor-ring { display: none; }

    nav { padding: 18px 24px; }
    .nav-links { display: none; }
    .hamburger { display: flex; }
    .mobile-menu { display: flex; }

    .hero { padding: 0 24px 64px; min-height: 100svh; }
    .hero-eyebrow { font-size: 10px; letter-spacing: 2px; margin-bottom: 20px; }
    .hero-name { font-size: clamp(46px, 13vw, 72px); margin-bottom: 32px; }
    .hero-name span { font-size: 0.36em; letter-spacing: 2px; margin-top: 12px; }
    .hero-bottom { flex-direction: column; align-items: flex-start; gap: 24px; }
    .hero-desc { font-size: 14px; max-width: 100%; }
    .hero-cta { width: 100%; gap: 10px; }
    .btn-primary, .btn-outline { padding: 13px 20px; font-size: 12px; flex: 1; text-align: center; display: flex; align-items: center; justify-content: center; }
    .hero-scroll { display: none; }

    section { padding: 72px 24px; }
    .section-eyebrow { font-size: 10px; }
    .section-title { font-size: clamp(30px, 9vw, 44px); margin-bottom: 40px; }

    .about-grid { grid-template-columns: 1fr; gap: 40px; }
    .about-text { font-size: 15px; }
    .stat { padding: 22px 16px; }
    .stat-num { font-size: 36px; }
    .stat-label { font-size: 9px; }

    .skills-grid { grid-template-columns: 1fr; }
    .skill-card { padding: 28px 22px; }
    .skill-name { font-size: 20px; }
    .skill-desc { font-size: 13px; }
    .tag { font-size: 10px; }

    .project-item { padding: 28px 22px; grid-template-columns: 1fr; gap: 16px; }
    .project-arrow { display: none; }
    .project-name { font-size: 22px; }
    .project-desc { font-size: 13px; }
    .tech-tag { font-size: 10px; }

    .exp-item { padding-left: 28px; padding-bottom: 44px; }
    .exp-role { font-size: 20px; }
    .exp-desc { font-size: 14px; }
    .exp-project-tag { font-size: 12px; }

    .contact-big { font-size: clamp(34px, 11vw, 56px); }
    .contact-desc { font-size: 14px; }
    .contact-links { flex-direction: column; gap: 10px; }
    .contact-link { justify-content: center; }

    footer { padding: 24px; flex-direction: column; gap: 10px; text-align: center; }
  }

  @media (max-width: 380px) {
    .hero-name { font-size: 40px; }
    .section-title { font-size: 28px; }
    .stat-num { font-size: 30px; }
  }
`;

const skills = [
  {
    icon: "📱",
    name: "Mobile Development",
    desc: "Cross-platform apps for iOS & Android using React Native with smooth native-like performance.",
    tags: ["React Native", "Expo", "Android", "iOS", "Realm", "Redux"],
  },
  {
    icon: "⚛️",
    name: "Frontend Web",
    desc: "Fast, accessible, and well-structured web interfaces using React.js and modern tooling.",
    tags: ["React JS", "Next.js", "JavaScript", "HTML/CSS", "Tailwind"],
  },
  {
    icon: "🔧",
    name: "Tools & Workflow",
    desc: "Solid experience with version control, APK generation, and collaborative development.",
    tags: ["Git", "GitHub", "Figma", "REST API", "Firebase", "Midtrans SDK"],
  },
  {
    icon: "📋",
    name: "Project Management",
    desc: "Experience coordinating teams, managing timelines, and bridging client communication to developers.",
    tags: ["Project Planning", "Client Coordination", "Timeline Management", "Documentation"],
  },
];

const projects = [
  {
    name: "Absensi Profitera Mobile",
    desc: "Mobile attendance app built with React Native for PT Asaba. Handles employee check-in/check-out with real-time data sync.",
    tech: ["React Native", "REST API", "Android", "iOS"],
    link: "#",
  },
  {
    name: "SPIR Paperless",
    desc: "Digital SPIR (Surat Perintah Ijin Risiko) system to replace paper-based workflows — built for internal operational use at PT Asaba.",
    tech: ["React Native", "React JS", "REST API"],
    link: "#",
  },
  {
    name: "HP x Samafitro MCO Web",
    desc: "Web application built for HP and Samafitro's Managed Contract Operations, streamlining contract monitoring and reporting.",
    tech: ["React JS", "REST API", "Web"],
    link: "#",
  },
  {
    name: "Warehouse Management System",
    desc: "Mobile WMS for PT Triputra Agro Persada Tbk — stock keeping and daily reporting with full offline capability using Realm database.",
    tech: ["React Native", "Realm", "Offline-first"],
    link: "#",
  },
  {
    name: "Smart Shrimp Marketplace",
    desc: "Mobile marketplace app for PT Central Proteina Prima with integrated Midtrans payment SDK for seamless transactions.",
    tech: ["React Native", "Midtrans SDK", "REST API"],
    link: "#",
  },
];

const experiences = [
  {
    period: "Dec 2021 — Present",
    role: "Front End Developer",
    company: "PT Asaba · Jakarta",
    desc: "Developing and maintaining enterprise mobile and web applications. Working across the full frontend lifecycle from UI implementation to API integration and deployment.",
    projects: [
      "Absensi Profitera Mobile — Employee attendance app for iOS & Android",
      "SPIR Paperless — Digital replacement for paper-based internal permit system",
      "HP x Samafitro MCO Web — Contract operations monitoring web platform",
    ],
  },
  {
    period: "Mar 2021 — Dec 2021",
    role: "Front End Developer & Project Manager",
    company: "PT Maelsov Mega Teknologi · Jakarta",
    desc: "Developed mobile apps using React Native and React.js. Also served as Project Manager for the Product Traceability app, coordinating between client and development team.",
    projects: [
      "Product Traceability App (PM) — CekOri app refactor using Swift for PT Paksina Lembayung Global",
      "Warehouse Management System (Mobile Dev) — React Native + Realm for PT Triputra Agro Persada",
      "Smart Shrimp Marketplace (Mobile Dev) — Midtrans SDK integration for PT Central Proteina Prima",
    ],
  },
  {
    period: "Aug 2019 — Jan 2021",
    role: "Android Developer",
    company: "PT Emas Persada Finance · Jakarta",
    desc: "Developed internal and customer-facing Android applications using React Native. Responsible for maintenance, bug fixing, and developing new features.",
    projects: [
      "Internal system development for operational workflows",
      "Maintenance, bug fixing, and feature improvements",
    ],
  },
];

function useScrollFade() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && el.classList.add("visible"),
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function FadeSection({ children, className = "" }) {
  const ref = useScrollFade();
  return <div ref={ref} className={`fade-in-section ${className}`}>{children}</div>;
}


function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume]   = useState(0.6);
  const [loaded, setLoaded]   = useState(false);
  const [error, setError]     = useState(null);
  const [showHint, setShowHint] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.loop   = true;

    const onError = (e) => {
      console.error("Audio error:", e, audio.error);
      setError("File not found");
    };
    const onEnded = () => setPlaying(false);

    const tryAutoplay = () => {
      if (!audioRef.current) return;
      audioRef.current.play()
        .then(() => { setPlaying(true); setShowHint(false); })
        .catch(() => {});
    };

    const onCanPlay = () => {
      setLoaded(true);
      setShowHint(true);
      // Only click/touch can trigger autoplay per browser policy
      document.addEventListener("click",     tryAutoplay, { once: true });
      document.addEventListener("touchstart", tryAutoplay, { once: true });
    };

    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("error", onError);
    audio.addEventListener("ended", onEnded);
    audio.load();

    return () => {
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
      document.removeEventListener("click",      tryAutoplay);
      document.removeEventListener("touchstart",  tryAutoplay);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play()
        .then(() => setPlaying(true))
        .catch(err => {
          console.error("Play failed:", err);
          setError("Click to play");
        });
    }
  };

  if (error) {
    return (
      <div className="music-player" style={{ cursor: "default" }}>
        <div className="music-vinyl" />
        <div className="music-info">
          <div className="music-title">Lofi Chill</div>
          <div className="music-status" style={{ color: "#c97070" }}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className={`music-player${playing ? " playing" : ""}`}>
      <audio ref={audioRef} src={process.env.PUBLIC_URL + "/music/lofi.mp3"} preload="auto" />

      <div className={`music-vinyl${playing ? " spinning" : ""}`} />

      <div className="music-info">
        <div className="music-title">Lofi Chill</div>
        <div className="music-status">
          {!loaded ? "Loading..." : playing ? "Now Playing" : "Paused"}
        </div>
      </div>

      <div className="equalizer">
        {[3, 8, 5, 11].map((h, i) => (
          <div
            key={i}
            className={`eq-bar${playing ? " active" : ""}`}
            style={{ height: playing ? undefined : h + "px" }}
          />
        ))}
      </div>

      <div className="music-controls">
        <div className="music-volume">
          <span className="volume-icon">{volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}</span>
          <input
            type="range" className="volume-slider"
            min="0" max="1" step="0.05"
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
          />
        </div>
        <button
          className="music-btn play-btn"
          onClick={toggle}
          disabled={!loaded}
          style={{ opacity: loaded ? 1 : 0.4 }}
        >
          {playing ? "⏸" : "▶"}
        </button>
      </div>
    </div>

      {/* Hint toast */}
      {showHint && !playing && (
        <div className="music-hint">
          <div className="music-hint-dot" />
          <p>Click anywhere to start <span>lofi music</span> 🎵</p>
          <button className="music-hint-close" onClick={() => setShowHint(false)}>×</button>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [cursor, setCursor]       = useState({ x: 0, y: 0 });
  const [ring, setRing]           = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    let raf, rx = 0, ry = 0;
    const fn = (e) => {
      setCursor({ x: e.clientX, y: e.clientY });
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        rx += (e.clientX - rx) * 0.1;
        ry += (e.clientY - ry) * 0.1;
        setRing({ x: rx, y: ry });
      });
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="lofi-bg" />
      <div className="lofi-lines" />

      <MusicPlayer />

      <div className="cursor" style={{ left: cursor.x - 3, top: cursor.y - 3 }} />
      <div className="cursor-ring" style={{ left: ring.x - 15, top: ring.y - 15 }} />

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {["about", "skills", "projects", "experience", "contact"].map(s => (
          <a key={s} href={`#${s}`} onClick={() => setMenuOpen(false)}>{s}</a>
        ))}
      </div>

      {/* Nav */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#" className="nav-logo">Leonardo.</a>
        <ul className="nav-links">
          {["about", "skills", "projects", "experience", "contact"].map(s => (
            <li key={s}><a href={`#${s}`}>{s}</a></li>
          ))}
        </ul>
        <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-eyebrow">React Native &amp; React JS Developer</div>
          <h1 className="hero-name">
            Leonardo.
            <span>PT Asaba · Open to Exciting Offers</span>
          </h1>
          <div className="hero-bottom">
            <p className="hero-desc">
              Currently building enterprise apps at PT Asaba.
              Passionate about clean code, great UX, and
              meaningful products — open to the right opportunity.
            </p>
            <div className="hero-cta">
              <a href="#projects" className="btn-primary">View Projects</a>
              <a href="#contact" className="btn-outline">Get In Touch</a>
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>scroll</span>
        </div>
      </section>

      {/* About */}
      <section id="about">
        <FadeSection>
          <div className="section-eyebrow">About</div>
          <h2 className="section-title">Who I am.</h2>
          <div className="about-grid">
            <div className="about-text">
              <p>
                I'm <strong>Leonardo</strong>, a Front End Developer based in Jakarta with a
                background in both <strong>Information Technology</strong> and{" "}
                <strong>Accounting</strong>. I specialize in building mobile and web applications
                using <strong>React Native</strong> and <strong>React.js</strong>.
              </p>
              <p>
                Currently working at <strong>PT Asaba</strong>, where I develop enterprise-grade
                apps including mobile attendance systems and internal operational tools. I've also
                contributed as a <strong>Project Manager</strong> — coordinating clients,
                timelines, and development teams.
              </p>
              <p>
                I value clean architecture, good UI, and working on products that actually matter.
                Open to <strong>exciting new opportunities</strong> that challenge me to grow.
              </p>
            </div>
            <div className="about-stats">
              {[
                { num: "5+",  label: "Years Experience" },
                { num: "8+",  label: "Projects Shipped"  },
                { num: "3",   label: "Companies"         },
                { num: "2",   label: "Degrees"           },
              ].map(s => (
                <div className="stat" key={s.label}>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>
      </section>

      {/* Skills */}
      <section id="skills" className="skills-bg">
        <FadeSection>
          <div className="section-eyebrow">Skills</div>
          <h2 className="section-title">What I do.</h2>
          <div className="skills-grid">
            {skills.map(sk => (
              <div className="skill-card" key={sk.name}>
                <span className="skill-icon">{sk.icon}</span>
                <div className="skill-name">{sk.name}</div>
                <div className="skill-desc">{sk.desc}</div>
                <div className="skill-tags">
                  {sk.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* Projects */}
      <section id="projects">
        <FadeSection>
          <div className="section-eyebrow">Projects</div>
          <h2 className="section-title">Selected work.</h2>
          <div className="projects-list">
            {projects.map((p, i) => (
              <a href={p.link} className="project-item" key={p.name}>
                <div>
                  <div className="project-num">0{i + 1}</div>
                  <div className="project-name">{p.name}</div>
                  <div className="project-desc">{p.desc}</div>
                  <div className="project-tech">
                    {p.tech.map(t => <span className="tech-tag" key={t}>{t}</span>)}
                  </div>
                </div>
                <div className="project-arrow">↗</div>
              </a>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* Experience */}
      <section id="experience" className="exp-bg">
        <FadeSection>
          <div className="section-eyebrow">Experience</div>
          <h2 className="section-title">Where I've been.</h2>
          <div className="exp-timeline">
            {experiences.map(e => (
              <div className="exp-item" key={e.role + e.company}>
                <div className="exp-period">{e.period}</div>
                <div className="exp-role">{e.role}</div>
                <div className="exp-company">{e.company}</div>
                <div className="exp-desc">{e.desc}</div>
                {e.projects && (
                  <div className="exp-projects">
                    {e.projects.map(p => (
                      <div className="exp-project-tag" key={p}>{p}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* Contact */}
      <section id="contact">
        <FadeSection>
          <div className="section-eyebrow">Contact</div>
          <div className="contact-inner">
            <h2 className="contact-big">
              Let's build<br />something<br /><span>great.</span>
            </h2>
            <p className="contact-desc">
              Currently at PT Asaba, but always open to a conversation
              about exciting new opportunities. Feel free to reach out.
            </p>
            <div className="contact-links">
              <a href="mailto:lieleonardo2@gmail.com" className="contact-link">✉ Email Me</a>
              <a href="https://www.linkedin.com/in/leonardo-lie-219380116" className="contact-link" target="_blank" rel="noopener noreferrer">↗ LinkedIn</a>
              <a href="https://github.com/lieleonardo" className="contact-link" target="_blank" rel="noopener noreferrer">↗ GitHub</a>
            </div>
          </div>
        </FadeSection>
      </section>

      <footer>
        <p>© 2026 · Leonardo · Built with React</p>
        <div className="footer-dot" />
        <p>Open to Offers</p>
      </footer>
    </>
  );
}