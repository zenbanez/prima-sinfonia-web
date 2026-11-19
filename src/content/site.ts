import type { Metadata } from "next";

export type OwnerField<T = string> = {
  readonly status: "confirmed" | "todo";
  readonly value: T | null;
  readonly todoLabel: string;
  readonly candidates?: readonly string[];
};

export interface InstrumentOffering {
  readonly id: "piano" | "voice" | "violin" | "cello" | "musical-theatre";
  readonly name: string;
  readonly levels: readonly string[];
  readonly summary: string;
}

export interface FeeSchedule {
  readonly currency: string;
  readonly tiers: readonly {
    readonly name: string;
    readonly price: string;
    readonly details: string;
  }[];
}

export interface RecitalEntry {
  readonly id: string;
  readonly title: string;
  readonly dateIso: string;
  readonly displayDate: string;
  readonly summary: string;
  readonly programmeTodo: string;
  readonly photosTodo: string;
  readonly images: readonly {
    readonly src: string;
    readonly alt: string;
  }[];
}

export const site = {
  name: "Prima Sinfonia",
  fullName: "Prima Sinfonia Music School",
  baseUrl: "https://primasinfonia.banezglobal.com",
  city: "Tacloban City",
  province: "Leyte",
  countryCode: "PH",
  facebookUrl: "https://www.facebook.com/PrimaSinfonia/",
  // From the owner's own school poster (19 Nov 2026)
  tagline: {
    status: "confirmed",
    value: "Cultivating Passion, Harmony & Artistry",
    todoLabel: "",
  } as OwnerField<string>,
  contact: {
    person: "Ms. Khea",
    role: "Contact person",
    phoneDisplay: "+63 952 480 7047",
    phoneHref: "tel:+639524807047",
  },
  address: {
    status: "todo",
    value: null,
    todoLabel: "TODO: owner confirms studio address in Tacloban City",
    candidates: [
      "National Highway, Brgy. 77, Marasbaras, Tacloban City",
      "Robinsons Marasbaras, Tacloban City",
    ],
  } as OwnerField<string>,
  lcm: {
    badge: "An officially affiliated London College of Music examination location",
    officialUrl:
      "https://lcme.uwl.ac.uk/information/international-lcme-partners/asia/philippines/",
    countryPageLabel: "University of West London — LCME Philippines Partners",
    primaryCentreNote:
      "Exams in the Philippines run through the national public centre (Big Ben International Academy – Saraza Music Education System, Las Piñas City), with Prima Sinfonia listed as an official additional examination location in Tacloban City, Leyte.",
    resultsSummary:
      "Prima Sinfonia students have prepared for and passed London College of Music examinations with Distinction and Merit awards.",
  },
  audiences: [
    {
      title: "Children & Parents in Tacloban",
      body: "Foundational piano, voice, violin, and cello tuition for school-age learners — combining musical ear training, notation, and steady encouragement.",
    },
    {
      title: "Teens & Adult Learners",
      body: "Focused individual guidance for adolescents and adult beginners or returning players building skills at their own pace.",
    },
    {
      title: "Current Students & Parents",
      body: "Already enrolled at Prima Sinfonia? Use Log in to check your lesson schedule, notes, and studio materials.",
    },
  ],
  instruments: [
    {
      id: "piano",
      name: "Piano",
      levels: ["Beginner"],
      summary:
        "Keyboard fundamentals, note reading, rhythmic coordination, and age-appropriate musicianship for first-time players.",
    },
    {
      id: "voice",
      name: "Vocals",
      levels: ["Beginner", "Advanced"],
      summary:
        "Healthy breath support, vocal placement, pitch accuracy, expressive phrasing, and recital or examination readiness.",
    },
    {
      id: "violin",
      name: "Violin",
      levels: ["Beginner", "Advanced"],
      summary:
        "Posture, bow control, intonation, repertoire building, and graded preparation toward London College of Music milestones.",
    },
    {
      id: "cello",
      name: "Cello",
      levels: [],
      summary:
        "Seated posture, bowing, tone, and reading in the bass clef, building toward ensemble and recital playing.",
    },
    {
      id: "musical-theatre",
      name: "Musical Theatre",
      levels: [],
      summary:
        "Singing, speaking, and movement brought together to tell a story on stage, with songs chosen for each learner.",
    },
  ] as readonly InstrumentOffering[],
  lessonFormat: {
    summary:
      "One-on-one instruction tailored to each student's age and level, pairing practical repertoire with music reading and foundational theory.",
    detailsTodo:
      "TODO: owner confirms session duration, package structure, and rehearsal inclusions.",
  },
  // Explicitly null until the owner confirms the current fee schedule.
  fees: null as FeeSchedule | null,
  feesTodo:
    "TODO: owner confirms current lesson fees and package tiers. Please enquire for current rates.",
  about: {
    founderName: "Fenella Dawn \"Khea\" Sancho-Bañez",
    credential: "London College of Music (LCM) diploma holder",
    highlights: [
      "Performing professionally since 2006, including appearances at five-star hotels in Manila.",
      "Teaching music at international schools and studios since 2007.",
      "Early musical formation under Leo San Juan (MSE Music Studio, 2005) and later under Ely Bautista of the Filharmonika Orchestra (2008).",
    ],
    storyTodo:
      "TODO: owner reviews and approves final biography and studio origin story.",
  },
  recitals: [
    {
      id: "recital-2026-07-18",
      title: "Studio Recital — 18 July 2026",
      dateIso: "2026-07-18",
      displayDate: "18 July 2026",
      summary:
        "Our mid-year studio recital in Tacloban giving violin, piano, and voice learners stage experience in front of family and peers.",
      programmeTodo:
        "TODO: owner confirms recital programme document details for public display.",
      photosTodo:
        "TODO: awaiting parents' written photo consent list before any recital photos appear here.",
      images: [],
    },
  ] as readonly RecitalEntry[],
  enquire: {
    heading: "Enquire or Enrol",
    intro:
      "Send us a short note to ask about piano, vocals, violin, cello, or musical theatre classes, studio schedules, or London College of Music exam preparation in Tacloban City.",
    suggestedDetails: [
      "Parent or guardian's name (or your name if enquiring as an adult learner)",
      "Preferred contact method (phone number or email)",
      "Learner's age",
      "Class of interest (piano, vocals, violin, cello, or musical theatre)",
    ],
    pulseHeading: "Enquire with Prima Sinfonia",
    pulseSubheading:
      "Share a parent or learner name, how to reach you, the learner's age, and which class you are interested in.",
    pulsePlaceholder:
      "Parent name, phone/email, learner's age, and class (piano, vocals, violin, cello, or musical theatre)...",
    pulseButtonText: "Send enquiry",
    pulseAccentColor: "#1B2A4E",
  },
} as const;

export function getPulseTenantId(): string {
  const runtimeKey = "NEXT_PUBLIC_PULSE_TENANT_ID";
  return (process.env.NEXT_PUBLIC_PULSE_TENANT_ID ?? process.env[runtimeKey] ?? "").trim();
}

export const PORTAL_NOINDEX_METADATA: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
