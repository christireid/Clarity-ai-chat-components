"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export interface ContactFormData {
  name: string
  email: string
  company?: string
  message: string
  type: "general" | "enterprise" | "consulting" | "support"
}

export interface NewsletterFormData {
  email: string
}

export async function sendContactEmail(formData: ContactFormData) {
  try {
    // In development or when API key is not configured, simulate a successful send
    const isProd = process.env.NODE_ENV === "production"
    const hasApiKey = Boolean(process.env.RESEND_API_KEY)

    if (!isProd || !hasApiKey) {
      console.info(
        "sendContactEmail: simulated send (either non-production or missing RESEND_API_KEY)",
        formData
      )
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { success: true, data: { simulated: true } }
    }

    const typeLabels = {
      general: "General Inquiry",
      enterprise: "Enterprise",
      consulting: "Consulting",
      support: "Support",
    }

    const { data, error } = await resend.emails.send({
      from: "Code & Clarity <info@codeclarity.ai>",
      to: ["info@codeclarity.ai"],
      replyTo: formData.email,
      subject: `[${typeLabels[formData.type]}] New inquiry from ${formData.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Type:</strong> ${typeLabels[formData.type]}</p>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        ${formData.company ? `<p><strong>Company:</strong> ${formData.company}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${formData.message.replace(/\n/g, "<br>")}</p>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Send email error:", error)
    return { success: false, error: "Failed to send email" }
  }
}

export async function subscribeToNewsletter(formData: NewsletterFormData) {
  try {
    const isProd = process.env.NODE_ENV === "production"
    const hasApiKey = Boolean(process.env.RESEND_API_KEY)

    if (!isProd || !hasApiKey) {
      console.info(
        "subscribeToNewsletter: simulated subscription",
        formData.email
      )
      await new Promise((resolve) => setTimeout(resolve, 800))
      return { success: true, data: { simulated: true } }
    }

    // Add to Resend audience (if configured)
    // For now, send a notification email
    const { data, error } = await resend.emails.send({
      from: "Code & Clarity <info@codeclarity.ai>",
      to: ["info@codeclarity.ai"],
      subject: `New Newsletter Subscriber: ${formData.email}`,
      html: `
        <h2>New Newsletter Subscription</h2>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p>Add this email to your newsletter list.</p>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return { success: false, error: "Failed to subscribe" }
  }
}
