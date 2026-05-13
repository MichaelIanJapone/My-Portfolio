import { useEffect, useRef, useState } from 'react'
import './ChatWidget.css'

const PORTRAIT_SRC = '/michael-ian-japone-portrait.png'
const CHAT_NAME = 'Michael Ian Japone'
const CHAT_TITLE = 'Chat with Michael'
const INPUT_MAX = 1000
/** So the typing dots paint long enough to notice (offline replies are nearly instant). */
const TYPING_INDICATOR_MIN_MS = 450

/** Shown when the model or chat API cannot answer, or no offline topic matches. */
const CHAT_UNAVAILABLE =
  "Sorry, I'm having trouble connecting right now. Please try again later."

/** Longer typing when we only have this fallback — feels like a slower “don’t know” response. */
const TYPING_INDICATOR_UNKNOWN_MIN_MS = 1200

type ChatMessage = { role: 'user' | 'assistant'; text: string; pending?: boolean }

const INTRO =
  'Hi there! 👋 Ask about skills, projects, experience, certificates, or contact — I answer from the same details shown on this site.'

/** Offline fallback: same facts as the site, written as direct answers (no “see the card” directions). */
const SKILLS_ANSWER = `Michael’s listed skills (with levels from the portfolio):

Front end: React.js (Advanced), TypeScript (Advanced), HTML (Expert), CSS (Expert), Tailwind CSS (Expert), JavaScript (Advanced).

Backend: Node.js (Advanced), TypeScript (Advanced), Express.js (Advanced), MongoDB (Intermediate), REST APIs (Intermediate).

Languages: Python (Advanced), C# (Intermediate), C++ (Intermediate), JavaScript (Advanced), TypeScript (Advanced).

Databases: MongoDB, MsSQL, PostgreSQL (Intermediate).

Frameworks & tools: ASP.NET (Intermediate), React, TypeScript, Node.js, Express.js; tools include Git (Intermediate), GitHub (Advanced), Figma (Intermediate), and Cursor (Intermediate).`

const CERTS_ANSWER = `Certificates (PDFs on Google Drive):

• DICT — Digital Literacy: Introduction to Data Analytics — https://drive.google.com/file/d/1347iRx78ugsrR2ZBaXS0PbXkcZ3h3GEq/view?usp=drive_link

• DICT — Internet Media and Information Literacy Training — https://drive.google.com/file/d/1sanw7z3n1ujFjX3AG6oY5WunjiqJ6KfX/view?usp=drive_link

• DICT — Creating Floor Plan and Network Design using MS Visio — https://drive.google.com/file/d/1Q1sJwhU1OJmy17LVHJltMyo0tfAjB1wL/view?usp=drive_link

• PICSPro Membership Certification — https://drive.google.com/file/d/1Xf6Y8MBav8tPOm8lb7iWS-ff5wo4N0J9/view?usp=drive_link`

function includesAny(haystack: string, needles: string[]) {
  return needles.some((n) => haystack.includes(n))
}

/** True when the message is only a short greeting (no topic words). */
function isMinimalGreetingOnly(raw: string): boolean {
  const t = raw
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/[!?.…,;:]+$/g, '')
    .trim()
  if (!t) return false
  return (
    /^(hello|hi|hey|yo|sup|hiya|howdy|hallo|kamusta)(\s*👋)?$/.test(t) ||
    /^(good\s+(morning|afternoon|evening))(\s*👋)?$/.test(t)
  )
}

