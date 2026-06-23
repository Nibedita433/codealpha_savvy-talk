// Retrieval-based knowledge base for the College Helpdesk Chatbot.
// Each intent has multiple trigger patterns and a single response.

export interface Intent {
  id: string;
  label: string;
  patterns: string[];
  response: string;
}

export const KB: Intent[] = [
  {
    id: "greeting",
    label: "Greetings",
    patterns: ["hi", "hello", "hey"],
    response:
      "Hello! Welcome to the College Helpdesk. How may I assist you today?",
  },
  {
    id: "admission",
    label: "Admissions",
    patterns: ["admission process", "how to apply", "admission"],
    response:
      "To apply for admission, fill out the online application form and submit the required documents.",
  },
  {
    id: "courses",
    label: "Courses",
    patterns: ["courses available", "available courses", "programs offered"],
    response: "We offer B.Tech, BCA, MCA, MBA, and Diploma programs.",
  },
  {
    id: "fees",
    label: "Fees",
    patterns: ["fee structure", "fees", "tuition fee"],
    response:
      "Fee structures vary by program. Please contact the admissions office for the latest details.",
  },
  {
    id: "scholarship",
    label: "Scholarships",
    patterns: ["scholarship", "financial aid"],
    response:
      "Merit-based and need-based scholarships are available for eligible students.",
  },
  {
    id: "hostel",
    label: "Hostel",
    patterns: ["hostel", "accommodation"],
    response:
      "Separate hostel facilities are available for boys and girls with modern amenities.",
  },
  {
    id: "placement",
    label: "Placements",
    patterns: ["placement", "jobs", "career opportunities"],
    response:
      "Our placement cell assists students with internships, training, and job opportunities.",
  },
  {
    id: "contact",
    label: "Contact",
    patterns: ["contact number", "phone number", "contact"],
    response:
      "You can contact us at +91-98XXXXXXX0 or email helpdesk@college.edu.",
  },
  {
    id: "library",
    label: "Library",
    patterns: ["library", "books"],
    response:
      "Our library provides access to thousands of books, journals, and digital resources.",
  },
  {
    id: "bye",
    label: "Farewell",
    patterns: ["bye", "thank you"],
    response: "Thank you for visiting the College Helpdesk. Have a great day!",
  },
];

export const FALLBACK =
  "Sorry, I could not understand your question. Please try asking about admissions, courses, fees, hostel, placements, scholarships, or contact details.";

export const WELCOME =
  "Hi there! I'm the College Helpdesk Bot. Ask me about admissions, courses, fees, hostel, placements, scholarships, library, or contact info.";

export const SUGGESTIONS = [
  "Admission process",
  "Courses available",
  "Fee structure",
  "Scholarship",
  "Hostel",
  "Placement",
  "Contact",
];

/** Match a user query against the KB. Returns the response or null. */
export function findResponse(input: string): { response: string; intent: string } | null {
  const q = input.toLowerCase().trim();
  if (!q) return null;

  // 1) Exact pattern match
  for (const intent of KB) {
    if (intent.patterns.some((p) => p.toLowerCase() === q)) {
      return { response: intent.response, intent: intent.id };
    }
  }
  // 2) Substring / token containment match
  for (const intent of KB) {
    if (intent.patterns.some((p) => q.includes(p.toLowerCase()))) {
      return { response: intent.response, intent: intent.id };
    }
  }
  // 3) Loose word-overlap match
  const words = q.split(/\s+/).filter((w) => w.length > 2);
  for (const intent of KB) {
    if (intent.patterns.some((p) => words.some((w) => p.toLowerCase().includes(w)))) {
      return { response: intent.response, intent: intent.id };
    }
  }
  return null;
}
