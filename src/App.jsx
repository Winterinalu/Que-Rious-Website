import qrcode from 'qrcode-generator'
import { useEffect, useRef, useState } from 'react'
import queueWordmark from './assets/Images/Queue.png'
import brandLogo from './assets/Images/logo.png'
import busScene from './assets/Images/Download App (10) 1.png'
import seatIcon from './assets/Images/Download App (5) 2.png'
import locationIcon from './assets/Images/Download App (6) 2.png'
import ticketIcon from './assets/Images/Download App (7) 2.png'
import walletIcon from './assets/Images/Download App (8) 2.png'
import phoneScreen from './assets/Images/phone.png'
import './App.css'

const githubUrl = 'https://github.com'

const appDownloads = [
  {
    id: 'passenger-app',
    name: 'Passenger App',
    description: 'Reserve seats, choose a pickup stop, and follow your vehicle along a fixed route.',
    features: ['Check seat availability and choose a pickup stop', 'Follow live vehicle GPS and forecast ETAs', 'Pay a 50% deposit and scan QR for check-in', 'Ask the commuter assistant about schedules and pricing'],
    icon: seatIcon,
    downloadUrl: null,
  },
  {
    id: 'driver-app',
    name: 'Driver App',
    description: 'Manage an assigned fixed route and track passengers waiting at their pickup points.',
    features: ['View assigned fixed routes and active trips', 'Track passenger pickup locations in real time', 'Anticipate stops from booked passenger locations', 'Coordinate pickups along the assigned route'],
    icon: locationIcon,
    downloadUrl: null,
  },
]

const features = [
  {
    title: 'Seat & Pickup Reservation',
    description: 'Check open seats and choose your route and pickup stop.',
    icon: seatIcon,
  },
  {
    title: 'Live Tracking',
    description: 'Track the bus and see its predicted arrival time.',
    icon: locationIcon,
  },
  {
    title: 'E-Ticket',
    description: 'Use your digital ticket and scan onboard to check in.',
    icon: ticketIcon,
  },
  {
    title: 'Secure Payments',
    description: 'Pay a 50% deposit, then scan onboard to pay the remaining fare.',
    icon: walletIcon,
  },
]

const systemComponents = [
  {
    title: 'Passenger app',
    description: 'Seat availability, pickup selection, digital tickets, QR scanning, online deposits, ETA forecasts, and a commuter assistant.',
  },
  {
    title: 'Driver app',
    description: 'Active route assignments and real-time visibility of booked passenger pickup locations.',
  },
  {
    title: 'Admin dashboard',
    description: 'Route and fleet operations, driver account management, and transit demand and fare analytics.',
  },
  {
    title: 'Vehicle IoT module',
    description: 'ESP32 and NEO-6M GPS telemetry, plus an interior screen for dynamic QR codes covering 50% deposits, fare balances, and reservation check-ins.',
  },
]

const projectLimitations = [
  'Live QR generation and payment verification depend on cellular internet connectivity for the vehicle and passenger devices.',
  'Digital seat tracking does not physically enforce seating; the conductor remains responsible for supervision.',
  'Unclaimed reservations expire after a configured grace period once the vehicle passes the selected pickup stop.',
]

const projectTeam = [
  'Acupan, Riyanne Franczesca F.',
  'Andulan, Robert Joniel C.',
  'Bulan, Jony Chen B.',
  'Lerio, Wendelyn',
  'Pedriña, Princess Diana A.',
]

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <img src={brandLogo} alt="" />
    </span>
  )
}

function BrandWordmark() {
  return (
    <span className="brand-wordmark" aria-hidden="true">
      <img src={queueWordmark} alt="" />
    </span>
  )
}

function DownloadQr({ value }) {
  const qr = qrcode(0, 'H')
  qr.addData(value)
  qr.make()

  const moduleCount = qr.getModuleCount()
  const path = []

  for (let row = 0; row < moduleCount; row += 1) {
    for (let column = 0; column < moduleCount; column += 1) {
      if (qr.isDark(row, column)) {
        path.push(`M${column + 4} ${row + 4}h1v1h-1z`)
      }
    }
  }

  return (
    <svg className="download-qr-image" viewBox={`0 0 ${moduleCount + 8} ${moduleCount + 8}`} role="img" aria-label="QR code linking to GitHub">
      <rect width="100%" height="100%" fill="#fff" />
      <path d={path.join('')} fill="#111" />
    </svg>
  )
}

