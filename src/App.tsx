import { useEffect, useState, type ReactNode } from 'react'
import { ChatWidget } from './ChatWidget'
import './App.css'

/** Remote full-page screenshot (no API key). Falls back to gradient if the image fails to load. */
function previewFromLiveUrl(liveUrl: string, width = 1200) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(liveUrl)}?w=${width}`
}

const SECTION_ICON_SVG = {
  width: 19,
  height: 19,
  viewBox: '0 0 24 24' as const,
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.55,
  'aria-hidden': true as const,
}

function IconPin(props: { className?: string }) {
  return (
    <svg className={props.className} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconMail(props: { className?: string }) {
  return (
    <svg className={props.className} width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16v12H4V6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconDownload(props: { className?: string }) {
  return (
    <svg className={props.className} width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 4v11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m8 12 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 20h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconSun(props: { className?: string }) {
  return (
    <svg className={props.className} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconMoon(props: { className?: string }) {
  return (
    <svg className={props.className} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 14.5A8.5 8.5 0 0 1 9.5 4 6.5 6.5 0 1 0 20 14.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconCertificateGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3h10a2 2 0 0 1 2 2v14l-7-3.5L5 19V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
      <path d="M9 8h6M9 11h6" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
    </svg>
  )
}

function IconOpenExternal(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M14 3h7v7M10 14L21 3M7 7H5v12h12v-5"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconLiveDemo() {
  return <IconOpenExternal className="projectLinkIcon projectLinkIconStroke" />
}

function SectionHeading({
  title,
  variant,
}: {
  title: string
  variant: 'about' | 'experience' | 'project' | 'certificates' | 'socials'
}) {
  let glyph: ReactNode = null
  switch (variant) {
    case 'about':
      glyph = (
        <svg {...SECTION_ICON_SVG}>
          <circle cx="12" cy="8" r="3.5" />
          <path
            d="M6 20.5v-1.2c0-2.6 2.4-4.8 6-4.8s6 2.2 6 4.8v1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
      break
    case 'experience':
      glyph = (
        <svg {...SECTION_ICON_SVG}>
          <path
            d="M8 8V6a4 4 0 0 1 8 0v2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="4" y="8" width="16" height="12" rx="2" strokeLinejoin="round" />
          <path d="M4 12h16" strokeLinecap="round" />
        </svg>
      )
      break
    case 'project':
      glyph = (
        <svg {...SECTION_ICON_SVG}>
          <rect x="3" y="4" width="8" height="8" rx="1.5" strokeLinejoin="round" />
          <rect x="13" y="4" width="8" height="8" rx="1.5" strokeLinejoin="round" />
          <rect x="3" y="14" width="8" height="8" rx="1.5" strokeLinejoin="round" />
          <rect x="13" y="14" width="8" height="8" rx="1.5" strokeLinejoin="round" />
        </svg>
      )
      break
    case 'certificates':
      glyph = (
        <svg {...SECTION_ICON_SVG}>
          <circle cx="12" cy="10" r="3.5" />
          <path d="M8 14 6 21l6-3 6 3-2-7" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      )
      break
    case 'socials':
      glyph = (
        <svg {...SECTION_ICON_SVG}>
          <path
            d="M10 13a5 5 0 0 1 0-7l1.2-1.2a5 5 0 0 1 7.1 7.1L16 13"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 11a5 5 0 0 1 0 7l-1.2 1.2a5 5 0 0 1-7.1-7.1L8 11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
      break
    default:
      break
  }

  return (
    <div className="sectionHeadingRow">
      <span className="sectionHeadingIcon">{glyph}</span>
      <h2>{title}</h2>
    </div>
  )
}

type Project = {
  title: string
  description: string
  liveUrl: string
  repoUrl: string
  accent: 'projectAccentOne' | 'projectAccentTwo'
  /** Optional: put a file in `public/previews/` for a sharper screenshot than the auto preview */
  previewImage?: string
}

type SkillLevel = 'Expert' | 'Advanced' | 'Intermediate'

type TechItem = {
  name: string
  iconSrc: string
  level: SkillLevel
  /** Simple Icons are black SVGs — invert on dark UI so they stay visible on dark chips */
  invertOnDark?: boolean
}

type SkillCategory = {
  title: string
  items: TechItem[]
}

/** Served from `public/Michael-Ian-Japone Resume.pdf` (space before `Resume`). */
const RESUME_PDF_HREF = encodeURI('/Michael-Ian-Japone Resume.pdf')
const RESUME_DOWNLOAD_NAME = 'Michael-Ian-Japone Resume.pdf'

const CONTACT_EMAIL = 'michaelianjapone@gmail.com'
const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?${new URLSearchParams({
  subject: 'Message from your portfolio',
  body: 'Hi Michael,\n\n',
}).toString()}`

