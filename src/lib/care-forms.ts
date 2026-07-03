// Field-level schemas for the interactive, printable care documentation forms.
// Rendered by <CareForm> as fill-on-screen forms that can be printed or saved as
// PDF. Built from each form's purpose; refine field lists here any time.

export type FormField = {
  name: string;
  label: string;
  type?: "text" | "date" | "time" | "number" | "tel" | "email";
  width?: "full" | "half" | "third"; // within a 6-column grid
};

export type FormBlock =
  | { kind: "fields"; title?: string; fields: FormField[] }
  | { kind: "checklist"; title: string; items: string[]; columns?: 1 | 2 | 3 }
  | { kind: "textarea"; label: string; rows?: number }
  | { kind: "scale"; title: string; min: number; max: number; labelMin?: string; labelMax?: string }
  | { kind: "table"; title?: string; columns: string[]; rows?: number; rowLabels?: string[]; note?: string }
  | { kind: "signatures"; roles: string[] }
  | { kind: "note"; text: string };

export const careFormSchemas: Record<string, FormBlock[]> = {
  "caregiver-service-plan": [
    {
      kind: "fields",
      title: "Client information",
      fields: [
        { name: "client", label: "Client name", width: "half" },
        { name: "dob", label: "Date of birth", type: "date", width: "third" },
        { name: "start", label: "Plan start date", type: "date", width: "third" },
        { name: "address", label: "Address", width: "full" },
        { name: "manager", label: "Care manager / RN", width: "half" },
        { name: "contact", label: "Primary contact", width: "half" },
      ],
    },
    { kind: "textarea", label: "Client goals & preferences", rows: 4 },
    {
      kind: "checklist",
      title: "Assigned care tasks",
      columns: 2,
      items: [
        "Bathing / showering", "Dressing & grooming", "Toileting & incontinence care",
        "Mobility & transfers", "Medication reminders", "Meal preparation",
        "Feeding assistance", "Light housekeeping", "Laundry",
        "Grocery shopping / errands", "Companionship", "Escort to appointments",
      ],
    },
    { kind: "table", title: "Visit schedule", columns: ["Day", "Start time", "End time", "Hours", "Caregiver"], rows: 7 },
    {
      kind: "fields",
      title: "Review",
      fields: [
        { name: "review", label: "Care plan review date", type: "date", width: "third" },
        { name: "nextReview", label: "Next review due", type: "date", width: "third" },
        { name: "supervisor", label: "Supervisor / RN", width: "third" },
      ],
    },
    { kind: "signatures", roles: ["Client / Representative", "Caregiver", "Supervisor / RN"] },
  ],

  "skin-assessment-sheet": [
    {
      kind: "fields",
      title: "Client information",
      fields: [
        { name: "client", label: "Client name", width: "half" },
        { name: "date", label: "Date", type: "date", width: "third" },
        { name: "assessor", label: "Assessor", width: "third" },
      ],
    },
    {
      kind: "table",
      title: "Skin assessment by area",
      columns: ["Body area", "Intact (Y/N)", "Redness", "Breakdown / stage", "Notes"],
      rowLabels: [
        "Head / ears", "Shoulders", "Elbows", "Back", "Sacrum / coccyx",
        "Buttocks", "Hips", "Knees", "Heels", "Feet / toes", "Other",
      ],
    },
    { kind: "textarea", label: "Action taken / follow-up", rows: 4 },
    { kind: "signatures", roles: ["Assessor", "Supervisor / RN"] },
  ],

  "participant-assessment-form": [
    {
      kind: "fields",
      title: "Participant information",
      fields: [
        { name: "name", label: "Name", width: "half" },
        { name: "dob", label: "Date of birth", type: "date", width: "third" },
        { name: "date", label: "Date of assessment", type: "date", width: "third" },
        { name: "address", label: "Address", width: "full" },
        { name: "phone", label: "Phone", type: "tel", width: "third" },
        { name: "language", label: "Primary language", width: "third" },
        { name: "marital", label: "Marital status", width: "third" },
      ],
    },
    { kind: "textarea", label: "Health history & diagnoses", rows: 3 },
    {
      kind: "checklist",
      title: "Current conditions",
      columns: 3,
      items: [
        "Hypertension", "Diabetes", "Heart disease", "Respiratory / COPD", "Stroke history",
        "Dementia / Alzheimer's", "Parkinson's", "Arthritis / mobility", "Vision impairment",
        "Hearing impairment", "Depression / anxiety", "Other",
      ],
    },
    {
      kind: "checklist",
      title: "Functional abilities (ADLs) — needs assistance with",
      columns: 3,
      items: [
        "Bathing", "Dressing", "Grooming", "Toileting", "Transferring", "Walking / mobility",
        "Eating", "Medication management", "Meal preparation", "Housekeeping", "Transportation", "Managing finances",
      ],
    },
    { kind: "textarea", label: "Support needs & services requested", rows: 3 },
    { kind: "table", title: "Current medications", columns: ["Medication", "Dose", "Frequency", "Prescribing physician"], rows: 6 },
    {
      kind: "fields",
      title: "Physician & pharmacy",
      fields: [
        { name: "physician", label: "Primary physician", width: "half" },
        { name: "physicianPhone", label: "Physician phone", type: "tel", width: "half" },
        { name: "pharmacy", label: "Pharmacy", width: "half" },
        { name: "pharmacyPhone", label: "Pharmacy phone", type: "tel", width: "half" },
      ],
    },
    { kind: "table", title: "Emergency contacts", columns: ["Name", "Relationship", "Phone", "Alternate phone"], rows: 3 },
    { kind: "signatures", roles: ["Participant / Representative", "Assessor"] },
  ],

  "pain-evaluation": [
    {
      kind: "fields",
      title: "Client information",
      fields: [
        { name: "client", label: "Client name", width: "half" },
        { name: "date", label: "Date", type: "date", width: "third" },
        { name: "time", label: "Time", type: "time", width: "third" },
        { name: "assessor", label: "Assessor", width: "half" },
      ],
    },
    { kind: "scale", title: "Pain level", min: 0, max: 10, labelMin: "No pain", labelMax: "Worst pain" },
    { kind: "fields", title: "Location", fields: [{ name: "location", label: "Location of pain", width: "full" }] },
    {
      kind: "checklist",
      title: "Pain quality",
      columns: 3,
      items: ["Sharp", "Dull", "Aching", "Burning", "Throbbing", "Stabbing", "Cramping", "Tingling", "Constant", "Intermittent"],
    },
    { kind: "textarea", label: "Triggers / what makes it worse", rows: 2 },
    { kind: "textarea", label: "Relief measures / what helps", rows: 2 },
    { kind: "textarea", label: "Intervention provided", rows: 2 },
    {
      kind: "fields",
      title: "Reassessment",
      fields: [
        { name: "reTime", label: "Reassessment time", type: "time", width: "third" },
        { name: "reLevel", label: "Pain level after", type: "number", width: "third" },
        { name: "reInitials", label: "Assessor initials", width: "third" },
      ],
    },
    { kind: "signatures", roles: ["Assessor / Nurse"] },
  ],

  "medication-administration-records": [
    {
      kind: "fields",
      title: "Client information",
      fields: [
        { name: "client", label: "Client name", width: "half" },
        { name: "month", label: "Month / Year", width: "third" },
        { name: "allergies", label: "Allergies", width: "third" },
      ],
    },
    { kind: "note", text: "Initial each time a dose is given. Circle the initials if a dose is refused or held, and explain in Notes. For best results, print this page in landscape." },
    {
      kind: "table",
      title: "Medications",
      columns: ["Medication", "Dose", "Route", "Frequency", "Time", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      rows: 8,
    },
    { kind: "table", title: "Initials key", columns: ["Initials", "Full name & title"], rows: 4 },
    { kind: "textarea", label: "Notes / exceptions", rows: 3 },
    { kind: "signatures", roles: ["Caregiver / Aide", "Reviewed by (RN)"] },
  ],

  "emergency-medical-data-sheet": [
    {
      kind: "fields",
      title: "Client information",
      fields: [
        { name: "name", label: "Full name", width: "half" },
        { name: "dob", label: "Date of birth", type: "date", width: "third" },
        { name: "blood", label: "Blood type", width: "third" },
        { name: "address", label: "Address", width: "full" },
        { name: "phone", label: "Phone", type: "tel", width: "third" },
        { name: "completed", label: "Date completed", type: "date", width: "third" },
      ],
    },
    { kind: "textarea", label: "Medical conditions / diagnoses", rows: 2 },
    { kind: "textarea", label: "Allergies (medications, food, other)", rows: 2 },
    { kind: "table", title: "Current medications", columns: ["Medication", "Dose", "Frequency", "Reason"], rows: 6 },
    {
      kind: "fields",
      title: "Physician & pharmacy",
      fields: [
        { name: "physician", label: "Primary physician", width: "half" },
        { name: "physicianPhone", label: "Physician phone", type: "tel", width: "half" },
        { name: "hospital", label: "Preferred hospital", width: "half" },
        { name: "pharmacy", label: "Pharmacy", width: "half" },
      ],
    },
    {
      kind: "fields",
      title: "Insurance",
      fields: [
        { name: "insurance", label: "Insurance / Medicaid ID", width: "half" },
        { name: "policy", label: "Policy number", width: "half" },
      ],
    },
    { kind: "table", title: "Emergency contacts", columns: ["Name", "Relationship", "Phone", "Alternate"], rows: 3 },
    {
      kind: "checklist",
      title: "Advance directives",
      columns: 2,
      items: ["Has advance directive", "Has DNR order", "POLST / MOLST on file", "Healthcare power of attorney"],
    },
    { kind: "fields", title: "Advance directive location", fields: [{ name: "adLocation", label: "Where documents are kept", width: "full" }] },
    { kind: "signatures", roles: ["Completed by"] },
  ],

  // Monthly caregiver log. Saves per caregiver by name + number so each aide
  // builds their own month of daily visits, and signs at the bottom.
  "caregiver-daily-log-form": [
    {
      kind: "fields",
      title: "Caregiver",
      fields: [
        { name: "caregiver", label: "Caregiver name", width: "half" },
        { name: "caregiverNo", label: "Caregiver number", width: "third" },
        { name: "month", label: "Month / Year", width: "third" },
      ],
    },
    {
      kind: "fields",
      title: "Client",
      fields: [
        { name: "client", label: "Client name", width: "half" },
        { name: "clientLoc", label: "Client location / ID", width: "half" },
      ],
    },
    { kind: "note", text: "Record each visit for the month on its own row. Note tasks, meals, and anything that changed. Sign at the bottom, then print or export at month end. For best results, print in landscape." },
    {
      kind: "table",
      title: "Daily visit log",
      columns: ["Date", "Time in", "Time out", "Hours", "Tasks, meals & observations", "Initials"],
      rows: 20,
    },
    { kind: "textarea", label: "Notes / changes in condition this month", rows: 3 },
    { kind: "signatures", roles: ["Caregiver signature", "Supervisor (if applicable)"] },
  ],
};
