// Retrieval-based knowledge base + intent recognition with confidence scoring.

export interface Intent {
  id: string;
  label: string;
  /** Keyword/phrase patterns. Each pattern contributes to score by token overlap. */
  patterns: string[];
  response: string;
}

export interface MatchResult {
  intent: string;
  label: string;
  response: string;
  /** Confidence 0..1 */
  confidence: number;
}

export const KB: Intent[] = [
  {
    id: "greeting",
    label: "Greetings",
    patterns: ["hi", "hello", "hey", "good morning", "good evening", "namaste"],
    response: "Hello! Welcome to the College Helpdesk. How may I assist you today?",
  },
  {
    id: "admission",
    label: "Admissions",
    patterns: [
      "admission process",
      "how to apply",
      "apply admission",
      "admission",
      "enroll",
      "application form",
      "eligibility",
    ],
    response:
      "To apply for admission, fill out the online application form on our website, upload your 10th/12th marksheets and ID proof, and submit the form. Our admissions cell will contact you within 48 hours.",
  },
  {
    id: "courses",
    label: "Courses",
    patterns: [
      "courses available",
      "available courses",
      "programs offered",
      "courses",
      "programs",
      "degrees",
      "branches",
    ],
    response:
      "We offer B.Tech (CSE, ECE, ME, CE), BCA, B.Sc, BBA, MCA, MBA, and Diploma programs.",
  },
  {
    id: "fees",
    label: "Fees",
    patterns: ["fee structure", "fees", "tuition fee", "cost", "tuition", "payment"],
    response:
      "Fee structures vary by program — typically ₹60,000 to ₹1,20,000 per year. Please contact the admissions office for the exact figure for your program.",
  },
  {
    id: "scholarship",
    label: "Scholarships",
    patterns: ["scholarship", "scholarships", "financial aid", "fee waiver", "merit"],
    response:
      "Merit-based (top 5% scorers) and need-based scholarships are available. Government schemes like NSP, post-matric, and minority scholarships are also supported.",
  },
  {
    id: "hostel",
    label: "Hostel",
    patterns: ["hostel", "accommodation", "rooms", "dorm", "boarding"],
    response:
      "Separate hostels for boys and girls with Wi-Fi, mess, 24×7 security, gym, and study rooms. Hostel fees range from ₹50,000 to ₹80,000 per year including meals.",
  },
  {
    id: "placement",
    label: "Placements",
    patterns: ["placement", "jobs", "career opportunities", "recruitment", "companies", "package"],
    response:
      "Our placement cell works with 150+ recruiters including TCS, Infosys, Wipro, Accenture, and startups. Average package: ₹4.5 LPA, highest: ₹22 LPA, with 90%+ placement rate.",
  },
  {
    id: "contact",
    label: "Contact",
    patterns: ["contact number", "phone number", "contact", "call", "email", "reach"],
    response:
      "📞 +91-98XXXXXXX0  ·  ✉️ helpdesk@college.edu  ·  🏛️ Mon–Sat, 9:00 AM – 5:00 PM",
  },
  {
    id: "library",
    label: "Library",
    patterns: ["library", "books", "ebooks", "journals", "study material"],
    response:
      "Our library has 50,000+ books, IEEE/Springer journals, e-resources, and silent study rooms. Open Mon–Sat, 8 AM – 8 PM.",
  },
  {
    id: "timing",
    label: "Timings",
    patterns: ["timing", "timings", "college hours", "open", "working hours"],
    response: "College working hours are Monday to Saturday, 8:30 AM to 4:30 PM.",
  },
  {
    id: "exam",
    label: "Examinations",
    patterns: ["exam", "exams", "examination", "results", "marks", "grading"],
    response:
      "Semester exams are held in May and November. Results are published on the student portal within 30 days. Grading follows a 10-point CGPA system.",
  },
  {
    id: "transport",
    label: "Transport",
    patterns: ["bus", "transport", "shuttle", "pickup", "transportation"],
    response:
      "College buses serve 25+ routes across the city. Annual transport fee is ₹15,000. Routes and timings are available at the transport office.",
  },
  {
    id: "events",
    label: "Events",
    patterns: ["events", "fest", "cultural", "techfest", "sports day", "activities"],
    response:
      "We host an annual cultural fest (Spectrum), techfest (TechZone), and sports week. Many departmental clubs run hackathons and workshops year-round.",
  },
  {
    id: "faculty",
    label: "Faculty",
    patterns: ["faculty", "teachers", "professors", "staff"],
    response:
      "We have 200+ qualified faculty members, including PhDs from IITs/NITs, with strong industry collaboration.",
  },
  {
    id: "bye",
    label: "Farewell",
    patterns: ["bye", "goodbye", "see you", "thank you", "thanks"],
    response: "Thank you for visiting the College Helpdesk. Have a great day!",
  },
];

