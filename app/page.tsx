"use client";

import Link from "next/link";
import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import "./redesign.css";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type Mention = {
  tag: string;
  hint: string;
};

const MENTIONS: Mention[] = [
  { tag: "Write", hint: "Draft emails, posts, and documents" },
  { tag: "Summarize", hint: "Condense long text into key points" },
  { tag: "Analyze", hint: "Break down data, ideas, and decisions" },
  { tag: "Brainstorm", hint: "Generate fresh ideas and options" },
];

function extractReply(raw: string): string {
  const text = raw.trim();
  if (!text) return "";
  try {
    const data = JSON.parse(text);
    if (typeof data === "string") return data;
    const candidate =
      data?.reply ??
      data?.response ??
      data?.message?.content ??
      data?.message ??
      data?.content ??
      data?.text ??
      data?.answer ??
      data?.output ??
      data?.choices?.[0]?.message?.content;
    if (typeof candidate === "string") return candidate;
    if (data?.error && typeof data.error === "string") return data.error;
    return JSON.stringify(data, null, 2);
  } catch {
    return text;
  }
}

function wavePath(index: number): string {
  const y = 250 + index * 26;
  const a = -170 + index * 7;
  const b = 190 - index * 9;
  return `M-120 ${y} C 280 ${y + a}, 640 ${y + b}, 980 ${y - 30} S 1380 ${y + 110}, 1580 ${y - 90}`;
}

const TRUST = [
  {
    label: "Secure by design",
    icon: "M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z",
  },
  {
    label: "Independent platform",
    icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  },
  {
    label: "Fast responses",
    icon: "M13 2 4 14h7l-1 8 9-12h-7z",
  },
  {
    label: "Any device",
    icon: "M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM11 18h2",
  },
];

const FEATURES = [
  {
    title: "Fast, thoughtful answers",
    text: "Ask in plain language and get clear, well-structured responses in seconds.",
    icon: "M13 2 4 14h7l-1 8 9-12h-7z",
  },
  {
    title: "Built for real work",
    text: "Draft, summarize, analyze, and brainstorm without switching between tools.",
    icon: "M4 6h16M4 12h16M4 18h10",
  },
  {
    title: "Smart @mentions",
    text: "Type @ in the prompt to pick a task such as Write, Summarize, or Analyze instantly.",
    icon: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1",
  },
  {
    title: "Private by design",
    text: "Your conversations stay yours. Veloqis AI is independent and built with care.",
    icon: "M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z",
  },
];

const STEPS = [
  {
    title: "Ask anything",
    text: "Type your question or task. Use @ to pick a focus such as Write or Analyze.",
  },
  {
    title: "Veloqis thinks",
    text: "Your request is processed securely and a clear answer is composed for you.",
  },
  {
    title: "Refine and continue",
    text: "Follow up, adjust, and keep going until you have exactly what you need.",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "Free",
    note: "Start exploring Veloqis AI.",
    items: ["Everyday conversations", "Fast responses", "Works on any device"],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Pro",
    price: "Coming soon",
    note: "More power for daily work.",
    items: ["Higher usage limits", "Priority speed", "Early access to new features"],
    cta: "Sign in",
    featured: true,
  },
  {
    name: "Teams",
    price: "Coming soon",
    note: "Shared workflows for teams.",
    items: ["Shared workspaces", "Admin controls", "Dedicated support"],
    cta: "Sign in",
    featured: false,
  },
];

const FAQ = [
  {
    q: "What is Veloqis AI?",
    a: "Veloqis AI is an independent AI platform that helps you write, analyze, and brainstorm through a simple chat workspace.",
  },
  {
    q: "Do I need an account?",
    a: "You can try the prompt box on this page. Signing in unlocks your full workspace and account features.",
  },
  {
    q: "How do @mentions work?",
    a: "Type @ in the prompt box and choose a task such as Write, Summarize, Analyze, or Brainstorm. It simply guides your request.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes. Veloqis AI is designed mobile-first and works smoothly on Android phones, tablets, and desktops.",
  },
];

