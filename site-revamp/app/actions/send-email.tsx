"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    // In development or when API key is not configured, simulate a successful send
    const isProd = process.env.NODE_ENV === "production";
    const hasApiKey = Boolean(process.env.RESEND_API_KEY);

    if (!isProd || !hasApiKey) {
      console.info(
        "sendContactEmail: simulated send (either non-production or missing RESEND_API_KEY)",
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }
      );
      return { success: true, data: { simulated: true } };
    }

    const { data, error } = await resend.emails.send({
      from: "Code & Clarity <info@codeclarity.ai>", // You'll need to update this to your verified domain
      to: ["info@codeclarity.ai"],
      replyTo: formData.email,
      subject: `New Contact Form Submission from ${formData.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Send email error:", error);
    return { success: false, error: "Failed to send email" };
  }
}