/** Returns null when nothing in the portfolio script matches (caller may show CHAT_UNAVAILABLE). */
function offlinePortfolioAnswer(userRaw: string): string | null {
  const q = userRaw.toLowerCase().trim()
  if (!q) {
    return null
  }

  if (includesAny(q, ['habit streak', 'habit streaks', 'habit'])) {
    return 'Habit Streak (Habit Streaks) is a full-stack habit tracker: sign-up/in, habits with custom names and colors, calendar check-ins (including past months), current and longest streak, total check-ins, a 28-day heatmap, and edit/archive/restore/delete for habits.\n\nLive demo: https://habit-streak-three.vercel.app\nRepo: https://github.com/MichaelIanJapone/Habit-Streak'
  }

  if (includesAny(q, ['agency portal', 'agency'])) {
    return 'Agency Portal is a multi-tenant SaaS-style platform for agencies: secure sign-in, account-scoped workspaces, client/project tracking, statuses and deadlines, closing/reopening projects with rule checks, activity logging, dashboard analytics, responsive navigation, archives, and architecture aimed at production scale.\n\nLive demo: https://agency-portal-orpin.vercel.app\nRepo: https://github.com/MichaelIanJapone/Agency-Portal'
  }

  if (includesAny(q, ['project', 'portfolio', 'built', 'demo'])) {
    return 'Two projects are highlighted:\n\n1) Habit Streak — habit tracker with auth, calendars, streaks, heatmap, and habit management. Live: https://habit-streak-three.vercel.app · Repo: https://github.com/MichaelIanJapone/Habit-Streak\n\n2) Agency Portal — agency workspace and project delivery platform with analytics and logging. Live: https://agency-portal-orpin.vercel.app · Repo: https://github.com/MichaelIanJapone/Agency-Portal'
  }

  if (
    includesAny(q, [
      'tech stack',
      'technology',
      'technologies',
      'skill',
      'skills',
      'frontend',
      'backend',
      'full-stack',
      'fullstack',
      'programming',
      'stack',
      'react',
      'typescript',
      'node',
      'express',
      'mongodb',
      'python',
      'tailwind',
    ])
  ) {
    return SKILLS_ANSWER
  }

  if (includesAny(q, ['experience', 'work', 'job', 'intern', 'career', 'education', 'pup', 'degree'])) {
    return 'Experience (short timeline):\n\n• BS Information Technology — Polytechnic University of the Philippines — 2026.\n\n• Data Analyst Intern — Hometop Marketing & Development Corporation — 2025.\n\n• Lead Developer / QA — capstone “4Ps System” — 2024.\n\n• Wrote his first line of code — 2021.'
  }

  if (includesAny(q, ['certificate', 'dict', 'picspro', 'cert '])) {
    return CERTS_ANSWER
  }

  if (includesAny(q, ['contact', 'email', 'reach', 'hire', 'message'])) {
    return 'Email: michaelianjapone@gmail.com\n\nGitHub: https://github.com/MichaelIanJapone\nLinkedIn: https://www.linkedin.com/in/michael-ian-japone-530474344/\n\nHe also has a resume PDF on the portfolio (filename: Michael-Ian-Japone Resume.pdf).'
  }

  if (includesAny(q, ['resume', 'cv', 'download'])) {
    return 'The resume is a PDF on the site: /Michael-Ian-Japone%20Resume.pdf (download name Michael-Ian-Japone Resume.pdf).'
  }

  if (includesAny(q, ['location', 'where', 'based', 'philippines', 'quezon'])) {
    return "He's based in Quezon, Philippines."
  }

  if (includesAny(q, ['github', 'linkedin', 'social'])) {
    return 'GitHub: https://github.com/MichaelIanJapone\nLinkedIn: https://www.linkedin.com/in/michael-ian-japone-530474344/'
  }

  if (includesAny(q, ['thank', 'thanks', 'salamat'])) {
    return "You're welcome!"
  }

  if (includesAny(q, ['help', 'what can you', 'what do you do'])) {
    return 'Topics I can go into: skills and tech stack, the two highlighted projects, work and education timeline, certificates, and how to reach Michael (email, GitHub, LinkedIn).'
  }

  if (includesAny(q, ['who is', 'about ', 'about?', 'bio', 'introduce'])) {
    return "Michael is a Full-Stack Developer focused on React, TypeScript, and Node.js, building scalable apps with clean architecture and solid UX. He's worked on AI-powered SaaS and real-time apps using Supabase, PostgreSQL, OpenAI’s API, and WebSockets. He's especially interested in Generative AI and RAG-style systems, and he cares about collaboration, owning projects end to end, and continuous learning."
  }

  if (isMinimalGreetingOnly(userRaw)) {
    return 'Hello! 👋'
  }

  return null
}

function assistantReply(userRaw: string): string {
  return offlinePortfolioAnswer(userRaw) ?? CHAT_UNAVAILABLE
}

function IconSendArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TypingIndicator() {
  return (
    <span
      className="chatTyping"
      role="status"
      aria-live="polite"
      aria-label={`${CHAT_NAME} is typing`}
    >
      <span className="chatTypingDot" aria-hidden />
      <span className="chatTypingDot" aria-hidden />
      <span className="chatTypingDot" aria-hidden />
    </span>
  )
}

