import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base: P = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconWave = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 10v4M7.5 6.5v11M12 3.5v17M16.5 6.5v11M21 10v4" />
  </svg>
);

export const IconEye = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M12 2.2v2.2M12 19.6v2.2M2.2 12h2.2M19.6 12h2.2" opacity="0.55" />
  </svg>
);

export const IconControl = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 4h4M4 4v4M20 4h-4M20 4v4M4 20h4M4 20v-4M20 20h-4M20 20v-4" />
    <path d="M10.4 9.4l7.2 2.7-3.2 1.3-1.3 3.2z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconFlow = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="5" cy="12" r="2.2" />
    <circle cx="19" cy="5" r="2.2" />
    <circle cx="19" cy="19" r="2.2" />
    <path d="M7 11l9.9-4.9M7 13l9.9 4.9" />
  </svg>
);

export const IconMemory = (p: P) => (
  <svg {...base} {...p}>
    <rect x="4" y="4" width="16" height="16" rx="1" />
    <path d="M9.3 4v16M14.6 4v16M4 9.3h16M4 14.6h16" opacity="0.6" />
    <rect x="10.6" y="10.6" width="2.8" height="2.8" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPlugin = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3l6.5 3.75v7.5L12 21l-6.5-3.75v-7.5L12 3z" />
    <path d="M12 8v8M8.5 10l7 4M15.5 10l-7 4" opacity="0.65" />
  </svg>
);

export const IconRadar = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3a9 9 0 1 1-9 9" />
    <path d="M12 7a5 5 0 1 1-5 5" opacity="0.55" />
    <path d="M12 12l6.4-6.4" />
    <circle cx="15" cy="14.6" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconSliders = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
    <circle cx="9" cy="7" r="1.8" fill="currentColor" stroke="none" />
    <circle cx="15" cy="12" r="1.8" fill="currentColor" stroke="none" />
    <circle cx="7" cy="17" r="1.8" fill="currentColor" stroke="none" />
  </svg>
);

export const IconAdapt = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 12a8 8 0 1 1-2.3-5.6" />
    <path d="M20 3.5V8h-4.5" />
    <circle cx="12" cy="12" r="2.4" />
  </svg>
);

export const IconLock = (p: P) => (
  <svg {...base} {...p}>
    <rect x="5.5" y="10.5" width="13" height="9.5" rx="1" />
    <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" />
    <path d="M12 14.2v2.2" />
  </svg>
);

export const IconWindows = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 5.6L11 4.6V11H4zM13 4.3l7-1V11h-7zM4 13h7v6.4l-7-1zM13 13h7v7.7l-7-1z" />
  </svg>
);

export const IconArchive = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="7" width="17" height="13" rx="1" />
    <path d="M3.5 7L6 3.5h12L20.5 7" />
    <path d="M12 9.2v1.6M12 12.4v1.6M12 15.6V17" />
  </svg>
);

export const IconSound = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 9.5v5h3.5L12 19V5L7.5 9.5H4z" />
    <path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" />
  </svg>
);

export const IconMute = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 9.5v5h3.5L12 19V5L7.5 9.5H4z" />
    <path d="M16 9.5l5 5M21 9.5l-5 5" />
  </svg>
);

export const IconClose = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconArrowR = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconChevronD = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const IconPower = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3v8" />
    <path d="M6.3 6.5a8 8 0 1 0 11.4 0" />
  </svg>
);

export const ICON_MAP: Record<string, (p: P) => ReturnType<typeof IconWave>> = {
  wave: IconWave,
  eye: IconEye,
  control: IconControl,
  flow: IconFlow,
  memory: IconMemory,
  plugin: IconPlugin,
  radar: IconRadar,
  sliders: IconSliders,
  adapt: IconAdapt,
};
