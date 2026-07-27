// New-hire onboarding checklist, mirrored from the HR Onboarding Checklist
// document. Section/item order is stable, so item keys stay valid over time.

export type OnboardingStatus = "done" | "pending" | "na" | "";

export const ONBOARDING_SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "Application & Screening",
    items: [
      "Application received",
      "Resume / work history reviewed",
      "Interview completed",
      "References checked",
      "Offer letter sent and accepted",
    ],
  },
  {
    title: "Identity & Eligibility Documents",
    items: [
      "Photo ID (driver's license or state ID) on file",
      "Social Security card on file",
      "Form I-9 completed and verified",
    ],
  },
  {
    title: "Certifications & Health Records",
    items: [
      "CPR certification card on file",
      "First Aid certification (if required)",
      "TB test / physical exam (if required)",
      "Professional license or certification (if applicable)",
    ],
  },
  {
    title: "Background Check",
    items: [
      "Background check request submitted",
      "Fingerprinting completed (if required)",
      "Results received and cleared",
    ],
  },
  {
    title: "Tax & Payroll",
    items: [
      "W-4 sent to employee",
      "W-4 returned, signed and complete",
      "Direct deposit form / voided check",
      "Emergency contact form",
    ],
  },
  {
    title: "Training",
    items: [
      "Training materials sent with onboarding packet",
      "Completed training returned",
      "Training acknowledgment / sign-in sheet signed",
      "Competency evaluation completed and signed",
      "Aide Skills Assessment completed and signed by Delegating RN",
    ],
  },
  {
    title: "Onboarding Packet",
    items: [
      "Onboarding documents sent",
      "Signed onboarding documents returned",
      "Job description signed and acknowledged",
      "Policy / handbook acknowledgment signed",
      "Confidentiality (HIPAA) agreement signed",
    ],
  },
];

export function itemKey(si: number, ii: number) {
  return `${si}.${ii}`;
}

export const ONBOARDING_TOTAL = ONBOARDING_SECTIONS.reduce((n, s) => n + s.items.length, 0);

// Percent complete, matching the tracker rule: "Done" and "N/A" both count as
// finished; blank and "Pending" do not.
export function percentComplete(items: Record<string, OnboardingStatus>): number {
  let done = 0;
  ONBOARDING_SECTIONS.forEach((s, si) =>
    s.items.forEach((_, ii) => {
      const v = items[itemKey(si, ii)];
      if (v === "done" || v === "na") done++;
    })
  );
  return Math.round((done / ONBOARDING_TOTAL) * 100);
}

export const STATUS_LABEL: Record<Exclude<OnboardingStatus, "">, string> = {
  done: "Done",
  pending: "Pending",
  na: "N/A",
};
