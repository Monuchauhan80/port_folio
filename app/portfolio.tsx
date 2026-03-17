"use client";

import React, { useEffect, useState, useRef } from "react";

const Portfolio: React.FC = () => {
  useEffect(() => {
    const activeNav = document.querySelector(".nav-item.active");
    if (activeNav && !activeNav.querySelector(".nav-dot")) {
      const d = document.createElement("div");
      d.className = "nav-dot";
      activeNav.appendChild(d);
    }
  }, []);

  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const AVATAR_KEY = "portfolioAvatar";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AVATAR_KEY);
      if (saved) setAvatarSrc(saved);
    } catch (_) {}
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      try {
        localStorage.setItem(AVATAR_KEY, dataUrl);
      } catch (_) {}
      setAvatarSrc(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Removal of avatar via UI has been disabled per user request.

  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!avatarRef.current) return;
      // If avatar exists, clicking inside avatar area should reveal upload button,
      // clicking outside hides it. If no avatar, upload button stays visible.
      if (avatarSrc) {
        if (avatarRef.current.contains(target)) {
          setShowUpload(true);
        } else {
          setShowUpload(false);
        }
      }
    };

    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, [avatarSrc]);

  const showSection = (id: string, btn: HTMLButtonElement) => {
    document
      .querySelectorAll<HTMLElement>(".section")
      .forEach((s) => s.classList.remove("active"));
    document
      .querySelectorAll<HTMLButtonElement>(".nav-item")
      .forEach((b) => b.classList.remove("active"));

    const section = document.getElementById("section-" + id);
    if (section) section.classList.add("active");
    btn.classList.add("active");

    document.querySelectorAll(".nav-dot").forEach((d) => d.remove());
    const dot = document.createElement("div");
    dot.className = "nav-dot";
    btn.appendChild(dot);

    if (id === "skills") animateBars();
  };

  const animateBars = () => {
    requestAnimationFrame(() => {
      document
        .querySelectorAll<HTMLElement>(".skill-fill")
        .forEach((el) => {
          el.style.transform = "scaleX(0)";
          void el.offsetWidth;
          const pctAttr = el.getAttribute("data-pct") || "0";
          const pct = parseFloat(pctAttr);
          el.style.transform = `scaleX(${pct})`;
        });
    });
  };

  const css = `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0a0a0f;
          --bg2: #111118;
          --bg3: #16161f;
          --card: #1a1a26;
          --card-hover: #1f1f2e;
          --border: rgba(255,255,255,0.07);
          --border-hover: rgba(255,255,255,0.14);
          --text: #f0eff8;
          --text2: #9897b0;
          --text3: #5e5d72;
          --accent: #7c6bff;
          --accent2: #a78bfa;
          --accent3: #e879f9;
          --green: #34d399;
          --gold: #fbbf24;
          --tag-bg: rgba(124,107,255,0.08);
          --tag-border: rgba(124,107,255,0.2);
          --tag-text: #a78bfa;
        }
        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
        }
        .layout {
          display: grid;
          grid-template-columns: 340px 1fr;
          min-height: 100vh;
        }
        .sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          background: var(--bg2);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 40px 32px;
          overflow-y: auto;
        }
        .avatar-wrap {
          position: relative;
          width: 120px;
          height: 120px;
          margin-bottom: 24px;
        }
        .avatar-ring {
          position: absolute;
          inset: -4px;
          border-radius: 22px;
          background: linear-gradient(135deg, var(--accent), var(--accent3));
          z-index: 0;
        }
        .avatar {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          border-radius: 18px;
          background: var(--card);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin: 3px;
          width: calc(100% - 6px);
          height: calc(100% - 6px);
        }
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .avatar-initials {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: var(--accent2);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        .avatar-upload-btn {
          position: absolute;
          bottom: 6px;
          right: 6px;
          background: rgba(0,0,0,0.45);
          color: #fff;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
        }
        @media (max-width: 900px) {
          .avatar-wrap { width: 72px; height: 72px; }
          .avatar-ring { inset: -3px; }
        }
        .online-dot {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 12px;
          height: 12px;
          background: var(--green);
          border-radius: 50%;
          border: 2px solid var(--bg2);
          z-index: 2;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .name-block { margin-bottom: 20px; }
        .name-first {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text3);
          margin-bottom: 2px;
        }
        .name-last {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
        }
        .name-last span {
          background: linear-gradient(90deg, var(--accent), var(--accent3));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
        }
        .badge {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 4px 10px;
          border-radius: 6px;
          background: var(--tag-bg);
          border: 1px solid var(--tag-border);
          color: var(--tag-text);
        }
        .badge.cert {
          background: rgba(251,191,36,0.08);
          border-color: rgba(251,191,36,0.2);
          color: var(--gold);
        }
        .tagline {
          font-size: 13.5px;
          font-weight: 300;
          color: var(--text2);
          line-height: 1.65;
          margin-bottom: 28px;
        }
        .contact-list {
          list-style: none;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .contact-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--text2);
          transition: color 0.2s;
        }
        .contact-list li:hover { color: var(--text); }
        .contact-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: var(--card);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .contact-icon svg {
          width: 14px;
          height: 14px;
          stroke: var(--accent2);
          fill: none;
          stroke-width: 1.75;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .nav { margin-bottom: 32px; display: flex; flex-direction: column; gap: 4px; }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 400;
          color: var(--text3);
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
          background: none;
          width: 100%;
          text-align: left;
          letter-spacing: 0.01em;
        }
        .nav-item:hover {
          color: var(--text2);
          background: var(--card);
          border-color: var(--border);
        }
        .nav-item.active {
          color: var(--text);
          background: var(--card);
          border-color: var(--border-hover);
        }
        .nav-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .nav-icon svg {
          width: 15px; height: 15px;
          fill: none; stroke-width: 1.75;
          stroke-linecap: round; stroke-linejoin: round;
          stroke: var(--text3);
        }
        .nav-item.active .nav-icon { background: linear-gradient(135deg, rgba(124,107,255,0.2), rgba(232,121,249,0.15)); }
        .nav-item.active .nav-icon svg { stroke: var(--accent2); }
        .nav-dot { margin-left: auto; width: 5px; height: 5px; background: var(--accent); border-radius: 50%; }
        .social-row { display: flex; gap: 8px; margin-bottom: 16px; }
        .social-btn {
          width: 36px; height: 36px;
          border-radius: 9px;
          background: var(--card);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }
        .social-btn:hover { border-color: var(--border-hover); background: var(--card-hover); }
        .social-btn svg { width: 14px; height: 14px; stroke: var(--text2); fill: none; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
        .dl-btn {
          width: 100%;
          padding: 11px 16px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--accent), var(--accent3));
          border: none;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.2s;
          letter-spacing: 0.02em;
          margin-bottom: 14px;
        }
        .dl-btn:hover { opacity: 0.88; }
        .dl-btn svg { width: 14px; height: 14px; stroke: #fff; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .avail-tag {
          display: flex; align-items: center; gap: 6px;
          font-size: 11.5px; color: var(--text3);
        }
        .avail-dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; animation: pulse 2s infinite; }
        .main {
          background: var(--bg);
          padding: 48px 48px;
          min-height: 100vh;
        }
        .section-head { margin-bottom: 36px; }
        .section-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 8px;
        }
        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: 30px;
          font-weight: 800;
          color: var(--text);
          line-height: 1.1;
        }
        .title-bar {
          margin-top: 10px;
          width: 48px; height: 3px;
          border-radius: 2px;
          background: linear-gradient(90deg, var(--accent), var(--accent3));
        }
        .timeline { display: flex; flex-direction: column; gap: 24px; }
        .job-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 28px 28px 24px;
          transition: border-color 0.25s, background 0.25s;
          position: relative;
          overflow: hidden;
        }
        .job-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, var(--accent), var(--accent3));
          border-radius: 3px 0 0 3px;
        }
        .job-card:hover { border-color: var(--border-hover); background: var(--card-hover); }
        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }
        .job-role {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
          line-height: 1.2;
        }
        .job-period {
          font-size: 12px;
          font-weight: 500;
          padding: 5px 12px;
          border-radius: 20px;
          background: rgba(124,107,255,0.1);
          border: 1px solid rgba(124,107,255,0.2);
          color: var(--accent2);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .job-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          font-size: 13px;
        }
        .job-company { color: var(--accent2); font-weight: 500; }
        .job-sep { color: var(--text3); }
        .job-loc { color: var(--text3); }
        .job-desc {
          font-size: 13.5px;
          color: var(--text2);
          line-height: 1.7;
          margin-bottom: 18px;
          font-weight: 300;
        }
        .achievements { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .achievement {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13.5px;
          color: var(--text2);
          line-height: 1.55;
          font-weight: 300;
        }
        .ach-icon {
          width: 20px; height: 20px;
          border-radius: 6px;
          background: rgba(124,107,255,0.12);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .ach-icon svg { width: 10px; height: 10px; stroke: var(--accent2); fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
        .tech-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .tech-tag {
          font-size: 11.5px;
          padding: 4px 10px;
          border-radius: 6px;
          background: var(--tag-bg);
          border: 1px solid var(--tag-border);
          color: var(--tag-text);
          font-weight: 400;
          letter-spacing: 0.02em;
        }
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .proj-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.25s;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .proj-card:hover { border-color: var(--border-hover); background: var(--card-hover); transform: translateY(-4px); }
        .featured-badge {
          position: absolute;
          top: -1px; right: 16px;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.06em;
          padding: 4px 10px;
          background: linear-gradient(90deg, var(--gold), #f59e0b);
          color: #1a1200;
          border-radius: 0 0 8px 8px;
          text-transform: uppercase;
        }
        .proj-emoji { font-size: 36px; margin-bottom: 16px; line-height: 1; }
        .proj-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .proj-title {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: var(--text);
          line-height: 1.25;
        }
        .proj-year { font-size: 11px; color: var(--text3); }
        .proj-desc {
          font-size: 13px;
          color: var(--text2);
          line-height: 1.65;
          margin-bottom: 16px;
          flex: 1;
          font-weight: 300;
        }
        .proj-stats { display: flex; gap: 14px; margin-bottom: 14px; }
        .proj-stat { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text3); }
        .proj-stat svg { width: 12px; height: 12px; stroke: var(--text3); fill: none; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
        .proj-actions { display: flex; gap: 8px; margin-top: auto; }
        .proj-btn-primary {
          flex: 1; padding: 9px 12px;
          border-radius: 9px;
          background: linear-gradient(135deg, var(--accent), var(--accent3));
          border: none; color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; font-weight: 500;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 5px;
          transition: opacity 0.2s;
        }
        .proj-btn-primary:hover { opacity: 0.85; }
        .proj-btn-primary svg { width: 12px; height: 12px; stroke: #fff; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .proj-btn-ghost {
          padding: 9px 12px;
          border-radius: 9px;
          background: var(--bg3);
          border: 1px solid var(--border);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s;
        }
        .proj-btn-ghost:hover { border-color: var(--border-hover); }
        .proj-btn-ghost svg { width: 14px; height: 14px; stroke: var(--text2); fill: none; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
        .skills-wrap { display: flex; flex-direction: column; gap: 20px; }
        .skill-cat {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px 24px 20px;
          transition: border-color 0.2s;
        }
        .skill-cat:hover { border-color: var(--border-hover); }
        .skill-cat-header {
          display: flex; align-items: center; gap: 12px; margin-bottom: 22px;
        }
        .skill-cat-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(124,107,255,0.15), rgba(232,121,249,0.1));
          border: 1px solid rgba(124,107,255,0.2);
          display: flex; align-items: center; justify-content: center;
        }
        .skill-cat-icon svg { width: 17px; height: 17px; stroke: var(--accent2); fill: none; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
        .skill-cat-name {
          font-family: 'Syne', sans-serif;
          font-size: 17px; font-weight: 700;
          color: var(--text);
        }
        .skill-rows { display: flex; flex-direction: column; gap: 16px; }
        .skill-row-label {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px;
        }
        .skill-name { font-size: 13.5px; color: var(--text); font-weight: 400; }
        .skill-meta { display: flex; align-items: center; gap: 10px; }
        /* skill-level visuals removed per user request */
        .section { display: none; }
        .section.active { display: block; }
        @media (max-width: 900px) {
          .layout { grid-template-columns: 1fr; }
          .sidebar {
            position: static; height: auto;
            padding: 28px 24px;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0;
          }
          .main { padding: 28px 20px; }
        }
      `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div>
            <div className="avatar-wrap">
              <div className="avatar-ring" />
              <div className="avatar" ref={avatarRef}>
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Profile photo" className="avatar-img" />
                ) : (
                  <div className="avatar-initials">MC</div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {(!avatarSrc || showUpload) && (
                  <button
                    type="button"
                    className="avatar-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload profile photo"
                  >
                    ✎
                  </button>
                )}
              </div>
              <div className="online-dot" />
            </div>

            <div className="name-block">
              <div className="name-first">Portfolio</div>
              <div className="name-last">
                Monu <span>Chauhan</span>
              </div>
            </div>

            <div className="badges">
              <span className="badge">Software Engineer</span>
              <span className="badge cert">⭐ AWS &amp; Azure Certified</span>
            </div>

            <p className="tagline">
              Software Engineer with internship experience in web, mobile and DevOps, focused on clean code,
              debugging and scalable cloud‑native solutions. 
            </p>

            <ul className="contact-list">
              <li>
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                Basti / Punjab, India
              </li>
              <li>
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <a
                  href="mailto:m.chauhan8052@gmail.com"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  m.chauhan8052@gmail.com
                </a>
              </li>
              <li>
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.12 6.12l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                +91 73487 60465
              </li>
              <li>
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                Open for opportunities
              </li>
            </ul>

            <nav className="nav">
              <button
                className="nav-item active"
                onClick={(e) => showSection("work", e.currentTarget)}
              >
                <div className="nav-icon">
                  <svg viewBox="0 0 24 24">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                </div>
                Work Experience
                <div className="nav-dot" />
              </button>
              <button
                className="nav-item"
                onClick={(e) => showSection("projects", e.currentTarget)}
              >
                <div className="nav-icon">
                  <svg viewBox="0 0 24 24">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                Projects
              </button>
              <button
                className="nav-item"
                onClick={(e) => showSection("skills", e.currentTarget)}
              >
                <div className="nav-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                </div>
                Skills &amp; Expertise
              </button>
              <button
                className="nav-item"
                onClick={(e) => showSection("education", e.currentTarget)}
              >
                <div className="nav-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 19.5V9l8-4 8 4v10.5" />
                    <path d="M12 22v-7" />
                  </svg>
                </div>
                Education
              </button>
            </nav>

            <div className="social-row">
              <a
                href="https://github.com/Monuchauhan80"
                className="social-btn"
                title="GitHub"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/monu-chauhan"
                className="social-btn"
                title="LinkedIn"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="mailto:m.chauhan8052@gmail.com"
                className="social-btn"
                title="Email"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
              <a href="#" className="social-btn" title="Resume">
                <svg viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </a>
            </div>

            <a href="/resume.pdf" className="dl-btn" download>
              <svg viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Resume
            </a>

            <div className="avail-tag">
              <div className="avail-dot" />
              Available for internships &amp; full-time roles
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main">
          {/* WORK SECTION */}
          <div id="section-work" className="section active">
            <div className="section-head">
              <div className="section-eyebrow">Experience</div>
              <div className="section-title">Professional Journey</div>
              <div className="title-bar" />
            </div>

            <div className="timeline">
              <div className="job-card">
                <div className="job-header">
                  <div className="job-role">Software Engineer Intern</div>
                  <div className="job-period">Oct 2025 — Jan 2026</div>
                </div>
                <div className="job-meta">
                  <span className="job-company">Anasol Consultancy Services Pvt Ltd</span>
                  <span className="job-sep">·</span>
                  <span className="job-loc">India</span>
                </div>
                <p className="job-desc">
                  Contributed to development and enhancement of web and application features using modern
                  technologies, focusing on clean, maintainable and efficient code.
                </p>
                <ul className="achievements">
                  <li className="achievement">
                    <div className="ach-icon">
                      <svg viewBox="0 0 24 24">
                        <polyline points="13 2 13 9 20 9" />
                        <polygon points="22 12 13 2 2 7 2 22 22 22 22 12" />
                      </svg>
                    </div>
                    Developed and enhanced application features using modern web technologies, ensuring clean,
                    maintainable and efficient code. 
                  </li>
                  <li className="achievement">
                    <div className="ach-icon">
                      <svg viewBox="0 0 24 24">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                    </div>
                    Assisted in designing, debugging and testing software modules to improve performance and
                    reliability. 
                  </li>
                  <li className="achievement">
                    <div className="ach-icon">
                      <svg viewBox="0 0 24 24">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    Collaborated with cross‑functional teams to gather requirements, design solutions and deliver
                    features within defined timelines.
                  </li>
                </ul>
                <div className="tech-tags">
                  <span className="tech-tag">React Native</span>
                  <span className="tech-tag">HTML &amp; CSS</span>
                  <span className="tech-tag">Java</span>
                  <span className="tech-tag">MySQL</span>
                </div>
              </div>

              <div className="job-card">
                <div className="job-header">
                  <div className="job-role">DevOps Intern</div>
                  <div className="job-period">Sep 2025</div>
                </div>
                <div className="job-meta">
                  <span className="job-company">Shiwansh Solutions</span>
                  <span className="job-sep">·</span>
                  <span className="job-loc">India</span>
                </div>
                <p className="job-desc">
                  Supported DevOps initiatives including CI/CD pipelines, cloud platforms and containerization to
                  enable scalable deployments and collaborative development. 
                </p>
                <ul className="achievements">
                  <li className="achievement">
                    <div className="ach-icon">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    Gained hands‑on experience with CI/CD pipelines, automating build, test and deployment workflows.
                    
                  </li>
                  <li className="achievement">
                    <div className="ach-icon">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    Worked with cloud computing platforms and containerization technologies to support scalable app
                    deployments. 
                  </li>
                  <li className="achievement">
                    <div className="ach-icon">
                      <svg viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    Used Git and GitHub for version control, branching and collaborative development.
                  </li>
                </ul>
                <div className="tech-tags">
                  <span className="tech-tag">DevOps</span>
                  <span className="tech-tag">CI/CD</span>
                  <span className="tech-tag">AWS</span>
                  <span className="tech-tag">Containers</span>
                  <span className="tech-tag">Git &amp; GitHub</span>
                </div>
              </div>
            </div>
          </div>

          {/* PROJECTS SECTION */}
          <div id="section-projects" className="section">
            <div className="section-head">
              <div className="section-eyebrow">Work</div>
              <div className="section-title">Projects</div>
              <div className="title-bar" />
            </div>

            <div className="projects-grid">
              <div className="proj-card">
                <div className="featured-badge">Featured</div>
                <div className="proj-emoji">🛒</div>
                <div className="proj-top">
                  <div className="proj-title">Fast Delivery</div>
                  <div className="proj-year">Dec 2025</div>
                </div>
                <p className="proj-desc">
                  Shopping Android app built with React Native and TypeScript NativeWind, including categories, cart,
                  profile, location and payment interfaces with DevOps‑driven deployments.
                </p>
                <div className="proj-stats">
                  <div className="proj-stat">
                    <svg viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    v1.0
                  </div>
                </div>
                <div className="tech-tags" style={{ marginBottom: 16 }}>
                  <span className="tech-tag">React Native</span>
                  <span className="tech-tag">TypeScript</span>
                  <span className="tech-tag">NativeWind</span>
                  <span className="tech-tag">DevOps</span>
                </div>
                <div className="proj-actions">
                  <button className="proj-btn-primary">
                    <svg viewBox="0 0 24 24">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Live Demo
                  </button>
                  <button className="proj-btn-ghost">
                    <svg viewBox="0 0 24 24">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="proj-card">
                <div className="proj-emoji">☁️</div>
                <div className="proj-top">
                  <div className="proj-title">Apache Cloud‑Stack Server</div>
                  <div className="proj-year">Oct 2025</div>
                </div>
                <p className="proj-desc">
                  Open‑source IaaS cloud computing setup using Apache Cloud‑Stack on Linux with JVM, SQL database server
                  and KVM to manage large networks of virtual machines. 
                </p>
                <div className="proj-stats">
                  <div className="proj-stat">
                    <svg viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    IaaS
                  </div>
                </div>
                <div className="tech-tags" style={{ marginBottom: 16 }}>
                  <span className="tech-tag">Linux</span>
                  <span className="tech-tag">Apache Cloud‑Stack</span>
                  <span className="tech-tag">SQL</span>
                  <span className="tech-tag">KVM</span>
                </div>
                <div className="proj-actions">
                  <button className="proj-btn-primary">
                    <svg viewBox="0 0 24 24">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Details
                  </button>
                  <button className="proj-btn-ghost">
                    <svg viewBox="0 0 24 24">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="proj-card">
                <div className="proj-emoji">🔐</div>
                <div className="proj-top">
                  <div className="proj-title">Encryption &amp; Decryption App</div>
                  <div className="proj-year">Sep 2025</div>
                </div>
                <p className="proj-desc">
                  Secret password analyzer application with Java Swing GUI implementing multiple encryption and
                  decryption algorithms to secure data. 
                </p>
                <div className="proj-stats">
                  <div className="proj-stat">
                    <svg viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Security
                  </div>
                </div>
                <div className="tech-tags" style={{ marginBottom: 16 }}>
                  <span className="tech-tag">Java</span>
                  <span className="tech-tag">Java Swing</span>
                  <span className="tech-tag">Cryptography</span>
                </div>
                <div className="proj-actions">
                  <button className="proj-btn-primary">
                    <svg viewBox="0 0 24 24">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Repo
                  </button>
                  <button className="proj-btn-ghost">
                    <svg viewBox="0 0 24 24">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SKILLS SECTION */}
          <div id="section-skills" className="section">
            <div className="section-head">
              <div className="section-eyebrow">Expertise</div>
              <div className="section-title">Technical Arsenal</div>
              <div className="title-bar" />
            </div>

            <div className="skills-wrap">
              <div className="skill-cat">
                <div className="skill-cat-header">
                  <div className="skill-cat-icon">
                    <svg viewBox="0 0 24 24">
                      <rect x="5" y="2" width="14" height="20" rx="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  </div>
                  <div className="skill-cat-name">Programming Languages</div>
                </div>
                <div className="skill-rows">
                  <div>
                    <div className="skill-row-label">
                      <span className="skill-name">C++</span>
                    </div>
                    
                  </div>
                  <div>
                    <div className="skill-row-label">
                      <span className="skill-name">Java</span>
                    </div>
                    
                  </div>
                  <div>
                    <div className="skill-row-label">
                      <span className="skill-name">Python</span>
                    </div>
                    
                  </div>
                  <div>
                    <div className="skill-row-label">
                      <span className="skill-name">C#</span>
                    </div>
                    
                  </div>
                </div>
              </div>

              <div className="skill-cat">
                <div className="skill-cat-header">
                  <div className="skill-cat-icon">
                    <svg viewBox="0 0 24 24">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  </div>
                  <div className="skill-cat-name">Frameworks &amp; Web</div>
                </div>
                <div className="skill-rows">
                  <div>
                    <div className="skill-row-label">
                      <span className="skill-name">React Native</span>
                    </div>
                    
                  </div>
                  <div>
                    <div className="skill-row-label">
                      <span className="skill-name">HTML &amp; CSS</span>
                    </div>
                    
                  </div>
                  <div>
                    <div className="skill-row-label">
                      <span className="skill-name">Selenium</span>
                    </div>
                    
                  </div>
                </div>
              </div>

              <div className="skill-cat">
                <div className="skill-cat-header">
                  <div className="skill-cat-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="skill-cat-name">Cloud, DevOps &amp; Tools</div>
                </div>
                  <div className="skill-rows">
                    <div>
                      <div className="skill-row-label">
                        <span className="skill-name">AWS</span>
                      </div>
                      
                    </div>
                    <div>
                      <div className="skill-row-label">
                        <span className="skill-name">Azure</span>
                      </div>
                      
                    </div>
                    <div>
                      <div className="skill-row-label">
                        <span className="skill-name">Kubernetes / Terraform</span>
                      </div>
                      
                    </div>
                    <div>
                      <div className="skill-row-label">
                        <span className="skill-name">MySQL &amp; UiPath RPA</span>
                      </div>
                      
                    </div>
                  </div>
              </div>

              <div className="skill-cat">
                <div className="skill-cat-header">
                  <div className="skill-cat-icon">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                    </svg>
                  </div>
                  <div className="skill-cat-name">Soft Skills</div>
                </div>
                  <div className="skill-rows">
                    <div>
                      <div className="skill-row-label">
                        <span className="skill-name">Problem‑Solving</span>
                      </div>
                      
                    </div>
                    <div>
                      <div className="skill-row-label">
                        <span className="skill-name">Team Player</span>
                      </div>
                      
                    </div>
                    <div>
                      <div className="skill-row-label">
                        <span className="skill-name">Adaptability</span>
                      </div>
                      
                    </div>
                  </div>
              </div>

              <div className="skill-cat">
                <div className="skill-cat-header">
                  <div className="skill-cat-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2l3 4 5 .5-3.5 3 1 4.5L12 16l-5.5 2 1-4.5L4 6.5 9 6z" />
                    </svg>
                  </div>
                  <div className="skill-cat-name">Certifications</div>
                </div>
                <div className="skill-rows">
                  <div className="skill-row-label">
                    <span className="skill-name">
                      AWS Certified Cloud Practitioner (May 2025)
                    </span>
                  </div>
                  <div className="skill-row-label">
                    <span className="skill-name">
                      Azure Security Engineer Associate – AZ‑500 (Apr 2025) 
                    </span>
                  </div>
                  <div className="skill-row-label">
                    <span className="skill-name">
                      Cloud Stack – Vskills (May 2024) 
                    </span>
                  </div>
                  <div className="skill-row-label">
                    <span className="skill-name">
                      Automation Anywhere RPA Professional (Nov 2023) 
                    </span>
                  </div>
                  <div className="skill-row-label">
                    <span className="skill-name">IBM Cloud Essentials (Nov 2023)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* EDUCATION SECTION */}
          <div id="section-education" className="section">
            <div className="section-head">
              <div className="section-eyebrow">Academics</div>
              <div className="section-title">Education</div>
              <div className="title-bar" />
            </div>

            <div className="timeline">
              <div className="job-card">
                <div className="job-header">
                  <div className="job-role">B.Tech – Computer Science &amp; Engineering</div>
                  <div className="job-period">Aug 2021 — Jul 2025</div>
                </div>
                <div className="job-meta">
                  <span className="job-company">Lovely Professional University</span>
                  <span className="job-sep">·</span>
                  <span className="job-loc">Punjab, India</span>
                </div>
                <p className="job-desc">
                  Bachelor of Technology in Computer Science and Engineering with CGPA 7.2, covering core CS
                  fundamentals, programming, databases, networking and cloud technologies. 
                </p>
              </div>

              <div className="job-card">
                <div className="job-header">
                  <div className="job-role">Intermediate (10+2)</div>
                  <div className="job-period">Apr 2018 — Mar 2020</div>
                </div>
                <div className="job-meta">
                  <span className="job-company">
                    Urmila Shiksha Santi Niketan Inter College
                  </span>
                  <span className="job-sep">·</span>
                  <span className="job-loc">Basti, Uttar Pradesh</span>
                </div>
                <p className="job-desc">
                  Completed Intermediate with 80% aggregate, focusing on science stream foundational subjects. 

                </p>
              </div>

              <div className="job-card">
                <div className="job-header">
                  <div className="job-role">Matriculation (10th)</div>
                  <div className="job-period">Apr 2016 — Mar 2018</div>
                </div>
                <div className="job-meta">
                  <span className="job-company">
                    Urmila Shiksha Santi Niketan Inter College
                  </span>
                  <span className="job-sep">·</span>
                  <span className="job-loc">Basti, Uttar Pradesh</span>
                </div>
                <p className="job-desc">
                  Completed Matriculation with 86% marks, building strong academic foundation for higher studies.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Portfolio;
