// Transactional email through Resend's HTTP API (works on any server runtime).
// Off until RESEND_API_KEY and ORDER_EMAIL_FROM are set; ORDER_EMAIL_FROM must use a
// domain verified in Resend, e.g. "AHAB Clothing <orders@ahabclothing.com>".

export type OutgoingEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

/** Sends an email; returns false (and logs) when email is not configured or fails. */
export async function sendEmail(email: OutgoingEmail): Promise<boolean> {
  const apiKey = process.env["RESEND_API_KEY"];
  const from = process.env["ORDER_EMAIL_FROM"];
  const replyTo = process.env["ORDER_EMAIL_REPLY_TO"];
  if (!apiKey || !from) {
    console.warn("Email skipped: set RESEND_API_KEY and ORDER_EMAIL_FROM to send order emails.");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: [email.to],
        subject: email.subject,
        html: email.html,
        text: email.text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error(`Email to customer failed: Resend returned HTTP ${response.status}.`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Email to customer failed:", error instanceof Error ? error.message : error);
    return false;
  }
}