function IconChatBubbleSmall() {
  return (
    <svg className="chatFabGlyph" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3C7.03 3 3 6.58 3 11c0 2.13 1.07 4.05 2.8 5.4L5 21l4.9-1.4c1.08.36 2.24.56 3.45.56 4.97 0 9-3.58 9-8s-4.03-9-9-9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 11h.01M12 11h.01M15.5 11h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ChatWidget({ darkMode }: { darkMode: boolean }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', text: INTRO }])
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [open, messages])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  async function send() {
    const text = input.trim()
    if (!text || sending) return

    const historyForApi = messages
      .filter((m) => !m.pending)
      .map((m) => ({ role: m.role, content: m.text }))
      .concat({ role: 'user' as const, content: text })

    setInput('')
    setSending(true)
    setMessages((prev) => [...prev, { role: 'user', text }, { role: 'assistant', text: '…', pending: true }])

    const typingStartedAt = performance.now()
    let reply: string
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyForApi }),
      })
      const data: unknown = await r.json().catch(() => ({}))
      const d = data as { ok?: boolean; reply?: string }
      if (r.ok && d.ok === true && typeof d.reply === 'string' && d.reply.length > 0) {
        reply = d.reply
      } else if (r.status === 501) {
        reply = assistantReply(text)
      } else {
        reply = offlinePortfolioAnswer(text) ?? CHAT_UNAVAILABLE
      }
    } catch {
      reply = assistantReply(text)
    }

    const typingElapsed = performance.now() - typingStartedAt
    const minTypingMs =
      reply === CHAT_UNAVAILABLE ? TYPING_INDICATOR_UNKNOWN_MIN_MS : TYPING_INDICATOR_MIN_MS
    const typingRemain = minTypingMs - typingElapsed
    if (typingRemain > 0) {
      await new Promise((r) => window.setTimeout(r, typingRemain))
    }

    setMessages((prev) => {
      const next = [...prev]
      const last = next[next.length - 1]
      if (last?.role === 'assistant' && last.pending) {
        next[next.length - 1] = { role: 'assistant', text: reply }
      }
      return next
    })
    setSending(false)
  }

  return (
    <div className={`chatRoot ${darkMode ? 'chatRootDark' : ''}`}>
      {open ? (
        <div
          className="chatPanel"
          id="portfolio-chat-panel"
          role="dialog"
          aria-label="Chat with Michael"
        >
          <div className="chatPanelHeader">
            <div className="chatHeaderLead">
              <img
                className="chatHeaderAvatar"
                src={PORTRAIT_SRC}
                alt=""
                width={40}
                height={40}
                decoding="async"
              />
              <div className="chatHeaderText">
                <h2 className="chatPanelTitle">{CHAT_TITLE}</h2>
                <p className="chatOnline">
                  <span className="chatOnlineDot" aria-hidden />
                  Online
                </p>
              </div>
            </div>
            <button
              type="button"
              className="chatClose"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className="chatMessages" ref={listRef}>
            {messages.map((m, i) =>
              m.role === 'assistant' ? (
                <div key={`${i}-a`} className="chatTurn chatTurnBot">
                  <div className="chatTurnMeta">
                    <img
                      className="chatTurnAvatar"
                      src={PORTRAIT_SRC}
                      alt=""
                      width={28}
                      height={28}
                      decoding="async"
                    />
                    <span className="chatTurnName">{CHAT_NAME}</span>
                  </div>
                  <div
                    className={`chatBubble chatBubbleBot${m.pending ? ' chatBubblePending' : ''}`}
                  >
                    {m.pending ? <TypingIndicator /> : m.text}
                  </div>
                </div>
              ) : (
                <div key={`${i}-u`} className="chatTurn chatTurnUser">
                  <div className="chatBubble chatBubbleUser">{m.text}</div>
                </div>
              ),
            )}
          </div>

          <div className="chatComposer">
            <div className="chatComposerRow">
              <input
                ref={inputRef}
                className="chatInput"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !sending) {
                    e.preventDefault()
                    void send()
                  }
                }}
                placeholder="Type a message…"
                aria-label="Type a message"
                maxLength={INPUT_MAX}
                disabled={sending}
              />
              <button
                type="button"
                className="chatSend"
                onClick={() => void send()}
                disabled={!input.trim() || sending}
                aria-label="Send message"
                aria-busy={sending}
              >
                <IconSendArrow />
              </button>
            </div>
            <div className="chatComposerFooter">
              <span className="chatComposerHint">
                Ask in plain language — answers include skills, links, and project detail.
              </span>
              <span className="chatCharCount" aria-live="polite">
                {input.length}/{INPUT_MAX}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="chatFab"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={open ? 'portfolio-chat-panel' : undefined}
        aria-label={open ? 'Close chat' : CHAT_TITLE}
      >
        <IconChatBubbleSmall />
        <span className="chatFabLabel">{CHAT_TITLE}</span>
      </button>
    </div>
  )
}
