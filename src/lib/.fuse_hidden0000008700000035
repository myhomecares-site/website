import nodemailer from "nodemailer";

export type MailAttachment = { filename: string; content: string }; // base64

// Wraps email content in a branded, email-client-safe template with the logo header
// and a contact footer. `heading` is the colored title; `body` is inner HTML.
export function brandedEmail(heading: string, body: string): string {
  return `<div style="background:#f3f6f9;margin:0;padding:24px 12px;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border:1px solid #e6e8ea;border-radius:14px;overflow:hidden">
      <tr><td style="background:#ffffff;padding:26px 28px 18px;border-bottom:3px solid #009ee6;text-align:center">
        <img src="https://www.myhomecares.com/brand/mhc-wordmark.png" alt="My Home Cares — Where Service Matters" width="210" style="display:inline-block;width:210px;max-width:72%;height:auto" />
      </td></tr>
      <tr><td style="padding:28px">
        <h1 style="margin:0 0 14px;font-size:20px;line-height:1.3;color:#009ee6">${heading}</h1>
        ${body}
      </td></tr>
      <tr><td style="background:#1d2a39;padding:22px 28px;text-align:center;color:#cfd6dd;font-size:12px;line-height:1.7">
        <div style="font-weight:bold;color:#ffffff;font-size:14px">My Home Cares</div>
        <div style="color:#9fb3c8">Where Service Matters</div>
        <div style="margin-top:8px">
          <a href="tel:+14102313076" style="color:#33b6ec;text-decoration:none">(410) 231-3076</a>
          &nbsp;·&nbsp;
          <a href="mailto:info@myhomecares.com" style="color:#33b6ec;text-decoration:none">info@myhomecares.com</a>
        </div>
        <div style="margin-top:4px;color:#9fb3c8">Serving families across Maryland</div>
        <div style="margin-top:8px;color:#7c8a99;font-size:11px">Maryland OHCQ License RSA-01229 | HCSA-00845</div>
      </td></tr>
    </table>
  </td></tr></table>
</div>`;
}

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
