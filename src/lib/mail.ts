import nodemailer from "nodemailer";

export type MailAttachment = { filename: string; content: string }; // base64

// Sends email through Google Workspace (Gmail SMTP) so it comes from your real
// info@myhomecares.com mailbox. Requires GMAIL_USER + GMAIL_APP_PASSWORD env vars.
export async function sendMail(opts: {
  to: string[] | string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: MailAttachment[];
}) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.log("[mail] GMAIL_USER/GMAIL_APP_PASSWORD not configured — skipping send");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `My Home Cares <${user}>`,
    to: Array.isArray(opts.to) ? opts.to.join(", ") : opts.to,
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo,
    attachments: opts.attachments?.map((a) => ({
      filename: a.filename,
      content: a.content,
      encoding: "base64" as const,
    })),
  });
}