function Icon({ d, size = 22 }: { d: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="vqLogoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b8def" />
          <stop offset="1" stopColor="#9fb4d6" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="#ffffff" stroke="#d9e1ee" />
      <path
        d="M10 12 20 29 30 12"
        fill="none"
        stroke="url(#vqLogoGrad)"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 12.5c3 3 8 3 11 0"
        fill="none"
        stroke="#c4d0e4"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const mentionMatch = prompt.match(/(?:^|\s)@(\w*)$/);
  const suggestions: Mention[] = mentionMatch
    ? MENTIONS.filter((m) => m.tag.toLowerCase().startsWith(mentionMatch[1].toLowerCase()))
    : [];

  function applyMention(tag: string) {
    setPrompt((prev) => prev.replace(/(^|\s)@\w*$/, `$1@${tag} `));
    inputRef.current?.focus();
  }

  function insertChip(tag: string) {
    setPrompt((prev) => {
      const base = prev.trim();
      return base ? `@${tag} ${base}` : `@${tag} `;
    });
    inputRef.current?.focus();
  }

  async function sendMessage() {
    const text = prompt.trim();
    if (!text || loading) return;

    const history = messages;
    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages([...history, userMessage]);
    setPrompt("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          messages: [...history, userMessage],
        }),
      });

      const raw = await res.text();

      if (!res.ok) {
        const detail = extractReply(raw);
        throw new Error(
          res.status === 401
            ? "Please sign in to continue chatting."
            : detail || "Something went wrong. Please try again."
        );
      }

      const reply = extractReply(raw);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: reply || "No response received." },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to reach Veloqis AI. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.key === "Enter" || event.key === "Tab") && suggestions.length > 0) {
      event.preventDefault();
      applyMention(suggestions[0].tag);
      return;
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="vq-root">
      <div className="vq-bg" aria-hidden="true">
        <div className="vq-bg-glow vq-bg-glow-a" />
        <div className="vq-bg-glow vq-bg-glow-b" />
        <svg
          className="vq-waves"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <defs>
            <linearGradient id="vqWaveStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="0.35" stopColor="#9db8e8" stopOpacity="0.55" />
              <stop offset="0.65" stopColor="#c9d3e3" stopOpacity="0.75" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="vqWaveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#dfe8f8" stopOpacity="0.55" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${wavePath(0)} L1580 900 L-120 900 Z`} fill="url(#vqWaveFill)" />
          <g className="vq-wave-group" fill="none" stroke="url(#vqWaveStroke)" strokeWidth="1.1">
            {Array.from({ length: 16 }).map((_, i) => (
              <path key={i} d={wavePath(i)} />
            ))}
          </g>
        </svg>
        <div className="vq-bg-fade" />
      </div>

      <header className="vq-header">
        <div className="vq-nav">
          <Link href="/" className="vq-brand" onClick={closeMenu}>
            <Logo />
            <span className="vq-brand-name">
              Veloqis <span>AI</span>
            </span>
          </Link>

          <nav
            id="vq-menu"
            className={`vq-links${menuOpen ? " is-open" : ""}`}
            aria-label="Primary"
          >
            <a href="#features" onClick={closeMenu}>Features</a>
            <a href="#how-it-works" onClick={closeMenu}>How It Works</a>
            <a href="#pricing" onClick={closeMenu}>Pricing</a>
          </nav>

          <div className="vq-nav-actions">
            <Link href="/auth" className="vq-btn vq-btn-primary vq-btn-sm">
              Sign in
            </Link>
            <button
              type="button"
              className="vq-menu-btn"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="vq-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="vq-hero">
          <p className="vq-eyebrow">Independent AI platform</p>
          <h1 className="vq-title">
            Intelligence that flows <em>effortlessly</em> with you.
          </h1>
          <p className="vq-lead">
            Veloqis AI helps you think, write, and build faster with calm, precise
            answers in a beautifully simple, secure workspace.
          </p>

          <form className="vq-prompt" onSubmit={handleSubmit}>
            {suggestions.length > 0 && (
              <ul className="vq-mention-menu" role="listbox" aria-label="Mention suggestions">
                {suggestions.map((m) => (
                  <li key={m.tag} role="option" aria-selected="false">
                    <button
                      type="button"
                      className="vq-mention-item"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyMention(m.tag)}
                    >
                      <span className="vq-mention-tag">@{m.tag}</span>
                      <span className="vq-mention-hint">{m.hint}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <label htmlFor="vq-input" className="vq-sr">
              Ask Veloqis AI
            </label>
            <textarea
              id="vq-input"
              ref={inputRef}
              className="vq-input"
              rows={2}
              value={prompt}
              placeholder="Ask Veloqis AI anything, or type @ for tasks..."
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              maxLength={4000}
            />
            <div className="vq-prompt-bar">
              <span className="vq-hint">Enter to send, Shift+Enter for a new line</span>
              <button
                type="submit"
                className="vq-send"
                disabled={loading || !prompt.trim()}
                aria-label="Send message"
              >
                {loading ? (
                  <span className="vq-spinner" aria-hidden="true" />
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </form>

          <div className="vq-chips" aria-label="Quick tasks">
            {MENTIONS.map((m) => (
              <button
                key={m.tag}
                type="button"
                className="vq-chip"
                onClick={() => insertChip(m.tag)}
                disabled={loading}
              >
                @{m.tag}
              </button>
            ))}
          </div>

          {(messages.length > 0 || error || loading) && (
            <div className="vq-chat" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={`vq-msg vq-msg-${m.role}`}>
                  <span className="vq-msg-role">{m.role === "user" ? "You" : "Veloqis AI"}</span>
                  <p>{m.content}</p>
                </div>
              ))}
              {loading && (
                <div className="vq-msg vq-msg-assistant">
                  <span className="vq-msg-role">Veloqis AI</span>
                  <p className="vq-typing">Thinking...</p>
                </div>
              )}
              {error && (
                <div className="vq-error" role="alert">
                  {error}{" "}
                  {error.toLowerCase().includes("sign in") && (
                    <Link href="/auth">Sign in</Link>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="vq-trust" aria-label="Highlights">
          <ul className="vq-trust-list">
            {TRUST.map((t) => (
              <li key={t.label}>
                <Icon d={t.icon} size={18} />
                <span>{t.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="features" className="vq-section">
          <div className="vq-section-head">
            <p className="vq-eyebrow">Features</p>
            <h2>Everything you need, nothing you don&apos;t.</h2>
            <p>A focused set of capabilities designed to make your day smoother.</p>
          </div>
          <div className="vq-grid">
            {FEATURES.map((f) => (
              <article key={f.title} className="vq-card">
                <span className="vq-icon">
                  <Icon d={f.icon} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="vq-section">
          <div className="vq-section-head">
            <p className="vq-eyebrow">How It Works</p>
            <h2>From question to answer in three steps.</h2>
          </div>
          <ol className="vq-steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="vq-step">
                <span className="vq-step-num">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="pricing" className="vq-section">
          <div className="vq-section-head">
            <p className="vq-eyebrow">Pricing</p>
            <h2>Simple plans that grow with you.</h2>
          </div>
          <div className="vq-grid vq-grid-3">
            {PLANS.map((p) => (
              <article
                key={p.name}
                className={`vq-card vq-plan${p.featured ? " is-featured" : ""}`}
              >
                <h3>{p.name}</h3>
                <p className="vq-price">{p.price}</p>
                <p className="vq-plan-note">{p.note}</p>
                <ul>
                  {p.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Link
                  href="/auth"
                  className={`vq-btn ${p.featured ? "vq-btn-primary" : "vq-btn-ghost"}`}
                >
                  {p.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="vq-section vq-faq-section">
          <div className="vq-section-head">
            <p className="vq-eyebrow">FAQ</p>
            <h2>Questions, answered.</h2>
          </div>
          <div className="vq-faq">
            {FAQ.map((item) => (
              <details key={item.q} className="vq-faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="vq-cta">
          <h2>Ready to experience Veloqis AI?</h2>
          <p>Sign in and start a conversation in seconds.</p>
          <Link href="/auth" className="vq-btn vq-btn-primary">
            Sign in
          </Link>
        </section>
      </main>

      <footer className="vq-footer">
        <div className="vq-footer-inner">
          <div className="vq-footer-brand">
            <Link href="/" className="vq-brand">
              <Logo size={28} />
              <span className="vq-brand-name">
                Veloqis <span>AI</span>
              </span>
            </Link>
            <p>An independent AI platform focused on clarity, speed, and privacy.</p>
          </div>
          <nav className="vq-footer-col" aria-label="Product">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <nav className="vq-footer-col" aria-label="Resources">
            <h4>Resources</h4>
            <a href="#faq">FAQ</a>
            <Link href="/auth">Sign in</Link>
          </nav>
        </div>
        <p className="vq-copy">
          &copy; {new Date().getFullYear()} Veloqis AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
      }
