"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Send, Check, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendContactEmail } from "@/app/actions/send-email";

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    interest: "general",
    message: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");

    try {
      const result = await sendContactEmail({
        name: formData.name,
        email: formData.email,
        message: `[Interest: ${formData.interest}]${formData.company ? `\n[Company: ${formData.company}]` : ""}\n\n${formData.message}`,
      });

      if (result.success) {
        setFormStatus("success");
        setFormData({ name: "", email: "", company: "", interest: "general", message: "" });
        setCharCount(0);
        setTimeout(() => setFormStatus("idle"), 5000);
      } else {
        setFormStatus("error");
        setTimeout(() => setFormStatus("idle"), 5000);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, message: value });
    setCharCount(value.length);
  };

  const isFormValid = formData.name && formData.email && formData.message;
  const completionPercentage =
    [formData.name, formData.email, formData.message].filter(Boolean).length *
    33.33;

  return (
    <section id="contact" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div
          ref={containerRef}
          className={`relative transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="absolute -top-32 -right-32 w-96 h-96 gradient-blob pointer-events-none" />
          <div
            className="absolute -bottom-24 -left-24 w-80 h-80 gradient-blob pointer-events-none"
            style={{ animationDelay: "10s" }}
          />

          <div className="relative bg-card rounded-2xl border border-border p-8 sm:p-10 minimal-card">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[oklch(0.6_0.15_280)]" />
                <span className="text-sm font-medium text-[oklch(0.6_0.15_280)]">
                  Response within 24 hours
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-3">
                <span className="gradient-text">Get in Touch</span>
              </h3>
              <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                Have questions about Clarity Chat? Looking for enterprise solutions? We'd love to hear from you.
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <label
                    htmlFor="name"
                    className={`absolute left-4 transition-all duration-200 pointer-events-none z-10 ${
                      focusedField === "name" || formData.name
                        ? "-top-5 text-xs bg-card px-2 font-semibold gradient-text"
                        : "top-4 text-base text-muted-foreground"
                    }`}
                  >
                    Your name
                  </label>
                  <input
                    ref={nameInputRef}
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-4 border border-border rounded-xl transition-all duration-300 outline-none ring-0 focus:ring-0 bg-background/50 backdrop-blur-sm hover:border-[oklch(0.6_0.15_280/0.5)]"
                    required
                  />
                </div>

                <div className="relative group">
                  <label
                    htmlFor="email"
                    className={`absolute left-4 transition-all duration-200 pointer-events-none z-10 ${
                      focusedField === "email" || formData.email
                        ? "-top-5 text-xs bg-card px-2 font-semibold gradient-text"
                        : "top-4 text-base text-muted-foreground"
                    }`}
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-4 border border-border rounded-xl transition-all duration-300 outline-none ring-0 focus:ring-0 bg-background/50 backdrop-blur-sm hover:border-[oklch(0.6_0.15_280/0.5)]"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <label
                    htmlFor="company"
                    className={`absolute left-4 transition-all duration-200 pointer-events-none z-10 ${
                      focusedField === "company" || formData.company
                        ? "-top-5 text-xs bg-card px-2 font-semibold gradient-text"
                        : "top-4 text-base text-muted-foreground"
                    }`}
                  >
                    Company (optional)
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    onFocus={() => setFocusedField("company")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-4 border border-border rounded-xl transition-all duration-300 outline-none ring-0 focus:ring-0 bg-background/50 backdrop-blur-sm hover:border-[oklch(0.6_0.15_280/0.5)]"
                  />
                </div>

                <div className="relative group">
                  <label
                    htmlFor="interest"
                    className="absolute left-4 -top-5 text-xs bg-card px-2 font-semibold gradient-text z-10"
                  >
                    I'm interested in
                  </label>
                  <select
                    id="interest"
                    value={formData.interest}
                    onChange={(e) =>
                      setFormData({ ...formData, interest: e.target.value })
                    }
                    className="w-full px-4 py-4 border border-border rounded-xl transition-all duration-300 outline-none ring-0 focus:ring-0 bg-background/50 backdrop-blur-sm hover:border-[oklch(0.6_0.15_280/0.5)] appearance-none cursor-pointer"
                  >
                    <option value="general">General inquiry</option>
                    <option value="enterprise">Enterprise solutions</option>
                    <option value="partnership">Partnership</option>
                    <option value="support">Technical support</option>
                  </select>
                </div>
              </div>

              <div className="relative group">
                <label
                  htmlFor="message"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none z-10 ${
                    focusedField === "message" || formData.message
                      ? "-top-5 text-xs bg-card px-2 font-semibold gradient-text"
                      : "top-4 text-base text-muted-foreground"
                  }`}
                >
                  Your message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleMessageChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  rows={5}
                  className="w-full px-4 py-4 border border-border rounded-xl transition-all duration-300 outline-none ring-0 focus:ring-0 resize-none bg-background/50 backdrop-blur-sm hover:border-[oklch(0.6_0.15_280/0.5)]"
                  required
                />
                <div className="absolute bottom-3 right-4 text-xs">
                  <span
                    className={`transition-all duration-300 ${
                      charCount > 0
                        ? "gradient-text font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {charCount > 0 && `${charCount} characters`}
                  </span>
                </div>
              </div>

              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[oklch(0.6_0.15_280)] to-[oklch(0.65_0.12_200)] transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              <Button
                type="submit"
                disabled={
                  !isFormValid ||
                  formStatus === "loading" ||
                  formStatus === "success"
                }
                className={`w-full h-14 text-lg font-bold relative overflow-hidden transition-all duration-300 ${
                  formStatus === "success"
                    ? "bg-green-500 hover:bg-green-500"
                    : isFormValid
                    ? "primary-button"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {formStatus === "loading" && (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                )}
                {formStatus === "success" && (
                  <span className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Message Sent!
                  </span>
                )}
                {formStatus === "error" && (
                  <span className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Something Went Wrong
                  </span>
                )}
                {formStatus === "idle" && (
                  <span className="flex items-center gap-2">
                    Send Message
                    <Send className="w-5 h-5" />
                  </span>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Or email us directly at{" "}
                <a
                  href="mailto:info@codeclarity.ai"
                  className="text-[oklch(0.6_0.15_280)] hover:underline"
                >
                  info@codeclarity.ai
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export function scrollToContactForm() {
  const contactForm = document.getElementById("contact");
  const nameInput = document.querySelector<HTMLInputElement>(
    "#contact input#name"
  );

  if (contactForm) {
    contactForm.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      nameInput?.focus();
    }, 800);
  }
}
