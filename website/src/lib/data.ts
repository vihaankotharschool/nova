export type FeatureId =
  | "voice"
  | "vision"
  | "control"
  | "automation"
  | "memory"
  | "plugins"
  | "awareness"
  | "interface";

export interface Feature {
  id: FeatureId;
  code: string;
  index: string;
  name: string;
  tag: string;
  desc: string;
  detail: string;
  subs: string[];
  tags: string[];
  span: string;
}

export const FEATURES: Feature[] = [
  {
    id: "voice",
    code: "MOD-01 // VOICE.AI",
    index: "01",
    name: "Voice AI",
    tag: "Speak naturally. NOVA answers in kind.",
    desc: "A full-duplex speech engine that listens continuously, parses multi-part intent and responds with a synthetic voice tuned to yours.",
    detail:
      "NOVA's speech core treats conversation as a stream, not a command line. Interject, correct yourself, chain three requests in one breath — the intent net untangles all of it. A low-latency response path keeps the loop under a blink, and an offline whisper mode keeps listening when the network drops.",
    subs: [
      "Continuous conversation — no wake-word gymnastics",
      "Multi-intent parsing in a single utterance",
      "Context-aware follow-ups and corrections",
      "Adaptive synthetic voice with persona tuning",
      "40+ languages with live translation",
      "Offline whisper mode for air-gapped rooms",
    ],
    tags: ["NEURAL-ASR", "TTS-4", "INTENT-NET"],
    span: "lg:col-span-7",
  },
  {
    id: "vision",
    code: "MOD-02 // VISION",
    index: "02",
    name: "Vision",
    tag: "A synthetic retina for screen and camera.",
    desc: "NOVA reads what you see — screens, documents, rooms — and answers questions about it in real time.",
    detail:
      "The vision module fuses screen capture and camera input into one scene graph. Point at anything and ask 'what is this', 'summarize this', 'find the difference' — NOVA segments the scene, runs OCR and recognition passes, and responds with pixel-level references you can click through.",
    subs: [
      "Real-time screen understanding",
      "Object, face-blurred and text recognition",
      "Visual Q&A — 'what's on my screen?'",
      "Document and handwriting parsing",
      "Gaze-aware focus assistance",
      "Pixel-level answer references",
    ],
    tags: ["OCR-X", "SCENE-NET", "GAZE-01"],
    span: "lg:col-span-5",
  },
  {
    id: "control",
    code: "MOD-03 // OS.BRIDGE",
    index: "03",
    name: "Computer Control",
    tag: "Your machine, operated at machine speed.",
    desc: "Mouse, keyboard, applications, files. NOVA drives your operating system the way you would — only faster and without the coffee breaks.",
    detail:
      "OS.BRIDGE speaks the native language of your desktop. It launches apps, fills forms, drags files, navigates browsers and verifies its own actions against your intent before committing. Every operation is logged to a rewindable action tape, so nothing happens in the dark.",
    subs: [
      "Application launch and live control",
      "Form filling and browser navigation",
      "Cross-app workflow execution",
      "File operations with conflict detection",
      "Self-verification before commit",
      "Rewindable action tape for every move",
    ],
    tags: ["OS-BRIDGE", "ACTION-CORE", "REWIND"],
    span: "lg:col-span-5",
  },
  {
    id: "automation",
    code: "MOD-04 // FLOW",
    index: "04",
    name: "Automation",
    tag: "Record once. Repeat flawlessly.",
    desc: "Turn any routine into a flow: record it, schedule it, or trigger it on events — with conditional logic built in.",
    detail:
      "Describe a routine in one sentence or demonstrate it once — FLOW compiles either into a deterministic execution graph. Branch on conditions, retry on failure, escalate when stuck. Flows compose with every other module, so a flow can speak, see and operate your machine mid-run.",
    subs: [
      "One-phrase routine builder",
      "Record-by-demonstration capture",
      "Schedule and event-based triggers",
      "Conditional logic chains with branches",
      "Automatic retry and error handling",
      "Flows can call Voice, Vision and Control mid-run",
    ],
    tags: ["FLOW-ENGINE", "TRIGGERS", "GRAPH-VM"],
    span: "lg:col-span-7",
  },
  {
    id: "memory",
    code: "MOD-05 // MEM.CORE",
    index: "05",
    name: "Memory",
    tag: "It remembers, so you don't have to.",
    desc: "A persistent knowledge graph of your world — every conversation, file and decision, recallable in plain language.",
    detail:
      "MEM.CORE weaves everything NOVA touches into a local-first knowledge graph. Ask 'what did I say about the render bug last Tuesday?' and it surfaces the exact thread. Memory is scoped per project, encrypted at rest, and you hold the only key — forgetfulness is a command, not a limitation.",
    subs: [
      "Persistent knowledge graph, local-first",
      "Natural-language recall across time",
      "Per-project memory scopes",
      "Encrypted vault — you hold the key",
      "Selective amnesia on command",
      "Decision history with sources",
    ],
    tags: ["MEM-CORE", "KG-BUILD", "VAULT"],
    span: "lg:col-span-4",
  },
  {
    id: "plugins",
    code: "MOD-06 // PLUGINS",
    index: "06",
    name: "Plugins",
    tag: "Extend the mind. Wire in anything.",
    desc: "An open module SDK that lets you bolt new senses and skills onto NOVA — from webhooks to full voice-driven tools.",
    detail:
      "Anything with an API can become a NOVA organ. The SDK exposes intent hooks, voice commands and flow triggers; modules hot-load without restart. Ship your own to the module exchange, or keep them private — NOVA only ever loads what you sign.",
    subs: [
      "Open module SDK with hot-loading",
      "Webhook and REST bridges",
      "Custom voice commands per module",
      "Intent hooks into the conversation stream",
      "Signed-only loading policy",
      "Module exchange ready at launch",
    ],
    tags: ["SDK-2", "HOT-LOAD", "EXCHANGE"],
    span: "lg:col-span-4",
  },
  {
    id: "awareness",
    code: "MOD-07 // SENSE",
    index: "07",
    name: "System Awareness",
    tag: "NOVA feels the machine it lives in.",
    desc: "Live telemetry of CPU, GPU, memory, battery and network — with proactive alerts before problems surface.",
    detail:
      "SENSE keeps a continuous vitals stream on your hardware and processes. It learns your machine's baseline, flags anomalies before they become failures, and shifts performance profiles on its own — silencing background noise when you render, waking early when you usually arrive.",
    subs: [
      "Live resource and process telemetry",
      "Baseline learning and anomaly alerts",
      "Smart performance profiles",
      "Network health awareness",
      "Thermal and battery forecasting",
      "Proactive cleanup suggestions",
    ],
    tags: ["SENSE-NET", "ANOMALY", "PROFILES"],
    span: "lg:col-span-4",
  },
  {
    id: "interface",
    code: "MOD-08 // UI.CORE",
    index: "08",
    name: "Customizable Interface",
    tag: "This HUD is one skin of many.",
    desc: "Reshape NOVA around you — themes, orb states, hotkey grids, voice personas and three density modes.",
    detail:
      "UI.CORE treats the interface as a living surface. The energy orb mirrors NOVA's state — listening, thinking, acting — and every hue, panel and animation is themeable. Bind any phrase or key to any action, and switch between compact, ambient and full HUD layouts without restarting.",
    subs: [
      "Full theme engine — the orb included",
      "Orb states mirror listening / thinking / acting",
      "Hotkey grid with phrase bindings",
      "Voice persona and cadence tuning",
      "Compact / ambient / full HUD layouts",
      "Per-app interface profiles",
    ],
    tags: ["UI-CORE", "THEMES", "STATE-ORB"],
    span: "lg:col-span-12",
  },
];

