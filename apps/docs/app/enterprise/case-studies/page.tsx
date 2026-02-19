'use client'

import React from 'react'

export default function CaseStudiesPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Enterprise</span>
        <h1>Clarity Chat Case Studies</h1>
        <p className="docs-lead">
          Coming soon — we are looking for beta users.
        </p>
      </div>

      <section className="docs-section">
        <h2>We want to feature your story</h2>
        <p>
          Clarity Chat is currently in pre-release. We do not yet have published case studies
          with real customer data and verified metrics.
        </p>
        <p>
          If you are using Clarity Chat and would like to share your experience, we would love
          to hear from you. Early adopters who participate will receive recognition and potential
          benefits as part of our beta program.
        </p>

        <h3>Get in touch</h3>
        <ul>
          <li>
            <strong>Email:</strong>{' '}
            <a href="mailto:hello@codeclarity.ai">hello@codeclarity.ai</a>
          </li>
          <li>
            <strong>GitHub Discussions:</strong>{' '}
            <a
              href="https://github.com/christireid/Clarity-ai-chat-components/discussions"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join the conversation
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}
