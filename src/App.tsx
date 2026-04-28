import { useEffect, useMemo, useState, type FormEvent } from 'react'
import heroImg from './assets/Hero-Formal.jpg'
import './App.css'

type Project = {
  title: string
  description: string
  tags: string[]
  liveUrl?: string
  repoUrl?: string
}

type Toast =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }

type SkillLevel = 'Expert' | 'Advanced' | 'Intermediate' | 'Beginner'

type SkillEntry = {
  name: string
  level: SkillLevel
}

type SkillCategory = {
  title: string
  icon: 'stack' | 'code' | 'globe' | 'database' | 'layers' | 'wrench'
  skills: SkillEntry[]
}

function skillLevelWidth(level: SkillLevel) {
  switch (level) {
    case 'Expert':
      return 98
    case 'Advanced':
      return 78
    case 'Intermediate':
      return 55
    case 'Beginner':
      return 28
    default:
      return 0
  }
}

function SkillCategoryIcon({ kind }: { kind: SkillCategory['icon'] }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true as const }
  switch (kind) {
    case 'stack':
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.75" fill="none" />
          <rect x="4" y="10" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.75" fill="none" />
          <rect x="4" y="15" width="11" height="4" rx="1" stroke="currentColor" strokeWidth="1.75" fill="none" />
        </svg>
      )
    case 'code':
      return (
        <svg {...common}>
          <path
            d="m15 7-5 5 5 5M9 7l-5 5 5 5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'globe':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'database':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="1.75" />
          <path d="M5 6v6c0 1.7 3 3 7 3s7-1.3 7-3V6" stroke="currentColor" strokeWidth="1.75" />
          <path d="M5 12v6c0 1.7 3 3 7 3s7-1.3 7-3v-6" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      )
    case 'layers':
      return (
        <svg {...common}>
          <path
            d="M12 4 4 8l8 4 8-4-8-4Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path d="m4 12 8 4 8-4M4 16l8 4 8-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      )
    case 'wrench':
      return (
        <svg {...common}>
          <path
            d="M14.7 6.3a4 4 0 0 0-5.6 5.6L5 16v3h3l5.1-5.1a4 4 0 0 0 5.6-5.6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M13 8 16 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}


export default function App() {
  const name = 'Michael Ian Japone'

  const projects: Project[] = useMemo(
    () => [
      {
        title: 'Habit Streak',
        description:
          'Habit Streaks is a full-stack habit tracker. Users sign up and sign in, create habits with custom names and accent colors, and mark completion days on a month calendar (including past months). The app shows current streak, longest streak, total check-ins, and a 28-day activity heatmap. Habits can be edited, archived, restored, or deleted.',
        tags: ['React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Node.js', 'Auth.js'],
        liveUrl: 'https://habit-streak-three.vercel.app',
        repoUrl: 'https://github.com/MichaelIanJapone/Habit-Streak',
      },
      {
        title: 'Agency Portal',
        description:
          'Agency Portal is a multi-tenant SaaS platform for agencies managing clients, projects, and task delivery workflows. Users sign in securely, create account-scoped workspaces, track statuses, deadlines, and progress, and close or reopen projects with rule-based checks. It includes activity logging, dashboard analytics, mobile-responsive navigation, archived records, and role-ready architecture for scalable growth in production environments.',
        tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Prisma ORM', 'PostgreSQL', 'Clerk Authentication', 'Zod'],
        liveUrl: 'https://agency-portal-orpin.vercel.app',
        repoUrl: 'https://github.com/MichaelIanJapone/Agency-Portal',
      },
      {
        title: 'Converge Payment-to-Router',
        description:
          'This is a dual-portal SPA: customers log in, upload a payment receipt, and track requests by ID; admins review a queue, update status through a fixed pipeline, add notes, and issue a router key when complete. Built as a client-only demo with browser storage and receipt previews via data URLs.',
        tags: ['React', 'React Router', 'Vite', 'JavaScript', 'CSS'],
        liveUrl: 'https://converge-payment-to-router.vercel.app',
        repoUrl: 'https://github.com/MichaelIanJapone/Converge_Payment-to-Router',
      },
    ],
    [],
  )

  const skillCategories: SkillCategory[] = useMemo(
    () => [
      {
        title: 'Front End Development',
        icon: 'globe',
        skills: [
          { name: 'React.js', level: 'Advanced' },
          { name: 'TypeScript', level: 'Advanced' },
          { name: 'HTML', level: 'Expert' },
          { name: 'CSS', level: 'Expert' },
          { name: 'Tailwind CSS', level: 'Expert' },
          { name: 'JavaScript', level: 'Advanced' },
        ],
      },
      {
        title: 'Backend Development',
        icon: 'stack',
        skills: [
          { name: 'Node.js', level: 'Advanced' },
          { name: 'TypeScript', level: 'Advanced' },
          { name: 'Express.js', level: 'Advanced' },
          { name: 'MongoDB', level: 'Intermediate' },
          { name: 'REST APIs', level: 'Intermediate' },
        ],
      },
      {
        title: 'Programming Languages',
        icon: 'code',
        skills: [
          { name: 'Python', level: 'Advanced' },
          { name: 'C#', level: 'Intermediate' },
          { name: 'C++', level: 'Intermediate' },
          { name: 'JavaScript', level: 'Advanced' },
          { name: 'TypeScript', level: 'Advanced' },
        ],
      },  
      {
        title: 'Database Management',
        icon: 'database',
        skills: [
          { name: 'MongoDB', level: 'Intermediate' },
          { name: 'MsSQL', level: 'Intermediate' },
          {name: 'PostgreSQL', level: 'Intermediate' },
        ],
      },
      {
        title: 'Frameworks & Tools',
        icon: 'layers',
        skills: [
          { name: 'ASP.NET', level: 'Intermediate' },
          { name: 'React.js', level: 'Advanced' },
          { name: 'TypeScript', level: 'Advanced' },
          { name: 'Node.js', level: 'Advanced' },
          { name: 'Express.js', level: 'Advanced' },
        ],
      },
      {
        title: 'Tools & Technologies',
        icon: 'wrench',
        skills: [
          { name: 'Cursor', level: 'Intermediate' },
          { name: 'Figma', level: 'Intermediate' },
          { name: 'Git', level: 'Intermediate' },
          { name: 'GitHub', level: 'Advanced' },
        ],
      },
    ],
    [],
  )

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [toast, setToast] = useState<Toast | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(t)
  }, [toast])

  function scrollToSection(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (window.location.hash) {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}`,
      )
    }
  }

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmedName = form.name.trim()
    const trimmedEmail = form.email.trim()
    const trimmedMessage = form.message.trim()

    if (trimmedName.length < 2) {
      setToast({ type: 'error', message: 'Please enter your name.' })
      return 
    }
    if (!validateEmail(trimmedEmail)) {
      setToast({ type: 'error', message: 'Please enter a valid email.' })
      return
    }
    if (trimmedMessage.length < 10) {
      setToast({
        type: 'error',
        message: 'Message should be at least 10 characters.',
      })
      return
    }

    try {
      setSubmitting(true)
      const web3Key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim()
      const apiOrigin = import.meta.env.VITE_CONTACT_API_ORIGIN?.replace(/\/$/, '') ?? ''

      const resp = web3Key
        ? await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              access_key: web3Key,
              subject: `Portfolio contact from ${trimmedName}`,
              from_name: trimmedName,
              email: trimmedEmail,
              message: trimmedMessage,
            }),
          })
        : await fetch(`${apiOrigin}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: trimmedName,
              email: trimmedEmail,
              message: trimmedMessage,
            }),
          })

      const data: unknown = await resp.json().catch(() => null)

      if (web3Key) {
        const payload = data as { success?: boolean; message?: string } | null
        if (!payload?.success) {
          setToast({
            type: 'error',
            message: payload?.message?.trim() || 'Could not send message.',
          })
          return
        }
        setToast({ type: 'success', message: 'Message sent! Thank you.' })
        setForm({ name: '', email: '', message: '' })
        return
      }

      if (!resp.ok) {
        const errMsg =
          typeof data === 'object' && data && 'error' in data
            ? String((data as { error?: unknown }).error ?? 'Request failed')
            : 'Request failed'
        setToast({ type: 'error', message: errMsg })
        return
      }

      const notice =
        typeof data === 'object' && data !== null && 'notice' in data
          ? String((data as { notice?: unknown }).notice ?? '').trim()
          : ''
      setToast({
        type: 'success',
        message: notice ? `Message received. ${notice}` : 'Message sent! Thank you.',
      })
      setForm({ name: '', email: '', message: '' })
    } catch {
      setToast({
        type: 'error',
        message:
          'Network error. Run npm run dev (starts the API and site), set VITE_WEB3FORMS_ACCESS_KEY for static hosting, or set VITE_CONTACT_API_ORIGIN to your deployed API.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="portfolio">
      <a className="skipLink" href="#about">
        Skip to content
      </a>

      <header className="topNav">
        <div className="navInner">
          <div className="brand" aria-label={`${name} brand`}>
            <span className="brandDot" aria-hidden="true" />
            <span className="brandText">{name}</span>
          </div>

          <nav className="navLinks" aria-label="Primary">
            <button className="navLink" onClick={() => scrollToSection('about')}>
              About
            </button>
            <button
              className="navLink"
              onClick={() => scrollToSection('projects')}
            >
              Projects
            </button>
            <button
              className="navLink"
              onClick={() => scrollToSection('skills')}
            >
              Skills
            </button>
            <button
              className="navLink"
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </button>
          </nav>

          <button
            type="button"
            className="navCta"
            onClick={() => scrollToSection('contact')}
          >
            Let&apos;s talk
          </button>
        </div>
      </header>

      <main className="main">
        <section id="home" className="section heroSection">
          <div className="heroGrid">
            <div className="heroCopy">
              <div className="kicker">Michael Ian J. Japone</div>
              <h1 className="heroTitle">Full-Stack Developer</h1>
              <p className="heroLead">
                I'm a Full Stack Developer specializing in building scalable and 
                user-focused web applications. I enjoy transforming complex problems 
                into efficient digital solutions, together with the use of modern
                tools and technologies such as AI.
              </p>

              <div className="heroActions">
                <button
                  className="btn btnPrimary"
                  type="button"
                  onClick={() => scrollToSection('projects')}
                >
                  View Projects
                </button>
                <button
                  className="btn btnGhost"
                  type="button"
                  onClick={() => scrollToSection('contact')}
                >
                  Contact
                </button>
              </div>

            </div>

            <div className="heroVisual" aria-hidden="true">
              <div className="avatarWrap">
                <div className="avatarGlow" />
                <img src={heroImg} className="avatarImg" alt="" />
              </div>

            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="sectionHead">
            <h2>About</h2>
            <p className="sectionLead">
              I turn ideas into modern scalable websites with a goal to resolve problems.
            </p>
          </div>

          <div className="twoCol">
            <div className="card">
              <h3>What I do</h3>
              <ul className="list">
                <li>Develop full-stack web applications using modern technologies and established best practices</li>
                <li>Build scalable, efficient backend systems and well-structured REST APIs</li>
                <li>Design responsive, user-centered interfaces with a focus on clarity and usability</li>
                <li>
                  Implement secure authentication, authorization, and session handling for multi-user
                  applications
                </li>
                <li>
                  Integrate relational and document databases with REST APIs for consistent, reliable data
                  access and persistence
                </li>
              </ul>
            </div>

            <div className="card">
              <h3>Highlights</h3>
              <div className="statsGrid">
                <div className="statCard">
                  <div className="statNum">2+</div>
                  <div className="statLabel">Years Web Development</div>
                </div>
                <div className="statCard">
                  <div className="statNum">1+</div>
                  <div className="statLabel">Years Data Analysis</div>
                </div>
                <div className="statCard">
                  <div className="statNum">Advanced</div>
                  <div className="statLabel">Mastery in backend development</div>
                </div>
                <div className="statCard">
                  <div className="statNum">Advanced</div>
                  <div className="statLabel">Mastery in frontend development</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="sectionHead">
            <h2>Projects</h2>
            <p className="sectionLead">
              A few example cards you can replace with your real work.
            </p>
          </div>

          <div className="gridCards">
            {projects.map((p, idx) => (
              <article className="projectCard" key={`${p.title}-${idx}`}>
                <div className="projectTop">
                  <div className="projectIndex" aria-hidden="true">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="projectText">
                    <h3 className="projectTitle">{p.title}</h3>
                    <p className="projectDesc">{p.description}</p>
                  </div>
                </div>

                <div className="tagRow" aria-label="Technology tags">
                  {p.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className="projectActions">
                  {p.liveUrl ? (
                    <a
                      className="btn btnPrimary btnSmall"
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live
                    </a>
                  ) : (
                    <button className="btn btnPrimary btnSmall" disabled>
                      Live
                    </button>
                  )}

                  {p.repoUrl ? (
                    <a
                      className="btn btnGhost btnSmall"
                      href={p.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Code
                    </a>
                  ) : (
                    <button className="btn btnGhost btnSmall" disabled>
                      Code
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="section">
          <div className="sectionHead">
            <h2>Skills</h2>
            <p className="sectionLead">
              Tech stack grouped by focus area, with self-assessed mastery.
            </p>
          </div>

          <div className="skillsCategories">
            {skillCategories.map((cat) => (
              <div className="skillCategory" key={cat.title}>
                <div className="skillCategoryHead">
                  <span className="skillCategoryIcon">
                    <SkillCategoryIcon kind={cat.icon} />
                  </span>
                  <h3 className="skillCategoryTitle">{cat.title}</h3>
                </div>
                <ul className="skillMasteryList" aria-label={`${cat.title} skills`}>
                  {cat.skills.map((s) => {
                    const pct = skillLevelWidth(s.level)
                    const levelKey = s.level.toLowerCase()
                    return (
                      <li className="skillMasteryItem" key={`${cat.title}-${s.name}`}>
                        <div className="skillMasteryRow">
                          <span className="skillMasteryName">{s.name}</span>
                          <span
                            className={`skillMasteryLevel skillMasteryLevel--${levelKey}`}
                          >
                            {s.level}
                          </span>
                        </div>
                        <div
                          className="skillMasteryTrack"
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={pct}
                          aria-label={`${s.name}: ${s.level}`}
                        >
                          <div
                            className={`skillMasteryFill skillMasteryFill--${levelKey}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="section">
          <div className="sectionHead">
            <h2>Contact</h2>
            <p className="sectionLead">
              Want to collaborate? Send a message and I&apos;ll get back to you.
            </p>
          </div>

          <div className="contactGrid">
            <form className="contactCard" onSubmit={onSubmit} noValidate>
              <div className="fieldRow">
                <label className="field">
                  <span className="fieldLabel">Name</span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="input"
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    required
                    minLength={2}
                  />
                </label>
                <label className="field">
                  <span className="fieldLabel">Email</span>
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="input"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                  />
                </label>
              </div>

              <label className="field">
                <span className="fieldLabel">Message</span>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  className="textarea"
                  name="message"
                  placeholder="Tell me about your project..."
                  rows={5}
                  required
                  minLength={10}
                />
              </label>

              <div className="formActions">
                <button className="btn btnPrimary" type="submit" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send message'}
                </button>
                <button
                  className="btn btnGhost"
                  type="button"
                  onClick={() => setForm({ name: '', email: '', message: '' })}
                  disabled={submitting || (!form.name && !form.email && !form.message)}
                >
                  Clear
                </button>
              </div>

              <p className="formNote">
                
              </p>
            </form>

            <aside className="contactAside" aria-label="Contact details">
              <div className="card">
                <h3>Quick links</h3>
                <div className="quickLinks">
                  <a className="quickLink" href="mailto:michaelianjapone@gmail.com">
                    <span className="quickIcon" aria-hidden="true" />
                    <span>Email</span>
                  </a>
                  <a
                    className="quickLink"
                    href="https://github.com/MichaelIanJapone"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="quickIcon" aria-hidden="true" />
                    <span>GitHub</span>
                  </a>
                  <a
                    className="quickLink"
                    href="https://www.linkedin.com/in/michael-ian-japone-530474344/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="quickIcon" aria-hidden="true" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>

              <div className="card cardTight">
                <h3>Availability</h3>
                <p className="muted">
                  Currently available for frontend UI work and portfolio-ready builds.
                </p>
                <div className="availability">
                  <span className="pulseDot" aria-hidden="true" />
                  <span>Open to offers</span>
                </div>
              </div>
            </aside>
          </div>

          {toast ? (
            <div
              className={`toast ${toast.type === 'success' ? 'toastSuccess' : 'toastError'}`}
              role="status"
              aria-live="polite"
            >
              <div className="toastIcon" aria-hidden="true" />
              <div className="toastText">{toast.message}</div>
            </div>
          ) : null}
        </section>
      </main>

      <footer className="footer">
        <div className="footerInner">
          <span>
            © {new Date().getFullYear()} {name}
          </span>
          <button
            type="button"
            className="footerLink"
            onClick={() => scrollToSection('home')}
          >
            Back to top
          </button>
        </div>
      </footer>
    </div>
  )
}