export const FALLBACK =
  "Sorry, I couldn't quite understand that. Try asking about admissions, courses, fees, hostel, placements, scholarships, library, transport, exams, or contact details.";

export const WELCOME =
  "Hi there! 👋 I'm the College Helpdesk Bot. Ask me about admissions, courses, fees, hostel, placements, scholarships, library, or contact info.";

export const SUGGESTIONS = [
  "Admission process",
  "Courses available",
  "Fee structure",
  "Scholarship",
  "Hostel",
  "Placement",
  "Library",
  "Contact",
];

export interface FAQ {
  q: string;
  a: string;
}

export const FAQS: FAQ[] = [
  { q: "How do I apply for admission?", a: "Fill the online form, upload your marksheets and ID, and submit. The admissions cell calls back within 48 hours." },
  { q: "What courses do you offer?", a: "B.Tech, BCA, B.Sc, BBA, MCA, MBA, and Diploma programs across multiple branches." },
  { q: "What is the fee structure?", a: "Roughly ₹60,000–₹1,20,000 per year depending on the program. Contact admissions for exact figures." },
  { q: "Are scholarships available?", a: "Yes — merit-based, need-based, and government schemes such as NSP and post-matric scholarships." },
  { q: "Is hostel facility available?", a: "Yes, separate hostels for boys and girls with Wi-Fi, mess, gym, and 24×7 security." },
  { q: "What is the average placement package?", a: "Average ₹4.5 LPA with 90%+ placement; highest recorded package is ₹22 LPA." },
  { q: "What are the library timings?", a: "Mon–Sat, 8 AM – 8 PM, with 50,000+ books and digital resources." },
  { q: "Do you provide transport?", a: "Yes, 25+ bus routes; annual transport fee is ₹15,000." },
];

const STOP_WORDS = new Set([
  "a","an","the","is","are","do","does","i","you","me","my","your","of","to","for","in","on","at","and","or","what","how","when","where","can","could","please","tell","about","this","that",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

/**
 * Intent recognition: scores each intent against the query using token overlap
 * with its patterns. Returns the best match with a confidence in [0,1].
 * Returns null when confidence is below the threshold (fallback).
 */
export function findResponse(input: string): MatchResult | null {
  const q = input.toLowerCase().trim();
  if (!q) return null;

  // Exact pattern match -> max confidence
  for (const intent of KB) {
    if (intent.patterns.some((p) => p.toLowerCase() === q)) {
      return { intent: intent.id, label: intent.label, response: intent.response, confidence: 1 };
    }
  }

  const qTokens = tokenize(q);
  if (qTokens.length === 0) return null;

  let best: { intent: Intent; score: number } | null = null;

  for (const intent of KB) {
    let score = 0;
    for (const pattern of intent.patterns) {
      const pTokens = tokenize(pattern);
      const overlap = pTokens.filter((t) => qTokens.includes(t)).length;
      if (overlap === 0) continue;
      // Score = overlap / pattern length; substring bonus for whole-pattern hits
      let s = overlap / Math.max(pTokens.length, 1);
      if (q.includes(pattern.toLowerCase())) s += 0.5;
      if (s > score) score = s;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { intent, score };
    }
  }

  if (!best) return null;
  const confidence = Math.min(1, best.score);
  if (confidence < 0.35) return null;
  return {
    intent: best.intent.id,
    label: best.intent.label,
    response: best.intent.response,
    confidence,
  };
}
