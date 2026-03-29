import {
  Activity,
  Building2,
  ClipboardList,
  Database,
  HeartPulse,
  Layers3,
  LayoutDashboard,
  MessagesSquare,
  MoonStar,
  Pill,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";

export const heroStats = [
  { label: "Product surfaces", value: "3", detail: "Mobile app, no-login demo, admin dashboard" },
  { label: "Convex tables", value: "20", detail: "Operational, tracking, and messaging data" },
  { label: "Shared layers", value: "4", detail: "UI, adapters, utilities, and state orchestration" },
] as const;

export const summaryCards = [
  {
    title: "Mobile medicine companion",
    body: "Tracks schedules, daily habits, meals, scans, and health progress in a calm mobile-first flow.",
    accent: "lime" as const,
  },
  {
    title: "Admin operations dashboard",
    body: "Manages products, imports, reminders, follow-up rules, and direct outbound messaging from one place.",
    accent: "blue" as const,
  },
  {
    title: "Shared product platform",
    body: "Connects both experiences to a shared Convex data model, reusable UI system, and future-ready adapters.",
    accent: "surface" as const,
  },
] as const;

export const userGroups = [
  {
    icon: HeartPulse,
    title: "Patients and members",
    body: "People who need a simple daily routine for medicine adherence, hydration, movement, and scan-based insights.",
  },
  {
    icon: Users,
    title: "Caregivers and family",
    body: "Support people who need a shared understanding of status, reminders, and follow-up signals.",
  },
  {
    icon: Building2,
    title: "Clinic and pharmacy teams",
    body: "Staff who curate product information, reminder rules, and patient outreach from the admin side.",
  },
  {
    icon: ShieldCheck,
    title: "Operations and compliance owners",
    body: "Internal teams who need traceable messaging, product history, and clear workflows for intervention.",
  },
] as const;

export const featureGroups = [
  {
    icon: Smartphone,
    title: "Mobile care loop",
    items: ["Login + profile setup", "Medicine schedule and adherence", "Daily habits for water, sleep, activity", "Meal and barcode scanning", "Status charts and notification center"],
  },
  {
    icon: LayoutDashboard,
    title: "Admin workflow tools",
    items: ["Products catalog and search", "Excel import and scan-assisted product entry", "Reminder rules and avoid-consume guidance", "Follow-up builder from health results", "Direct user messaging and delivery states"],
  },
  {
    icon: Layers3,
    title: "Platform foundations",
    items: ["Shared design tokens and UI primitives", "Convex queries, mutations, and HTTP actions", "Fallback local demo mode", "Adapters for OTP, Zalo, AI meal analysis, and wearables", "GitHub Pages + cPanel-friendly static builds"],
  },
] as const;

export const flowSteps = [
  {
    step: "01",
    title: "Authenticate or enter the demo path",
    body: "A member signs in through the OTP flow or uses the skip-login experience for demos and stakeholder reviews.",
  },
  {
    step: "02",
    title: "Create a personal care baseline",
    body: "Profile details, height, blood type, and device sync preferences establish the core account context.",
  },
  {
    step: "03",
    title: "Follow the daily medicine routine",
    body: "The mobile app surfaces schedule cards, reminders, and taken / missed states with low-friction interactions.",
  },
  {
    step: "04",
    title: "Log health habits and scan inputs",
    body: "Water, sleep, activities, meal analysis, and barcode scans fill the daily health picture beyond medication alone.",
  },
  {
    step: "05",
    title: "Review trends and intervention signals",
    body: "Status screens summarize progress, while notifications and follow-up logic surface attention-worthy moments.",
  },
  {
    step: "06",
    title: "Admin teams refine the care system",
    body: "Operators import products, tune reminders, add notes, and send messages back into the member journey.",
  },
] as const;

export const architectureLayers = [
  {
    eyebrow: "Experience layer",
    title: "Three delivery surfaces",
    items: ["/app/ mobile app", "/app-skip-login/ demo app", "/admin/ admin dashboard"],
    icon: Smartphone,
  },
  {
    eyebrow: "Shared platform layer",
    title: "Reusable product primitives",
    items: ["Design tokens and cards", "Buttons, inputs, pills, segmented controls", "Shared state provider and selectors", "Adapters for external integrations"],
    icon: Layers3,
  },
  {
    eyebrow: "Backend layer",
    title: "Convex application logic",
    items: ["Queries for dashboard snapshots", "Mutations for medicines, logs, products, reminders", "HTTP actions for health, meals, and message preview"],
    icon: Sparkles,
  },
  {
    eyebrow: "Data layer",
    title: "Operational health model",
    items: ["20 typed tables across user, medicine, tracking, product, and messaging domains", "Seeded demo data for instant product walkthroughs"],
    icon: Database,
  },
] as const;

export const relationshipCards = [
  {
    title: "Frontend",
    body: "Separate Vite apps for mobile and admin consume the same shared UI language and the same Convex project.",
    bullets: ["React + Vite", "Single deployable static bundles", "Client-side routing with route-specific bases"],
  },
  {
    title: "Backend",
    body: "Convex centralizes auth-adjacent flows, seeded snapshots, product operations, and follow-up logic.",
    bullets: ["Queries and mutations", "HTTP action endpoints", "Schema-first data contracts"],
  },
  {
    title: "Database",
    body: "The schema organizes medicine adherence, daily behavior logs, products, messaging, and follow-up results as one model.",
    bullets: ["20 tables", "Indexed lookups", "Shared data source for both apps"],
  },
] as const;

export const figmaTokens = [
  { label: "Background", value: "#F5F7F0" },
  { label: "Surface", value: "#FFFFFF" },
  { label: "Surface Soft", value: "#EEF4E3" },
  { label: "Text", value: "#111827" },
  { label: "Lime 500", value: "#B9ED53" },
  { label: "Lime 700", value: "#7FBA1E" },
  { label: "Mint 100", value: "#DDF6EC" },
  { label: "Blue 100", value: "#D8F1FF" },
  { label: "Peach 100", value: "#FFE0D2" },
  { label: "Line", value: "#E5E7EB" },
] as const;

export const figmaPrinciples = [
  {
    title: "Calm healthcare surfaces",
    body: "The design system uses bright white cards on an off-white field with soft gradients and restrained shadows instead of a heavy dashboard chrome.",
  },
  {
    title: "Oversized numbers and quiet labels",
    body: "Key metrics lead with large numerical emphasis while helper copy stays compact and low-noise.",
  },
  {
    title: "Rounded modular structure",
    body: "Primary cards sit in the 28px to 32px range, creating a premium but approachable wellness feel that carries across mobile and admin.",
  },
  {
    title: "Token-driven consistency",
    body: "Shared color, spacing, radius, and motion values keep both product surfaces aligned as the system grows.",
  },
] as const;

export const screenGroups = [
  {
    label: "Mobile app",
    screens: [
      { route: "/app/login", title: "Login", body: "Mock OTP entry point with a Zalo connect affordance and clean onboarding framing." },
      { route: "/app/home", title: "Home", body: "Daily overview of adherence, reminders, and health-progress highlights." },
      { route: "/app/medicine", title: "Medicine", body: "Medication list, dosage details, reminder timing, and adherence status." },
      { route: "/app/daily", title: "Daily", body: "Water, sleep, movement, and custom activity logging in one routine screen." },
      { route: "/app/scan", title: "Scan", body: "Meal-photo analysis flow and barcode product lookup in the same scan hub." },
      { route: "/app/status", title: "Status", body: "Daily and weekly charts for calorie intake, burned energy, and streak-oriented progress." },
      { route: "/app/notifications", title: "Notifications", body: "Reminder feed for medicine, hydration, mood checks, and missed-day warnings." },
    ],
  },
  {
    label: "Admin web",
    screens: [
      { route: "/admin", title: "Overview", body: "Operational summary cards and workflow panels for the current care program." },
      { route: "/admin/products", title: "Products", body: "Searchable catalog with manual product entry and scan-assisted add flows." },
      { route: "/admin/import", title: "Import", body: "Spreadsheet import with validation, parsing feedback, and history context." },
      { route: "/admin/reminders", title: "Reminders", body: "Rule-driven reminder management for medicine and daily support prompts." },
      { route: "/admin/follow-up", title: "Follow-up", body: "Builder for escalation rules based on health-check inputs and delay conditions." },
      { route: "/admin/messages", title: "Messages", body: "Direct phone-targeted outreach with message previews and delivery statuses." },
    ],
  },
] as const;

export const stackGroups = [
  {
    title: "Frontend",
    items: ["React 19", "Vite 8", "TypeScript", "React Router", "Tailwind CSS v4", "Lucide icons", "Recharts"],
  },
  {
    title: "Forms and validation",
    items: ["React Hook Form", "Zod", "SheetJS / XLSX import parsing"],
  },
  {
    title: "Backend and data",
    items: ["Convex schema", "Queries and mutations", "HTTP actions", "Seeded demo mode"],
  },
  {
    title: "Device and integration layer",
    items: ["@zxing/browser barcode scanning", "Mock OTP adapter", "Mock Zalo connector", "Mock wearable sync", "Mock AI meal analysis"],
  },
] as const;

export const roadmapItems = [
  {
    icon: MessagesSquare,
    title: "Real messaging providers",
    body: "Replace the mock OTP and direct-message stubs with production SMS, Zalo, and notification delivery services.",
  },
  {
    icon: Activity,
    title: "Connected health signals",
    body: "Move the wearable adapter from mock sync to real HealthKit, Apple Watch, or clinic-integrated device pipelines.",
  },
  {
    icon: ScanLine,
    title: "Smarter scan intelligence",
    body: "Upgrade the meal and barcode flows with richer AI analysis, confidence handling, and nutrition enrichment.",
  },
  {
    icon: Stethoscope,
    title: "Clinical workflow expansion",
    body: "Evolve follow-up rules into richer care plans, intervention queues, and audit-friendly care-team collaboration.",
  },
] as const;

export const navLinks = [
  { id: "summary", label: "Summary" },
  { id: "features", label: "Features" },
  { id: "flow", label: "Flow" },
  { id: "architecture", label: "Architecture" },
  { id: "figma", label: "Figma" },
  { id: "screens", label: "Screens" },
  { id: "stack", label: "Stack" },
  { id: "roadmap", label: "Roadmap" },
] as const;

export const heroHighlights = [
  {
    icon: Pill,
    title: "Medication adherence",
    body: "Schedules, reminder timing, taken states, and medicine notes stay central to the product.",
  },
  {
    icon: MoonStar,
    title: "Daily wellness inputs",
    body: "Water, sleep, movement, and meal scans turn the app into a fuller health routine, not just a pill tracker.",
  },
  {
    icon: ClipboardList,
    title: "Operational oversight",
    body: "Admin teams manage product data, rules, alerts, and follow-up logic from a linked dashboard.",
  },
] as const;
