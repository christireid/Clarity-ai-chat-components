"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeToEarlyAccess(email: string) {
  try {
    // In development or when API key is not configured, simulate a successful subscription
    const isProd = process.env.NODE_ENV === "production";
    const hasApiKey = Boolean(process.env.RESEND_API_KEY);

    if (!isProd || !hasApiKey) {
      console.info("subscribeToEarlyAccess: simulated subscription", { email });
      return { success: true, data: { simulated: true } };
    }

    // Add to audience list if configured
    if (process.env.RESEND_AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });
    }

    // Send confirmation email
    const { error } = await resend.emails.send({
      from: "Clarity Chat <noreply@codeclarity.ai>",
      to: email,
      subject: "Welcome to Clarity Chat Early Access",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a1a; margin-bottom: 10px;">Welcome to Clarity Chat</h1>
            <p style="color: #666; font-size: 16px;">You're on the early access list!</p>
          </div>

          <div style="background: linear-gradient(135deg, #f5f5f5, #fff); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h2 style="margin-top: 0; color: #1a1a1a;">What's Coming</h2>
            <ul style="color: #555; padding-left: 20px;">
              <li><strong>200+ React components</strong> for AI chat interfaces</li>
              <li><strong>Token optimization</strong> that saves 60-90% on AI costs</li>
              <li><strong>Built-in memory system</strong> for conversation persistence</li>
              <li><strong>WCAG AAA accessibility</strong> out of the box</li>
              <li><strong>15 theme presets</strong> for instant customization</li>
            </ul>
          </div>

          <p style="color: #666;">
            We'll keep you updated on our progress and let you know as soon as Clarity Chat is ready for you to try.
          </p>

          <p style="color: #666;">
            Have questions? Reply to this email or reach out at <a href="mailto:info@codeclarity.ai" style="color: #7c3aed;">info@codeclarity.ai</a>.
          </p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
            <p>Clarity Chat by Code & Clarity</p>
            <p>You're receiving this because you signed up for early access.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    // Also notify team of new signup
    await resend.emails.send({
      from: "Clarity Chat <noreply@codeclarity.ai>",
      to: "info@codeclarity.ai",
      subject: `New Early Access Signup: ${email}`,
      html: `
        <h2>New Early Access Signup</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Subscribe error:", error);
    return { success: false, error: "Failed to subscribe" };
  }
}
