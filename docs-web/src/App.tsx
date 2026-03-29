import type { ReactNode } from "react";
import {
  ArrowRight,
  Database,
  ExternalLink,
  Github,
  Layers3,
  Link2,
  MoveRight,
  Smartphone,
} from "lucide-react";
import { Card } from "@shared/components/ui/card";
import { Pill } from "@shared/components/ui/pill";
import {
  architectureLayers,
  featureGroups,
  figmaPrinciples,
  figmaTokens,
  flowSteps,
  heroHighlights,
  heroStats,
  navLinks,
  relationshipCards,
  roadmapItems,
  screenGroups,
  stackGroups,
  summaryCards,
  userGroups,
} from "./content";

const FIGMA_URL = "https://www.figma.com/design/g6B8rdArAYxby84qt4Kx8v/Medicine-App?node-id=0-1&t=2qSdIlkr0q8SBp8N-1";
const REPO_URL = "https://github.com/nghuax/medicine_app";

function withBase(path: string) {
  return `${import.meta.env.BASE_URL}${path}`.replace(/\/{2,}/g, "/");
}

function SectionHeading({
  eyebrow,
  title,
  body,
  actions,
}: {
  eyebrow: string;
  title: string;
  body: string;
  actions?: ReactNode;
}) {
  return (
    <div className="docs-section-heading">
      <div>
        <p className="docs-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <p className="docs-section-copy">{body}</p>
      {actions ? <div className="docs-section-actions">{actions}</div> : null}
    </div>
  );
}

