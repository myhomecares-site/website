// Incident report field schema — shared by the form, the email summary, and
// storage so labels and keys never drift.

export type IRField =
  | { kind: "text"; name: string; label: string; type?: string; required?: boolean; half?: boolean }
  | { kind: "textarea"; name: string; label: string; hint?: string; required?: boolean }
  | { kind: "checks"; name: string; label: string; options: string[] }
  | { kind: "radio"; name: string; label: string; options: string[] };

export type IRSection = { title: string; intro?: string; fields: IRField[] };

export const INCIDENT_SECTIONS: IRSection[] = [
  {
    title: "Part A · Who and what",
    intro: "Fill this in first. Never leave a blank — write “Unknown.”",
    fields: [
      { kind: "text", name: "report_date", label: "Date of report", type: "date", half: true },
      { kind: "text", name: "preparer_name", label: "Your name & title", required: true, half: true },
      { kind: "text", name: "preparer_email", label: "Your email (you'll receive a copy)", type: "email", required: true, half: true },
      { kind: "text", name: "client_name", label: "Client name", required: true, half: true },
      { kind: "text", name: "caregiver_name", label: "Caregiver name & ID", half: true },
      { kind: "text", name: "others", label: "Anyone else (name + relationship)" },
      { kind: "checks", name: "incident_types", label: "What kind of incident? (check all that apply)", options: ["Money / property", "Abuse or neglect", "Injury or fall", "Medication", "Missed / late shift", "Policy violation", "Complaint", "Other"] },
      { kind: "text", name: "incident_other", label: "If “Other,” describe" },
      { kind: "radio", name: "severity", label: "How serious?", options: ["Routine — no ongoing risk", "High — policy broken, no immediate danger", "Urgent — client may be at risk (tell the Administrator today)"] },
    ],
  },
  {
    title: "Part B · What you were told",
    intro: "Just the account — don't judge it yet.",
    fields: [
      { kind: "textarea", name: "b1_what_happened", label: "What happened?", hint: "2–5 plain sentences: who, what, when, how much. Someone new to the case should follow it from this alone.", required: true },
      { kind: "textarea", name: "b2_timeline", label: "Timeline of events", hint: "Oldest first. Date / time · what happened · who told you and how." },
      { kind: "textarea", name: "b3_accounts", label: "Who said what", hint: "One person per line. Quote exact words for admissions, threats, or refusals." },
    ],
  },
  {
    title: "Part C · What we actually know",
    fields: [
      { kind: "textarea", name: "c1_confirmed", label: "Confirmed", hint: "Two or more people agree, or a document proves it." },
      { kind: "textarea", name: "c2_alleged", label: "Alleged (not verified)", hint: "One person's word only. Don't move it up without proof." },
      { kind: "textarea", name: "c3_money", label: "Money / property", hint: "Amount, from → to, how, what for, still owed — or write “No money involved.”" },
    ],
  },
  {
    title: "Part D · What the agency did",
    fields: [
      { kind: "checks", name: "d1_steps", label: "Steps taken", options: ["Caregiver taken off this case", "Caregiver suspended", "Client safety checked", "Client told", "Caregiver told", "Written no-contact instruction sent", "No shifts were missed"] },
      { kind: "text", name: "d1_replacement", label: "Replacement caregiver & start date" },
      { kind: "checks", name: "d2_evidence", label: "Evidence saved (screenshot/export the same day)", options: ["Texts", "Emails", "Voicemails", "Receipts", "Photos", "Schedules", "Care notes", "Other"] },
      { kind: "text", name: "d2_saved", label: "Saved where / by whom" },
      { kind: "textarea", name: "d3_reporting", label: "Reporting obligations", hint: "Abuse/neglect, financial exploitation, child abuse, licensing body, law enforcement — for each: Yes/No + to whom and when. If every line is No, one sentence why." },
    ],
  },
  {
    title: "Part E · What happens next",
    fields: [
      { kind: "textarea", name: "e1_next", label: "Still to do", hint: "What needs doing · who is doing it · by when." },
      { kind: "text", name: "policies", label: "Policies involved (name + reference #)" },
      { kind: "radio", name: "status", label: "Status", options: ["Still open", "Closed"] },
      { kind: "text", name: "closed_date", label: "Closed on", type: "date", half: true },
      { kind: "text", name: "outcome", label: "Outcome", half: true },
      { kind: "textarea", name: "e2_other", label: "Anything else / continued from above" },
      { kind: "text", name: "administrator", label: "Administrator (name)", half: true },
    ],
  },
];

export const INCIDENT_FIELDS: IRField[] = INCIDENT_SECTIONS.flatMap((s) => s.fields);
