"use client"

import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Send, CheckCircle, AlertCircle, Mail, MessageSquare } from "lucide-react"
import { sendContactEmail } from "@/app/actions/send-email"
import { fadeInUp, slideInLeft, slideInRight, viewportOnce } from "@/lib/animations"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  type: z.enum(["general", "enterprise", "consulting", "support"]),
})

type ContactFormData = z.infer<typeof contactSchema>

const inquiryTypes = [
  { value: "general" as const, label: "General Inquiry" },
  { value: "enterprise" as const, label: "Enterprise" },
  { value: "consulting" as const, label: "Consulting" },
  { value: "support" as const, label: "Support" },
]

export function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: "general",
      name: "",
      email: "",
      company: "",
      message: "",
    },
  })

  const selectedType = watch("type")

  const onSubmit = async (data: ContactFormData) => {
    try {
      const result = await sendContactEmail(data)

      if (result.success) {
        toast.success("Message sent successfully!", {
          description: "We'll get back to you within 24 hours.",
        })
        reset()
      } else {
        toast.error("Failed to send message", {
          description: result.error || "Please try again later.",
        })
      }
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      })
    }
  }

  return (
    <section className="relative py-24 overflow-hidden" id="contact">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0 radial-gradient-bg opacity-50" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left column - Info */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <h2 className="text-headline font-bold mb-6">
              Let's build something{" "}
              <span className="gradient-text">amazing</span> together
            </h2>
            <p className="text-body-large text-muted-foreground mb-8">
              Whether you're looking to integrate Clarity Chat, need help with
              token optimization, or want to discuss a custom AI project - we're
              here to help.
            </p>

            {/* Contact options */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="feature-icon w-12 h-12 rounded-xl">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email us</h3>
                  <a
                    href="mailto:hello@codeclarity.ai"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    hello@codeclarity.ai
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="feature-icon w-12 h-12 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Join our Discord</h3>
                  <p className="text-muted-foreground">
                    Get help from the community and our team
                  </p>
                </div>
              </div>
            </div>

            {/* Response time */}
            <div className="mt-8 p-4 rounded-xl bg-muted/30 border border-white/5">
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">
                  Typical response time:
                </span>{" "}
                Within 24 hours for general inquiries, same-day for enterprise.
              </p>
            </div>
          </motion.div>

          {/* Right column - Form */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <div className="premium-card p-8 rounded-2xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Inquiry type */}
                <div className="grid grid-cols-2 gap-3">
                  {inquiryTypes.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center justify-center px-4 py-2.5 rounded-lg cursor-pointer transition-all text-sm font-medium ${
                        selectedType === option.value
                          ? "bg-primary text-white"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register("type")}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>

                {/* Name & Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      {...register("name")}
                      className={`w-full px-4 py-3 rounded-xl bg-muted/50 border text-sm outline-none transition-colors ${
                        errors.name
                          ? "border-destructive focus:border-destructive"
                          : "border-white/5 focus:border-primary"
                      }`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      className={`w-full px-4 py-3 rounded-xl bg-muted/50 border text-sm outline-none transition-colors ${
                        errors.email
                          ? "border-destructive focus:border-destructive"
                          : "border-white/5 focus:border-primary"
                      }`}
                      placeholder="you@company.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company (optional)
                  </label>
                  <input
                    type="text"
                    {...register("company")}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-white/5 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="Your company"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl bg-muted/50 border text-sm outline-none transition-colors resize-none ${
                      errors.message
                        ? "border-destructive focus:border-destructive"
                        : "border-white/5 focus:border-primary"
                    }`}
                    placeholder="Tell us about your project..."
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cta-button py-4 rounded-xl text-base font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : isSubmitSuccessful ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Message sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
