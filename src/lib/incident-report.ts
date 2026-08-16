// Incident report field schema — shared by the form, the email summary, and
// storage so labels and keys never drift. Kept short and fast to fill.

export type IRField =
  | { kind: "text"; name: string; label: string; type?: string; required?: boolean; half?: boolean }
  | { kind: "textarea"; name: string; label: string; hint?: string; required?: boolean }
  | { kind: "checks"; name: string; label: string; options: string[] }
  | { kind: "radio"; name: string; label: string; options: string[] };

export type IRSection = { title: string; intro?: string; fields: IRField[] };

export const INCIDENT_SECTIONS: IRSection[] = [
  {
    title: "Incident report",
    intro: "File within 24 hours. Keep it factual — what was said and done. Never leave a blank; write “Unknown.”",
    fields: [
      { kind: "text", name: "report_date", label: "Date of incident", type: "date", half: true },
      { kind: "text", name: "preparer_name", label: "Your name & title", required: true, half: true },
      { kind: "text", name: "preparer_email", label: "Your email (you'll get a copy)", type: "email", required: true, half: true },
      { kind: "text", name: "client_name", label: "Client name", required: true, half: true },
      { kind: "text", name: "caregiver_name", label: "Caregiver involved (name & ID)", half: true },
      { kind: "text", name: "notified", label: "Who has been notified? (administrator, family, authorities)", half: true },
      { kind: "checks", name: "incident_types", label: "Type of incident (check all that apply)", options: ["Injury or fall", "Medication", "Abuse or neglect", "Money / property", "Missed / late shift", "Policy violation", "Complaint", "Other"] },
      { kind: "radio", name: "severity", label: "How serious?", options: ["Routine", "High", "Urgent — tell the administrator today"] },
      { kind: "textarea", name: "b1_what_happened", label: "What happened?", hint: "Who, what, when, where. Quote exact words where you can.", required: true },
      { kind: "textarea", name: "action_taken", label: "What was done about it?", hint: "Steps taken, who was told, and any follow-up still needed." },
    ],
  },
];

export const INCIDENT_FIELDS: IRField[] = INCIDENT_SECTIONS.flatMap((s) => s.fields);