function App() {
  const productLinks = [
    { label: "Open mobile app", href: withBase("app/"), tone: "primary" as const },
    { label: "Open admin dashboard", href: withBase("admin/"), tone: "secondary" as const },
    { label: "Open no-login demo", href: withBase("app-skip-login/"), tone: "ghost" as const },
  ];

  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className="docs-shell">
        <header className="docs-header">
          <div className="docs-header__brand">
            <div className="docs-mark" aria-hidden="true">
              <HeartSymbol />
            </div>
            <div>
              <p className="docs-brand-title">MediFlow</p>
              <p className="docs-brand-subtitle">System overview</p>
            </div>
          </div>
          <nav aria-label="Section navigation" className="docs-nav">
            {navLinks.map((link) => (
              <a href={`#${link.id}`} key={link.id}>
                {link.label}
              </a>
            ))}
          </nav>
          <a className="docs-inline-link" href={REPO_URL} rel="noreferrer" target="_blank">
            <Github size={16} />
            Repository
          </a>
        </header>

        <main id="content" className="docs-main">
          <section className="docs-hero">
            <div className="docs-hero__copy">
              <Pill tone="lime">Medicine tracking system</Pill>
              <h1>
                A calm, connected health platform for medicine adherence, daily wellness, and care-team operations.
              </h1>
              <p className="docs-lead">
                MediFlow combines a mobile-first member experience, an admin operations dashboard, and a shared Convex
                backend so medication routines, product intelligence, reminders, and follow-up rules all live in one
                product system.
              </p>
              <div className="docs-hero__meta">
                <a className="docs-inline-link docs-inline-link--surface" href={FIGMA_URL} rel="noreferrer" target="_blank">
                  <Link2 size={16} />
                  Figma system
                </a>
                <a className="docs-inline-link docs-inline-link--surface" href={REPO_URL} rel="noreferrer" target="_blank">
                  <Github size={16} />
                  Source repo
                </a>
                <Pill tone="white">GitHub Pages ready</Pill>
              </div>
              <div className="docs-link-row">
                {productLinks.map((link) => (
                  <a className={`docs-action docs-action--${link.tone}`} href={link.href} key={link.href}>
                    {link.label}
                    <ArrowRight size={18} />
                  </a>
                ))}
              </div>
              <div className="docs-stat-grid">
                {heroStats.map((item) => (
                  <Card className="docs-stat-card" key={item.label} tone="surface">
                    <p className="docs-stat-value">{item.value}</p>
                    <p className="docs-stat-label">{item.label}</p>
                    <p className="docs-stat-detail">{item.detail}</p>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="docs-hero__visual" tone="surface">
              <div className="docs-hero-board">
                <div className="docs-hero-board__topline">
                  <Pill tone="soft">Built from the Figma system canvas</Pill>
                  <span>Mobile + admin + Convex</span>
                </div>
                <div className="docs-hero-board__stack">
                  <Card className="docs-mini-card" tone="lime">
                    <div className="docs-mini-card__header">
                      <Smartphone size={18} />
                      <span>Member mobile loop</span>
                    </div>
                    <p>Home, Medicine, Daily, Scan, Status, Notifications</p>
                  </Card>
                  <Card className="docs-mini-card" tone="blue">
                    <div className="docs-mini-card__header">
                      <Layers3 size={18} />
                      <span>Admin operations</span>
                    </div>
                    <p>Products, Import, Reminders, Follow-up, Messaging</p>
                  </Card>
                  <Card className="docs-mini-card" tone="soft">
                    <div className="docs-mini-card__header">
                      <Database size={18} />
                      <span>Shared backend core</span>
                    </div>
                    <p>Convex tables, mutations, HTTP actions, seeded demo data</p>
                  </Card>
                </div>
                <div className="docs-hero-board__footer">
                  {heroHighlights.map((item) => (
                    <div className="docs-keyline" key={item.title}>
                      <item.icon size={18} />
                      <div>
                        <p>{item.title}</p>
                        <span>{item.body}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </section>

          <section className="docs-section" id="summary">
            <SectionHeading
              eyebrow="Product summary"
              title="One system, split into focused surfaces."
              body="The product is intentionally separated into experience-specific applications while still reading as one cohesive platform."
            />
            <div className="docs-summary-grid">
              {summaryCards.map((card) => (
                <Card className="docs-summary-card" key={card.title} tone={card.accent}>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </Card>
              ))}
            </div>
            <div className="docs-split-grid">
              <Card className="docs-problem-card" tone="soft">
                <p className="docs-eyebrow">Problem</p>
                <h3>Medication routines often live in fragmented reminders, notes, and disconnected care workflows.</h3>
                <p>
                  Members miss context, caregivers lack visibility, and operations teams struggle to translate product,
                  clinic, and follow-up information into a coherent day-to-day experience.
                </p>
              </Card>
              <Card className="docs-solution-card" tone="lime">
                <p className="docs-eyebrow">Solution</p>
                <h3>MediFlow turns medicine management into a structured care loop with shared data, calmer UX, and operational control.</h3>
                <p>
                  The mobile app handles the routine, the admin dashboard handles orchestration, and Convex connects
                  both sides with a common health data model.
                </p>
              </Card>
            </div>
          </section>

          <section className="docs-section" id="users">
            <SectionHeading
              eyebrow="Target users"
              title="Designed for the people who act on care, not just the people who read reports."
              body="Each surface is tuned to a different user role, but the information architecture stays aligned across the system."
            />
            <div className="docs-user-grid">
              {userGroups.map((group) => (
                <Card className="docs-user-card" key={group.title} tone="surface">
                  <group.icon className="docs-user-icon" size={22} />
                  <h3>{group.title}</h3>
                  <p>{group.body}</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="docs-section" id="features">
            <SectionHeading
              eyebrow="Key features"
              title="Feature groups follow the same structure as the product itself."
              body="The platform is organized into member routine features, admin workflow tools, and shared platform foundations."
            />
            <div className="docs-feature-grid">
              {featureGroups.map((group) => (
                <Card className="docs-feature-card" key={group.title} tone="surface">
                  <div className="docs-feature-card__header">
                    <group.icon size={20} />
                    <h3>{group.title}</h3>
                  </div>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>

          <section className="docs-section" id="flow">
            <SectionHeading
              eyebrow="End-to-end user flow"
              title="The system is built around a continuous care loop."
              body="Member actions and admin operations reinforce each other instead of living in separate products."
            />
            <ol className="docs-flow-grid">
              {flowSteps.map((step) => (
                <li className="docs-flow-step" key={step.step}>
                  <Card className="docs-flow-card" tone="surface">
                    <p className="docs-flow-number">{step.step}</p>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </Card>
                </li>
              ))}
            </ol>
          </section>

          <section className="docs-section" id="architecture">
            <SectionHeading
              eyebrow="System architecture"
              title="A shared platform underneath two distinct interfaces."
              body="The implementation separates delivery surfaces from reusable product logic, then connects them through Convex."
            />
            <div className="docs-architecture-grid">
              {architectureLayers.map((layer) => (
                <Card className="docs-architecture-card" key={layer.title} tone="surface">
                  <div className="docs-architecture-card__header">
                    <layer.icon size={20} />
                    <div>
                      <p className="docs-eyebrow">{layer.eyebrow}</p>
                      <h3>{layer.title}</h3>
                    </div>
                  </div>
                  <ul>
                    {layer.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
            <div className="docs-architecture-rail" aria-hidden="true">
              <div className="docs-architecture-rail__line" />
              <MoveRight size={18} />
              <div className="docs-architecture-rail__line" />
            </div>
            <div className="docs-relationship-grid">
              {relationshipCards.map((card) => (
                <Card className="docs-relationship-card" key={card.title} tone="soft">
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                  <ul>
                    {card.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>

          <section className="docs-section" id="figma">
            <SectionHeading
              eyebrow="System design from Figma"
              title="The documentation follows the same design logic as the product."
              body="The root Figma file defines the calm wellness visual language, the screen hierarchy, and the grouping of features across the system."
              actions={
                <a className="docs-inline-link" href={FIGMA_URL} rel="noreferrer" target="_blank">
                  <Link2 size={16} />
                  Open Figma file
                </a>
              }
            />
            <div className="docs-figma-grid">
              <Card className="docs-figma-card" tone="surface">
                <div className="docs-figma-card__header">
                  <h3>Design-system foundations</h3>
                  <Pill tone="soft">Reference canvas</Pill>
                </div>
                <p>
                  The Figma system canvas groups the product into foundations, typography, spacing and radius, shared
                  components, and an admin layout pattern. This docs site mirrors that same narrative order.
                </p>
                <div className="docs-token-grid">
                  {figmaTokens.map((token) => (
                    <div className="docs-token" key={token.label}>
                      <span className="docs-token-swatch" style={{ backgroundColor: token.value }} />
                      <div>
                        <p>{token.label}</p>
                        <span>{token.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="docs-figma-card" tone="soft">
                <h3>Visual principles carried into code</h3>
                <div className="docs-principle-list">
                  {figmaPrinciples.map((principle) => (
                    <article className="docs-principle" key={principle.title}>
                      <h4>{principle.title}</h4>
                      <p>{principle.body}</p>
                    </article>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          <section className="docs-section" id="screens">
            <SectionHeading
              eyebrow="Important screens"
              title="Each screen has a single clear role in the product."
              body="The screen map below covers the major routes in the mobile app and the admin dashboard."
            />
            <div className="docs-screen-groups">
              {screenGroups.map((group) => (
                <section className="docs-screen-group" key={group.label}>
                  <div className="docs-screen-group__heading">
                    <h3>{group.label}</h3>
                    <Pill tone="white">{group.screens.length} screens</Pill>
                  </div>
                  <div className="docs-screen-grid">
                    {group.screens.map((screen) => (
                      <Card className="docs-screen-card" key={screen.route} tone="surface">
                        <p className="docs-route">{screen.route}</p>
                        <h4>{screen.title}</h4>
                        <p>{screen.body}</p>
                      </Card>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section className="docs-section" id="stack">
            <SectionHeading
              eyebrow="Tech stack"
              title="Chosen for static delivery, shared logic, and incremental integration."
              body="The stack keeps the frontends deployable as static bundles while still supporting a meaningful backend model."
            />
            <div className="docs-stack-grid">
              {stackGroups.map((group) => (
                <Card className="docs-stack-card" key={group.title} tone="surface">
                  <h3>{group.title}</h3>
                  <ul className="docs-chip-list">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>

          <section className="docs-section" id="roadmap">
            <SectionHeading
              eyebrow="Future roadmap"
              title="The codebase is intentionally shaped for real integrations later."
              body="The current build is production-structured, but a few areas are still behind clean adapter boundaries and ready for the next implementation phase."
            />
            <div className="docs-roadmap-grid">
              {roadmapItems.map((item) => (
                <Card className="docs-roadmap-card" key={item.title} tone="surface">
                  <item.icon size={22} />
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </Card>
              ))}
            </div>
          </section>
        </main>

        <footer className="docs-footer">
          <Card className="docs-footer-card" tone="surface">
            <div>
              <p className="docs-eyebrow">Project links</p>
              <h2>Documentation, product surfaces, and source all stay connected.</h2>
            </div>
            <div className="docs-footer__links">
              <a href={withBase("app/")}>Mobile app</a>
              <a href={withBase("app-skip-login/")}>No-login demo</a>
              <a href={withBase("admin/")}>Admin dashboard</a>
              <a href={REPO_URL} rel="noreferrer" target="_blank">
                GitHub repository <ExternalLink size={16} />
              </a>
              <a href={FIGMA_URL} rel="noreferrer" target="_blank">
                Figma design file <ExternalLink size={16} />
              </a>
            </div>
          </Card>
        </footer>
      </div>
    </>
  );
}

function HeartSymbol() {
  return (
    <svg fill="none" viewBox="0 0 46 46">
      <path
        d="M23.043 39.3c-.647 0-1.295-.236-1.804-.708l-12.95-12.017C3.45 22.09 2 19.36 2 16.278 2 9.944 7.027 5 13.2 5c3.306 0 6.523 1.52 8.644 4.053C23.965 6.52 27.182 5 30.49 5 36.66 5 41.688 9.944 41.688 16.278c0 3.082-1.452 5.812-4.29 8.297l-12.95 12.017c-.51.472-1.158.708-1.805.708Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default App;
