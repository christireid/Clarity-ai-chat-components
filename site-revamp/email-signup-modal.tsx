"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Loader2, Mail, AlertCircle } from "lucide-react";
import { subscribeToEarlyAccess } from "@/app/actions/subscribe";

type Status = "idle" | "loading" | "success" | "error";

interface EmailSignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmailSignupModal({ open, onOpenChange }: EmailSignupModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const result = await subscribeToEarlyAccess(email);
      if (result.success) {
        setStatus("success");
        setEmail("");
        setTimeout(() => {
          onOpenChange(false);
          setStatus("idle");
        }, 2000);
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Failed to subscribe. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Get <span className="gradient-text">Early Access</span>
          </DialogTitle>
          <DialogDescription>
            Be the first to know when Clarity Chat launches. Get exclusive early access and updates.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">You're on the list!</h3>
            <p className="text-sm text-muted-foreground">
              We'll notify you when Clarity Chat is ready.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background/50 outline-none focus:ring-2 focus:ring-[oklch(0.6_0.15_280/0.3)] transition-all"
                required
                disabled={status === "loading"}
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" />
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              className="w-full primary-button font-semibold py-6"
              disabled={status === "loading" || !email}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Get Early Access"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              No spam, ever. Unsubscribe anytime.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Inline signup component for use in sections
export function EmailSignupInline() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const result = await subscribeToEarlyAccess(email);
      if (result.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 3000);
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-green-500">
        <Check className="w-5 h-5" />
        <span>You're on the list!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="flex-1 px-4 py-3 border border-border rounded-xl bg-background/50 outline-none focus:ring-2 focus:ring-[oklch(0.6_0.15_280/0.3)] transition-all"
        required
        disabled={status === "loading"}
      />
      <Button
        type="submit"
        className="primary-button font-semibold whitespace-nowrap"
        disabled={status === "loading" || !email}
      >
        {status === "loading" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : status === "error" ? (
          "Try Again"
        ) : (
          "Get Early Access"
        )}
      </Button>
    </form>
  );
}