const DEVICON =
  'https://raw.githubusercontent.com/devicons/devicon/master/icons'

/** Official brand SVGs from Simple Icons (Devicon has no Cursor logo). */
const SIMPLE_ICONS = 'https://cdn.jsdelivr.net/npm/simple-icons/icons'

const CERTIFICATES: { title: string; url: string }[] = [
  {
    title: 'DICT — Digital Literacy: Introduction to Data Analytics',
    url: 'https://drive.google.com/file/d/1347iRx78ugsrR2ZBaXS0PbXkcZ3h3GEq/view?usp=drive_link',
  },
  {
    title: 'DICT — Internet Media and Information Literacy Training',
    url: 'https://drive.google.com/file/d/1sanw7z3n1ujFjX3AG6oY5WunjiqJ6KfX/view?usp=drive_link',
  },
  {
    title: 'DICT — Creating Floor Plan and Network Design using MS Visio',
    url: 'https://drive.google.com/file/d/1Q1sJwhU1OJmy17LVHJltMyo0tfAjB1wL/view?usp=drive_link',
  },
  {
    title: 'PICSPro Membership Certification',
    url: 'https://drive.google.com/file/d/1Xf6Y8MBav8tPOm8lb7iWS-ff5wo4N0J9/view?usp=drive_link',
  },
]

const SOCIAL_LINKS: { label: string; href: string; iconSrc: string; brand: 'github' | 'linkedin' }[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/MichaelIanJapone',
    iconSrc: `${DEVICON}/github/github-original.svg`,
    brand: 'github',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/michael-ian-japone-530474344/',
    iconSrc: `${DEVICON}/linkedin/linkedin-original.svg`,
    brand: 'linkedin',
  },
]

/** Full skill matrix (names + mastery + icons) — matches your portfolio screenshot. */
const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Front End Development',
    items: [
      { name: 'React.js', iconSrc: `${DEVICON}/react/react-original.svg`, level: 'Advanced' },
      { name: 'TypeScript', iconSrc: `${DEVICON}/typescript/typescript-original.svg`, level: 'Advanced' },
      { name: 'HTML', iconSrc: `${DEVICON}/html5/html5-original.svg`, level: 'Expert' },
      { name: 'CSS', iconSrc: `${DEVICON}/css3/css3-original.svg`, level: 'Expert' },
      { name: 'Tailwind CSS', iconSrc: `${DEVICON}/tailwindcss/tailwindcss-original.svg`, level: 'Expert' },
      { name: 'JavaScript', iconSrc: `${DEVICON}/javascript/javascript-original.svg`, level: 'Advanced' },
    ],
  },
  {
    title: 'Backend Development',
    items: [
      { name: 'Node.js', iconSrc: `${DEVICON}/nodejs/nodejs-original.svg`, level: 'Advanced' },
      { name: 'TypeScript', iconSrc: `${DEVICON}/typescript/typescript-original.svg`, level: 'Advanced' },
      { name: 'Express.js', iconSrc: `${DEVICON}/express/express-original.svg`, level: 'Advanced' },
      { name: 'MongoDB', iconSrc: `${DEVICON}/mongodb/mongodb-original.svg`, level: 'Intermediate' },
      { name: 'REST APIs', iconSrc: `${DEVICON}/swagger/swagger-original.svg`, level: 'Intermediate' },
    ],
  },
  {
    title: 'Programming Languages',
    items: [
      { name: 'Python', iconSrc: `${DEVICON}/python/python-original.svg`, level: 'Advanced' },
      { name: 'C#', iconSrc: `${DEVICON}/csharp/csharp-original.svg`, level: 'Intermediate' },
      { name: 'C++', iconSrc: `${DEVICON}/cplusplus/cplusplus-original.svg`, level: 'Intermediate' },
      { name: 'JavaScript', iconSrc: `${DEVICON}/javascript/javascript-original.svg`, level: 'Advanced' },
      { name: 'TypeScript', iconSrc: `${DEVICON}/typescript/typescript-original.svg`, level: 'Advanced' },
    ],
  },
  {
    title: 'Database Management',
    items: [
      { name: 'MongoDB', iconSrc: `${DEVICON}/mongodb/mongodb-original.svg`, level: 'Intermediate' },
      { name: 'MsSQL', iconSrc: `${DEVICON}/microsoftsqlserver/microsoftsqlserver-plain.svg`, level: 'Intermediate' },
      { name: 'PostgreSQL', iconSrc: `${DEVICON}/postgresql/postgresql-original.svg`, level: 'Intermediate' },
    ],
  },
  {
    title: 'Frameworks & Tools',
    items: [
      { name: 'ASP.NET', iconSrc: `${DEVICON}/dot-net/dot-net-original.svg`, level: 'Intermediate' },
      { name: 'React.js', iconSrc: `${DEVICON}/react/react-original.svg`, level: 'Advanced' },
      { name: 'TypeScript', iconSrc: `${DEVICON}/typescript/typescript-original.svg`, level: 'Advanced' },
      { name: 'Node.js', iconSrc: `${DEVICON}/nodejs/nodejs-original.svg`, level: 'Advanced' },
      { name: 'Express.js', iconSrc: `${DEVICON}/express/express-original.svg`, level: 'Advanced' },
    ],
  },
  {
    title: 'Tools & Technologies',
    items: [
      {
        name: 'Cursor',
        iconSrc: `${SIMPLE_ICONS}/cursor.svg`,
        level: 'Intermediate',
        invertOnDark: true,
      },
      { name: 'Figma', iconSrc: `${DEVICON}/figma/figma-original.svg`, level: 'Intermediate' },
      { name: 'Git', iconSrc: `${DEVICON}/git/git-original.svg`, level: 'Intermediate' },
      { name: 'GitHub', iconSrc: `${DEVICON}/github/github-original.svg`, level: 'Advanced' },
    ],
  },
]