export interface HomeModule {
  index: string;
  name: string;
  line: string;
  icon: string;
}

export const HOME_MODULES: HomeModule[] = [
  {
    index: "01",
    name: "Voice AI",
    line: "Speak naturally. NOVA listens, parses intent and answers in kind — no wake-word gymnastics.",
    icon: "wave",
  },
  {
    index: "02",
    name: "Vision",
    line: "A synthetic retina for your screen and camera. NOVA reads what you see and answers about it.",
    icon: "eye",
  },
  {
    index: "03",
    name: "Computer Control",
    line: "Mouse, keyboard, apps, files. NOVA operates your machine the way you would — only faster.",
    icon: "control",
  },
  {
    index: "04",
    name: "Automation",
    line: "Record a routine once; NOVA repeats it flawlessly — on command, on schedule, on signal.",
    icon: "flow",
  },
  {
    index: "05",
    name: "Memory",
    line: "A persistent knowledge graph of your world. Ask what you said last Tuesday. It remembers.",
    icon: "memory",
  },
  {
    index: "06",
    name: "Adaptability",
    line: "The more you work, the more NOVA reshapes itself around your rhythm, tools and preferences.",
    icon: "adapt",
  },
];

export const BOOT_LINES = [
  "N.O.V.A KERNEL 0.9.1 — handshake initiated",
  "mounting neural lattice .............. OK",
  "sensory array calibration ............ OK",
  "omnipresence grid linked ............. OK",
  "memory vault sealed — key with operator",
  "operator presence detected",
  "welcome. NOVA is listening.",
];

