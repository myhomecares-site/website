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
  | { kind: "note"; text: string }
  // Section banner styled like the paper form's gray section headers.
  | { kind: "heading"; text: string }
  // Grid of checkboxes: one row per rowLabel, one checkbox per column (e.g. ADL
  // level Dependent/Independent/Assist/Cue, or pressure-ulcer count by stage).
  | { kind: "checktable"; title?: string; rowLabels: string[]; columns: string[]; note?: string }
  // Skills/competency checklist: numbered item rows with Yes/No + Date + RN name.
  | { kind: "skilltable"; title?: string; items: string[]; note?: string }
  // Interactive body diagram (front + back) for pinpointing locations on the body.
  | { kind: "bodymap"; label?: string }
  // Easy signature: draw, type-to-cursive, or "unable to sign" (RN records consent).
  | { kind: "esign"; role: string };

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

  // Full Participant Assessment (Maryland HCBS Waiver style). The former Skin
  // Assessment Sheet is merged in under "Skin". Physician/pharmacy and emergency
  // contacts live on the Emergency Medical Data Sheet, so they are not repeated.
  "participant-assessment-form": [
    { kind: "heading", text: "General health" },
    {
      kind: "fields",
      title: "Participant",
      fields: [
        { name: "client", label: "Participant name", width: "half" },
        { name: "dob", label: "Date of birth", type: "date", width: "third" },
        { name: "date", label: "Date of assessment", type: "date", width: "third" },
      ],
    },
    {
      kind: "fields",
      title: "Vital signs",
      fields: [
        { name: "temp", label: "Temperature", width: "third" },
        { name: "pulse", label: "Pulse", width: "third" },
        { name: "resp", label: "Respiration", width: "third" },
        { name: "bp", label: "Blood pressure", width: "third" },
        { name: "weight", label: "Current weight", width: "third" },
        { name: "targetWeight", label: "Target weight", width: "third" },
      ],
    },
    { kind: "checklist", title: "Diet / nutrition", columns: 3, items: ["Regular", "Low salt", "Puree / chopped", "Diabetic / no concentrated sweets", "Fluid unlimited", "Fluid restricted", "Other"] },
    { kind: "checklist", title: "Changes over the past month", columns: 3, items: ["Diagnosis", "Medications", "Health status", "Hospitalization", "Falls", "Incidents", "Other", "No changes"] },
    { kind: "textarea", label: "Describe any changes", rows: 2 },

    { kind: "heading", text: "Respiratory" },
    { kind: "checklist", title: "Respiratory status", columns: 2, items: ["Within normal limits", "Cough", "Wheezing", "Never short of breath", "Short of breath walking over 20 ft or stairs", "Short of breath with moderate exertion", "Short of breath with minimal exertion", "Short of breath at rest", "Oxygen", "Aerosol / nebulizer", "Ventilator", "CPAP or BiPAP", "None"] },

    { kind: "heading", text: "Cardiovascular" },
    { kind: "checklist", title: "Cardiovascular status", columns: 2, items: ["BP and pulse within normal limits", "Rhythm regular", "Rhythm irregular", "Edema present"] },
    { kind: "fields", fields: [{ name: "edema", label: "Edema location / notes", width: "full" }] },

    { kind: "heading", text: "Pain / discomfort" },
    { kind: "checklist", title: "Pain frequency", columns: 2, items: ["No pain / does not interfere with movement", "Less often than daily", "Daily, but not constant", "All the time"] },
    { kind: "checklist", title: "Intensity", columns: 3, items: ["High", "Medium", "Low"] },
    { kind: "textarea", label: "Pain cause and treatment (use the Pain Evaluation form for full detail)", rows: 2 },

    { kind: "heading", text: "Genitourinary" },
    { kind: "checklist", title: "Genitourinary status", columns: 2, items: ["Normal", "Catheter", "Incontinent urine", "Frequency", "Pain / burning", "Distention / retention", "Hesitancy", "Hematuria", "UTI treated in past month", "Other"] },

    { kind: "heading", text: "Gastrointestinal" },
    { kind: "checklist", title: "Gastrointestinal status", columns: 2, items: ["Bowels normal", "Diarrhea", "Constipation", "Nausea", "Vomiting", "Swallowing issues", "Abdominal pain", "Anorexia", "Ostomy for elimination", "Other"] },
    { kind: "checklist", title: "Bowel incontinence frequency", columns: 2, items: ["Rarely or never", "Less than once per week", "About once per week", "Four to six times per week", "Daily", "More than once daily"] },

    { kind: "heading", text: "Neurological" },
    { kind: "checklist", title: "Cognitive functioning", columns: 1, items: ["Alert and oriented, follows directions independently", "Requires prompting (cueing, reminders)", "Requires assistance in specific situations", "Requires considerable assistance in routine situations", "Totally dependent due to coma or delirium"] },
    { kind: "checklist", title: "Speech", columns: 3, items: ["Clear and understandable", "Slurred", "Garbled", "Aphasic", "Unable to speak"] },
    { kind: "checklist", title: "Pupils and movement", columns: 3, items: ["Pupils equal", "Pupils unequal", "Movement coordinated", "Movement uncoordinated"] },
    { kind: "checktable", title: "Extremity strength", rowLabels: ["Right upper", "Left upper", "Right lower", "Left lower"], columns: ["Strong", "Weak", "Tremors", "No movement"] },

    { kind: "heading", text: "Sensory" },
    { kind: "checklist", title: "Vision (with corrective lenses if applicable)", columns: 3, items: ["Normal", "Partially impaired", "Severely impaired"] },
    { kind: "checklist", title: "Hearing (with corrective device if applicable)", columns: 3, items: ["Normal", "Partially impaired", "Severely impaired"] },

    { kind: "heading", text: "Psychosocial" },
    { kind: "checklist", title: "Behaviors reported or observed", columns: 2, items: ["Indecisiveness", "Diminished interest in activities", "Sleep disturbances", "Recent change in appetite or weight", "Agitation", "Suicide attempt", "None of the above"] },
    { kind: "checklist", title: "Receiving psychological counseling", columns: 3, items: ["Yes", "No"] },

    { kind: "heading", text: "Musculoskeletal" },
    { kind: "checklist", title: "Musculoskeletal status", columns: 2, items: ["Within normal limits", "Unsteady gait", "Altered balance", "Poor endurance", "Weakness", "Deformity", "Contracture", "Impaired range of motion", "Poor coordination", "Other"] },

    { kind: "heading", text: "Mental health" },
    { kind: "checklist", title: "Mental health status", columns: 3, items: ["Angry", "Panic", "Agitated", "Tics / spasms", "Depressed", "Flat affect", "Paranoid", "Mood swings", "Uncooperative", "Anxious", "Obsessive / compulsive", "Hostile", "Phobia", "None of above"] },

    { kind: "heading", text: "Skin" },
    { kind: "checklist", title: "Color", columns: 3, items: ["Normal", "Pale", "Red", "Irritation", "Rash"] },
    { kind: "checklist", title: "Skin intact", columns: 3, items: ["Yes", "No (complete the grid below)"] },
    { kind: "checktable", title: "Pressure ulcers — number by stage", note: "Check the column matching the number of ulcers at each stage.", rowLabels: ["Stage 1: redness of intact skin", "Stage 2: partial-thickness skin loss", "Stage 3: full-thickness skin loss", "Stage 4: full-thickness loss with destruction"], columns: ["0", "1", "2", "3", "4+"] },
    { kind: "fields", fields: [{ name: "ulcerLoc", label: "Location of ulcers", width: "full" }] },
    { kind: "textarea", label: "Surgical or other wounds (describe location, size, and nature)", rows: 2 },
    { kind: "bodymap", label: "Mark locations on the body (tap the figure to drop a numbered pin, then note what it is)" },

    { kind: "heading", text: "Activities of daily living" },
    { kind: "checktable", title: "ADL assistance level", rowLabels: ["Mobility & transfers", "Bathing", "Personal hygiene (hair, nails, skin, oral)", "Toileting", "Dressing", "Eating & drinking"], columns: ["Dependent", "Independent", "Assist", "Cue"] },
    { kind: "checklist", title: "Mobility aids and notes", columns: 2, items: ["One-person assist", "Two-person assist", "Uses walker", "Uses cane", "Uses wheelchair", "Transfer bench or shower chair", "Incontinent bowel", "Incontinent bladder"] },

    { kind: "heading", text: "Health maintenance needs" },
    { kind: "checklist", title: "Needs", columns: 2, items: ["Reinforce diet education", "Supervision of blood sugar monitoring", "Routine care of prosthetic / orthotic device", "Education on medical equipment use", "Referral to physician", "Other health education needed"] },

    { kind: "heading", text: "Medication management" },
    { kind: "table", title: "Current medications", columns: ["Medication", "Dose", "Freq", "Physician", "Purpose"], rows: 8 },
    { kind: "checklist", title: "Medication ability", columns: 1, items: ["Able to take correct medications at the correct times", "Able to take medications with daily reminders", "Doses prepared in advance by another person", "Unable to take unless administered by someone else", "No medications prescribed", "Other"] },

    { kind: "heading", text: "General physical condition" },
    { kind: "checklist", title: "Condition", columns: 3, items: ["Improving", "Stable", "Deteriorating"] },
    { kind: "textarea", label: "Notes", rows: 2 },

    { kind: "heading", text: "Visit & certification" },
    { kind: "checklist", title: "Nurse monitor visit", columns: 3, items: ["Initial", "Monthly", "45 day", "3 month", "4 month", "Annual assessment"] },
    { kind: "checklist", title: "Activities of visit", columns: 2, items: ["Developed caregiver support plan", "Reviewed caregiver support plan", "Assessed / monitored participant", "Provided information and training to caregiver", "Assessed / monitored caregiver"] },
    { kind: "textarea", label: "Caregiver names", rows: 2 },
    { kind: "note", text: "By signing below, the participant and nurse certify that services were delivered. Send the signed copy to the case manager within 10 days. Report suspected abuse, neglect, or exploitation to Adult Protective Services at 1-800-917-7383." },
    { kind: "signatures", roles: ["RN (print & sign)"] },
    { kind: "esign", role: "Participant / Representative signature" },
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
        { name: "caregiverNo", label: "Caregiver telephone number", type: "tel", width: "third" },
        { name: "month", label: "Date", type: "date", width: "third" },
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
    { kind: "signatures", roles: ["Caregiver signature"] },
  ],

  // CNA / Unlicensed Aide Skills, Assessment & Demonstration Checklist.
  "unlicensed-aide-skills-assessment": [
    { kind: "heading", text: "CNA / Unlicensed Aide Skills, Assessment & Demonstration Checklist" },
    {
      kind: "fields",
      fields: [
        { name: "caregiver", label: "Staff name", width: "half" },
        { name: "caregiverNo", label: "Caregiver telephone number", type: "tel", width: "third" },
        { name: "date", label: "Date", type: "date", width: "third" },
      ],
    },
    {
      kind: "skilltable",
      title: "Skills assessment & demonstration",
      note: "Mark each skill Satisfactory (Yes/No), with the date demonstrated and the observing RN.",
      items: [
        "Assist with admission of patient",
        "Assist with ambulation",
        "Positioning patients",
        "Assist with toileting: bedpan",
        "Assist with toileting: urinal / commode",
        "Backrubs / back care",
        "Bathing: complete bath",
        "Bathing: partial / sitting",
        "Bathing: tub bath",
        "Bathing: bed bath",
        "Bathing: shower",
        "Oral hygiene",
        "Dressing a patient",
        "Transfer assistance (up to 250 lbs)",
        "In / out of bed to a chair",
        "Transfer to wheelchair",
        "Assistive devices: lift",
        "Assistive devices: wheelchair",
        "Assistive devices: walker",
        "Assistive devices: cane",
        "Assistive devices: other",
        "Nourishment: feeding assistance (aspiration precaution)",
        "Medication reminders",
        "Documentation / charting: patient care & report events to RN",
        "Infection control precautions",
        "Hand washing, use of gloves / sanitizer",
        "Standard universal precautions",
        "Reverse isolation",
        "TB / airborne precautions",
        "MRSA / VRE precautions",
        "Bed making: occupied / unoccupied / surgical",
        "Bed cradles",
        "Bed rails: when to use",
        "Cast care",
        "Compresses: warm, cold",
        "Foley catheter: care & emptying",
        "Perineal care",
        "Intake & output: measure & record",
        "Range of motion exercises",
        "Reporting changes of patient condition",
        "Reporting / recording patient's pain level",
        "Specimen collection: routine urine",
        "Specimen collection: clean catch",
        "Specimen collection: 12 & 24-hour",
        "Specimen collection: stool",
        "Specimen collection: culture",
        "Specimen collection: sputum",
        "Specimen collection: from Foley catheter",
        "Demonstrate taking vital signs",
        "Prosthetic devices",
        "Care of dentures",
        "Contact lenses",
        "Other",
      ],
    },
    { kind: "note", text: "Any notation of \"No\" will require further training and orientation to meet job requirements." },
    { kind: "checklist", title: "CNA skills assessment satisfactorily completed", columns: 3, items: ["Yes", "No"] },
    { kind: "signatures", roles: ["Evaluator (RN, print & sign)"] },
  ],
};