/** Summary rows on the dashboard card (first two categories). */
const FRONTEND_TECH = SKILL_CATEGORIES[0].items
const BACKEND_TECH = SKILL_CATEGORIES[1].items

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [activeProject, setActiveProject] = useState(0)
  const [previewBroken, setPreviewBroken] = useState(false)
  const [techStackModalOpen, setTechStackModalOpen] = useState(false)

  const projects: Project[] = [
    {
      title: 'Habit Streak',
      description:
        'Habit Streaks is a full-stack habit tracker. Users sign up and sign in, create habits with custom names and accent colors, and mark completion days on a month calendar (including past months). The app shows current streak, longest streak, total check-ins, and a 28-day activity heatmap. Habits can be edited, archived, restored, or deleted.',
      liveUrl: 'https://habit-streak-three.vercel.app',
      repoUrl: 'https://github.com/MichaelIanJapone/Habit-Streak',
      accent: 'projectAccentOne',
    },
    {
      title: 'Agency Portal',
      description:
        'Agency Portal is a multi-tenant SaaS platform for agencies managing clients, projects, and task delivery workflows. Users sign in securely, create account-scoped workspaces, track statuses, deadlines, and progress, and close or reopen projects with rule-based checks. It includes activity logging, dashboard analytics, mobile-responsive navigation, archived records, and role-ready architecture for scalable growth in production environments.',
      liveUrl: 'https://agency-portal-orpin.vercel.app',
      repoUrl: 'https://github.com/MichaelIanJapone/Agency-Portal',
      accent: 'projectAccentTwo',
    },
  ]
  const project = projects[activeProject]
  const projectCount = projects.length

  function goPrevProject() {
    setPreviewBroken(false)
    setActiveProject((i) => (i - 1 + projectCount) % projectCount)
  }

  function goNextProject() {
    setPreviewBroken(false)
    setActiveProject((i) => (i + 1) % projectCount)
  }

  useEffect(() => {
    if (!techStackModalOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setTechStackModalOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [techStackModalOpen])

  function projectPreviewSrc(p: Project, thumb?: boolean) {
    if (p.previewImage) return p.previewImage
    return previewFromLiveUrl(p.liveUrl, thumb ? 400 : 1200)
  }

  return (
    <div className={`dashboardPage ${darkMode ? 'darkMode' : ''}`}>
      <main className="dashboardShell">
        <section className="profileCard card">
          <div className="avatar">
            <img
              src="/michael-ian-japone-portrait.png"
              alt="Michael Ian Japone"
              width={200}
              height={200}
              decoding="async"
            />
          </div>
          <div className="profileInfo">
            <h1>Michael Ian Japone</h1>
            <p className="location">
              <IconPin className="locationPin" />
              <span>Quezon, Philippines</span>
            </p>
            <p className="role">Full-Stack Developer</p>
            <div className="actionRow">
              <a className="pillButton" href={CONTACT_MAILTO}>
                <IconMail />
                Send email
              </a>
              <a
                className="pillButton"
                href={RESUME_PDF_HREF}
                download={RESUME_DOWNLOAD_NAME}
                aria-label="Download resume PDF"
              >
                <IconDownload />
                Resume
              </a>
            </div>
          </div>
          <button
            type="button"
            className="toggleButton"
            onClick={() => setDarkMode((state) => !state)}
            aria-label="Toggle theme"
          >
            <IconSun className="toggleIcon toggleIconSun" />
            <IconMoon className="toggleIcon toggleIconMoon" />
            <span className="toggleKnob" />
          </button>
        </section>

        <section className="contentGrid">
          <div className="leftStack">
            <article className="card">
              <SectionHeading title="About" variant="about" />
              <p>
                I&apos;m a Full-Stack Developer with expertise in React, TypeScript, Node.js, Express.js,
                building scalable, high-performance applications that blend clean architecture with
                intuitive design. I&apos;ve developed and deployed SaaS platforms and
                real-time web applications using technologies like PostgreSQL, REST API,
                and with the help of modern tools and technologies, 
                turning complex ideas into seamless, user-centered experiences.
              </p>
              <p>
                I thrive on collaboration, problem-solving, and end-to-end project ownership,
                sharing knowledge, refining workflows, and designing systems that balance
                performance with simplicity.I&apos;m driven by curiosity, continuous learning, and
                building software that is fast, reliable, and genuinely impactful.
              </p>
            </article>

            <article className="card techStackCard">
              <div className="techStackHeader">
                <div className="techStackTitleRow">
                  <span className="techStackIcon" aria-hidden="true">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M12 2 2 7l10 5 10-5-10-5Z"
                        stroke="currentColor"
                        strokeWidth="1.55"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 12 12 17l10-5"
                        stroke="currentColor"
                        strokeWidth="1.55"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 17 12 22l10-5"
                        stroke="currentColor"
                        strokeWidth="1.55"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h2 className="techStackHeading">Tech Stack</h2>
                </div>
                <button
                  type="button"
                  className="techStackSeeAll"
                  onClick={() => setTechStackModalOpen(true)}
                >
                  See all
                  <span className="techStackChevron" aria-hidden="true">
                    ›
                  </span>
                </button>
              </div>
              <div className="techGroup">
                <h3 className="techGroupLabel">Front End Development</h3>
                <div className="skillGrid">
                  {FRONTEND_TECH.map((tech) => (
                    <div key={tech.name} className="skillItem">
                      <img
                        className={`skillIcon${tech.invertOnDark ? ' skillIconMonoDark' : ''}`}
                        src={tech.iconSrc}
                        alt=""
                        width={40}
                        height={40}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="skillLabel">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="techGroup">
                <h3 className="techGroupLabel">Backend Development</h3>
                <div className="skillGrid">
                  {BACKEND_TECH.map((tech) => (
                    <div key={tech.name} className="skillItem">
                      <img
                        className={`skillIcon${tech.invertOnDark ? ' skillIconMonoDark' : ''}`}
                        src={tech.iconSrc}
                        alt=""
                        width={40}
                        height={40}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="skillLabel">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="card">
              <div className="cardHeading">
                <SectionHeading title="Project" variant="project" />
                <div className="projectHeadingActions" role="group" aria-label="Project navigation">
                  <button
                    type="button"
                    className="projectNavBtn"
                    onClick={goPrevProject}
                    aria-label="Previous project"
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    className="projectNavBtn"
                    onClick={goNextProject}
                    aria-label="Next project"
                  >
                    &gt;
                  </button>
                  <a
                    className="projectOpenLink"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${project.title} live site`}
                  >
                    ↗
                  </a>
                </div>
              </div>
              <div className="projectList">
                <div className="projectShowcase" key={project.title}>
                  <div className="projectMedia">
                    <div className="projectPreviewFrame">
                      <div
                        className={`projectPreviewFallback ${project.accent}`}
                        aria-hidden="true"
                      />
                      {!previewBroken ? (
                        <img
                          className="projectPreviewImg"
                          src={projectPreviewSrc(project)}
                          alt={`${project.title} website preview`}
                          loading="lazy"
                          decoding="async"
                          onError={() => setPreviewBroken(true)}
                        />
                      ) : null}
                    </div>
                    <div className="projectThumbs">
                      {projects.map((item, index) => (
                        <button
                          key={item.title}
                          type="button"
                          className={`projectThumb ${index === activeProject ? 'projectThumbActive' : ''}`}
                          onClick={() => {
                            setPreviewBroken(false)
                            setActiveProject(index)
                          }}
                          aria-label={`Show ${item.title}`}
                        >
                          <img
                            src={projectPreviewSrc(item, true)}
                            alt=""
                            width={56}
                            height={36}
                            loading="lazy"
                            decoding="async"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="projectDetails">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="projectLinks">
                      <a
                        className="projectLink"
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <IconLiveDemo />
                        Live Demo
                      </a>
                      <a
                        className="projectLink"
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          className="projectLinkIcon projectLinkIconGithub"
                          src={`${DEVICON}/github/github-original.svg`}
                          alt=""
                          width={16}
                          height={16}
                          decoding="async"
                        />
                        Repo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <aside className="rightStack">
            <article className="card">
              <SectionHeading title="Experience" variant="experience" />
              <ul className="timeline">
                <li>
                  <h3>BS Information Technology</h3>
                  <p>Polytechnic University of the Philippines</p>
                  <span>2026</span>
                </li>
                <li>
                  <h3>Data Analyst Intern</h3>
                  <p>Hometop Marketing &amp; Development Corporation</p>
                  <span>2025</span>
                </li>
                <li>
                  <h3>Lead Developer / QA</h3>
                  <p>Capstone: 4Ps System</p>
                  <span>2024</span>
                </li>
                <li>
                  <h3>Hello world</h3>
                  <p>Wrote my first line of code.</p>
                  <span>2021</span>
                </li>
              </ul>
            </article>

            <article className="card">
              <SectionHeading title="Certificates" variant="certificates" />
              <div className="certificateList">
                {CERTIFICATES.map((cert) => (
                  <a
                    key={cert.url}
                    className="certificateItem"
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    title="Opens in Google Drive (new tab)"
                  >
                    <span className="certificateItemInner">
                      <span className="certificateGlyph" aria-hidden="true">
                        <IconCertificateGlyph />
                      </span>
                      <span className="certificateTitle">{cert.title}</span>
                    </span>
                  </a>
                ))}
              </div>
            </article>

            <article className="card">
              <SectionHeading title="Socials" variant="socials" />
              <div className="socialList">
                {SOCIAL_LINKS.map((item) => (
                  <a
                    key={item.href}
                    className="socialLink"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="socialLinkLeft">
                      <img
                        className={`socialLinkBrand socialLinkBrand--${item.brand}`}
                        src={item.iconSrc}
                        alt=""
                        width={22}
                        height={22}
                        decoding="async"
                      />
                      <span className="socialLinkLabel">{item.label}</span>
                    </span>
                    <IconOpenExternal className="socialLinkExtIcon" />
                  </a>
                ))}
              </div>
            </article>
          </aside>
        </section>
      </main>

      {techStackModalOpen ? (
        <div
          className="techModalBackdrop"
          role="presentation"
          onClick={() => setTechStackModalOpen(false)}
        >
          <div
            className="techModalShell card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tech-stack-page-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="techModalTopBar">
              <button
                type="button"
                className="techModalCloseX"
                onClick={() => setTechStackModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <h2 id="tech-stack-page-title" className="techModalPageTitle">
              Tech Stack
            </h2>
            <p className="techModalSubtitle">Technologies I&apos;ve used</p>
            <div className="techModalScroll">
              <div className="techModalCategoryList">
                {SKILL_CATEGORIES.map((category) => (
                  <article key={category.title} className="techModalCategoryCard">
                    <h3 className="techGroupLabel">{category.title}</h3>
                    <div className="skillGrid">
                      {category.items.map((tech, index) => (
                        <div
                          key={`${category.title}-${tech.name}-${index}`}
                          className="skillItem"
                        >
                          <img
                            className={`skillIcon${tech.invertOnDark ? ' skillIconMonoDark' : ''}`}
                            src={tech.iconSrc}
                            alt=""
                            width={40}
                            height={40}
                            loading="lazy"
                            decoding="async"
                          />
                          <span className="skillLabel">{tech.name}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <ChatWidget darkMode={darkMode} />
    </div>
  )
}