export const TICKER_ITEMS = [
  "SPEECH ENGINE",
  "MACHINE VISION",
  "OS CONTROL",
  "AUTOMATION FLOWS",
  "LONG-TERM MEMORY",
  "PLUGIN SDK",
  "SYSTEM SENSE",
  "ADAPTIVE UI",
];

export const DOCTRINE = [
  {
    n: "I",
    title: "Local-first",
    body: "Your mind stays on your machine. The memory vault is encrypted at rest and the key never leaves your hands. Cloud is an option, never a requirement.",
  },
  {
    n: "II",
    title: "Always present",
    body: "NOVA is not a tab you open — it is a layer under everything you do. Hearing when you speak, seeing when you point, acting when you ask.",
  },
  {
    n: "III",
    title: "Action over answers",
    body: "A chatbot tells you how. NOVA does. Every module is wired to your operating system, so instructions end in completed work, not suggestions.",
  },
];

export const REQUIREMENTS = [
  ["OPERATING SYSTEM", "Windows 10 / 11 — 64-bit"],
  ["PROCESSOR", "4 cores or more, 2019 or newer"],
  ["MEMORY", "8 GB RAM minimum"],
  ["GRAPHICS", "Optional — accelerates the orb renderer"],
  ["STORAGE", "2 GB for core + module cache"],
  ["NETWORK", "Optional — offline core runs air-gapped"],
];

export const PHASES = [
  { code: "PHASE 01", name: "Core Stabilization", state: "ACTIVE", note: "Neural lattice and memory vault in final burn-in." },
  { code: "PHASE 02", name: "Interface Calibration", state: "QUEUED", note: "HUD skins, orb states and hotkey grid tuning." },
  { code: "PHASE 03", name: "Public Release", state: "LOCKED", note: "This bay activates. One click for the build, one for the source." },
];

export const WINDOWS_META = [
  ["PLATFORM", "Windows 10 / 11"],
  ["ARCHITECTURE", "x64"],
  ["PACKAGE", "Signed .EXE installer"],
  ["STATUS", "Encryption pending"],
];

export const SOURCE_META = [
  ["CONTENTS", "Full source + documentation"],
  ["LICENSE", "Announced at launch"],
  ["PACKAGE", ".ZIP archive"],
  ["STATUS", "Ready for transfer"],
];