function DownloadQrDialog({ app, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  return (
    <dialog
      className="download-qr-dialog"
      ref={dialogRef}
      aria-labelledby="download-qr-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          event.currentTarget.close()
        }
      }}
    >
      <form method="dialog">
        <button className="dialog-close" type="submit" aria-label="Close QR code">×</button>
      </form>
      <span className="section-tag">{app.name}</span>
      <h2 id="download-qr-title">Scan to get the app</h2>
      <p>This temporary QR opens GitHub. Replace its destination with the {app.name.toLowerCase()} APK release link when available.</p>
      <a className="dialog-qr-link" href={githubUrl} target="_blank" rel="noreferrer" aria-label="Open GitHub in a new tab">
        <DownloadQr value={githubUrl} />
      </a>
      <a className="dialog-github-link" href={githubUrl} target="_blank" rel="noreferrer">Open GitHub</a>
    </dialog>
  )
}

function App() {
  const [qrApp, setQrApp] = useState(null)
  const qrTriggerRef = useRef(null)
  const qrScrollPositionRef = useRef(0)

  function closeQrDialog() {
    setQrApp(null)
    requestAnimationFrame(() => {
      qrTriggerRef.current?.focus({ preventScroll: true })
      window.scrollTo({ top: qrScrollPositionRef.current, behavior: 'instant' })
    })
  }

  return (
    <>
      <header className="site-header" id="home">
        <a className="brand" href="#home" aria-label="Queue-rious home">
          <BrandMark />
          <BrandWordmark />
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-link" href="#passenger-app">Passenger App</a>
          <a className="nav-link" href="#driver-app">Driver App</a>
          <a className="nav-link" href="#project">Project</a>
          <a className="nav-link" href="#team">Team</a>
          <a className="button button-small" href="#downloads">Get the Apps</a>
        </nav>
      </header>

      <main>
        <div className="commute">
        <section className="hero" aria-labelledby="hero-title">
          <svg className="hero-backdrop" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="hero-sky" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffafa" />
                <stop offset="49%" stopColor="#ffe5e5" />
                <stop offset="100%" stopColor="#ffb9bb" />
              </linearGradient>
            </defs>
            <path d="M0 0 H1000 V856 C930 873 890 920 855 933 C790 960 715 992 650 995 C565 1005 470 1000 390 1000 C250 1000 120 960 0 949 Z" fill="url(#hero-sky)" />
          </svg>
          <div className="hero-scene">
            <img className="bus-scene" src={busScene} alt="A city bus waiting beside a transit stop" />
          </div>
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-icon">↗</span> Fixed-Route Transit System</p>
            <h1 id="hero-title">Book your Seat.<br />Track your ride.<br /><span>Travel with ease.</span></h1>
            <p className="hero-description">Queue-rious connects passengers and drivers on fixed transit routes. Reserve a seat, choose a pickup point, and follow vehicle updates from the app.</p>
            <a className="button hero-button" href="#downloads">
              <span className="button-phone" aria-hidden="true">▯</span>
              Get the Apps
            </a>
          </div>
          <img className="hero-phone" src={phoneScreen} alt="Queue-rious passenger app showing available routes" />
        </section>

        <section className="features" id="features" aria-labelledby="features-title">
          <div className="features-heading">
            <span className="section-tag">Features</span>
            <h2 id="features-title">A connected journey<br />from booking to boarding</h2>
            <span className="heading-rule" aria-hidden="true" />
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature" key={feature.title}>
                <img className="feature-icon" src={feature.icon} alt="" />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
        </div>

        <section className="project-overview" id="project" aria-labelledby="project-title">
          <div className="section-heading">
            <span className="section-tag">Project Proposal</span>
            <h2 id="project-title">Queue-rious: An IoT-Driven Transit<br />and Seat Reservation System</h2>
            <span className="heading-rule" aria-hidden="true" />
          </div>
          <p className="project-objective">The proposed system connects passenger and driver apps, an admin dashboard, and vehicle-mounted IoT hardware. It is designed to support seat reservations, pickup coordination, live vehicle monitoring, deposits, and QR-based onboard payment and check-in.</p>
          <dl className="project-facts">
            <div><dt>Institution</dt><dd>University of Caloocan City</dd></div>
            <div><dt>Department</dt><dd>Computer Studies Department</dd></div>
            <div><dt>Course</dt><dd>CCS119: Capstone Project and Research 1</dd></div>
            <div><dt>Deployment scope</dt><dd>Fixed, predetermined transit routes</dd></div>
          </dl>
        </section>

        <section className="system-overview" aria-labelledby="system-title">
          <div className="section-heading">
            <span className="section-tag">Proposed System</span>
            <h2 id="system-title">Four parts, one transit workflow</h2>
            <span className="heading-rule" aria-hidden="true" />
          </div>
          <div className="system-component-grid">
            {systemComponents.map((component, index) => (
              <article className="system-component" key={component.title}>
                <span className="system-component-number">0{index + 1}</span>
                <h3>{component.title}</h3>
                <p>{component.description}</p>
              </article>
            ))}
          </div>
          <p className="hardware-note"><strong>Vehicle hardware:</strong> ESP32 microcontroller with NEO-6M GPS; cloud telemetry uses a lightweight messaging protocol.</p>
        </section>

        <section className="project-scope" aria-label="Project scope and limitations">
          <article className="scope-block">
            <span className="section-tag">Scope</span>
            <h2>Designed for a defined route</h2>
            <p>The proposal limits deployment and evaluation to a fixed route, such as a campus loop or local public transit line. Intended users include registered commuters, authorized transit operators, and system dispatchers.</p>
            <p>Planned passenger features include predicted ETAs based on historical transit times, traffic patterns, and live GPS data, plus an in-app RAG assistant for schedule, fare, and troubleshooting questions.</p>
          </article>
          <article className="limitations-block">
            <span className="section-tag">Limitations</span>
            <h2>Operating considerations</h2>
            <ul>
              {projectLimitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
            </ul>
          </article>
        </section>

        <section className="project-team" id="team" aria-labelledby="team-title">
          <div className="team-heading">
            <span className="section-tag">Computer Studies Department</span>
            <h2 id="team-title">A University of Caloocan City capstone</h2>
            <p>Brgy. 173, Congressional Road, Congress Ville, North Caloocan City</p>
          </div>
          <div className="team-content">
            <div className="team-roster">
              <h3>Project team</h3>
              <ol>
                {projectTeam.map((member) => <li key={member}>{member}</li>)}
              </ol>
            </div>
            <div className="team-adviser">
              <h3>Submitted to</h3>
              <p>Prof. Jayson Joble</p>
              <p className="course-credit">CCS119: Capstone Project and Research 1</p>
            </div>
          </div>
        </section>

        <section className="download-portal" id="downloads" aria-labelledby="downloads-title">
          <div className="section-heading">
            <span className="section-tag">Application Portal</span>
            <h2 id="downloads-title">Get the apps</h2>
            <span className="heading-rule" aria-hidden="true" />
            <p className="portal-intro">Select the app for your role. Download links will be published here when the application builds are ready.</p>
          </div>
          <div className="download-app-grid">
            {appDownloads.map((app) => (
              <article className="download-app-card" id={app.id} key={app.id}>
                <div className="download-app-heading">
                  <img className="download-app-icon" src={app.icon} alt="" />
                  <h3>{app.name}</h3>
                </div>
                <div className="download-app-copy">
                  <p>{app.description}</p>
                  <ul>
                    {app.features.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                  {app.downloadUrl ? (
                    <a className="button download-action" href={app.downloadUrl}>Download {app.name}</a>
                  ) : (
                    <button className="button download-action is-unavailable" type="button" disabled>Download link coming soon</button>
                  )}
                  <button
                    className="qr-action"
                    type="button"
                    onClick={(event) => {
                      qrTriggerRef.current = event.currentTarget
                      qrScrollPositionRef.current = window.scrollY
                      setQrApp(app)
                    }}
                  >
                    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                      <path d="M3 8V3h5m4 0h5v5m0 4v5h-5m-4 0H3v-5" />
                      <path d="M5 5h3v3H5zm7 0h3v3h-3zM5 12h3v3H5zm7 0h3v3h-3z" />
                    </svg>
                    Show QR
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {qrApp && <DownloadQrDialog app={qrApp} onClose={closeQrDialog} />}

      <footer className="site-footer" id="contact">
        <div className="footer-grid">
          <div className="footer-identity">
            <a className="brand" href="#home" aria-label="Queue-rious home">
              <BrandMark />
              <BrandWordmark />
            </a>
            <p>IoT-Driven Transit and Seat Reservation System</p>
            <p className="footer-school">University of Caloocan City<br />Computer Studies Department</p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <h2>Explore</h2>
            <a href="#project">Project overview</a>
            <a href="#team">Project team</a>
            <a href="#downloads">Get the apps</a>
          </nav>
          <nav className="footer-links" aria-label="Application downloads">
            <h2>Applications</h2>
            <a href="#passenger-app">Passenger app</a>
            <a href="#driver-app">Driver app</a>
            <a href="#system-title">System components</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>CCS119: Capstone Project and Research 1</p>
          <p>Queue-rious · North Caloocan City</p>
        </div>
      </footer>
    </>
  )
}

export default App
