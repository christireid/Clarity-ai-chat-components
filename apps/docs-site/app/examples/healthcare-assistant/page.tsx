import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Heart, Shield, Calendar, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Healthcare Assistant Example',
  description: 'HIPAA-compliant medical chatbot with patient records',
}

export default function HealthcareAssistantPage() {
  return (
    <div className="container-docs py-12">
      <Link
        href="/examples"
        className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Examples
      </Link>

      <div className="max-w-4xl">
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-4">Healthcare Assistant</h1>
            <p className="text-xl text-text-secondary">
              HIPAA-compliant AI medical assistant for patient support and healthcare information
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full text-sm font-medium">
            Advanced
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm">
            HIPAA-Compliant
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-sm">
            Production-Ready
          </span>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-8">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                Important Medical Disclaimer
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                This is a <strong>demonstration only</strong>. Not a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical decisions.
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>✨ Features</h2>
          <ul>
            <li>
              <strong>Lab Results Interpretation</strong> - Explain test results in plain language
            </li>
            <li>
              <strong>Medication Information</strong> - Drug interactions, side effects, dosage
            </li>
            <li>
              <strong>Symptom Checker</strong> - Educational symptom information
            </li>
            <li>
              <strong>Appointment Scheduling</strong> - Find available time slots
            </li>
            <li>
              <strong>Medical Records</strong> - Access patient history (demo data)
            </li>
            <li>
              <strong>Prescription Reminders</strong> - Medication schedule tracking
            </li>
            <li>
              <strong>Health Tips</strong> - Preventive care recommendations
            </li>
            <li>
              <strong>PII Protection</strong> - Automatic detection and masking of sensitive data
            </li>
          </ul>

          <h2>🚀 Quick Start</h2>
          <pre className="bg-surface-muted p-4 rounded-lg">
            <code>{`cd examples/healthcare-assistant
npm install
cp .env.example .env.local
# Add OPENAI_API_KEY
npm run dev`}</code>
          </pre>

          <h2>🏗️ Architecture</h2>
          <p>
            The healthcare assistant uses specialized AI functions for medical tasks:
          </p>

          <pre className="bg-surface-muted p-4 rounded-lg">
            <code>{`const medicalFunctions = [
  {
    name: 'get_patient_records',
    description: 'Retrieve patient medical history',
    parameters: { patientId: 'string', recordType: 'enum' }
  },
  {
    name: 'interpret_lab_results',
    description: 'Explain lab test results',
    parameters: { testType: 'string', values: 'object' }
  },
  {
    name: 'check_drug_interactions',
    description: 'Check for medication interactions',
    parameters: { medications: 'array' }
  },
  {
    name: 'schedule_appointment',
    description: 'Book medical appointments',
    parameters: { specialty: 'string', urgency: 'enum' }
  }
]`}</code>
          </pre>

          <h2>🔒 HIPAA Compliance</h2>
          <p>
            For production healthcare applications, you must implement:
          </p>

          <div className="grid md:grid-cols-2 gap-4 not-prose my-6">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">✅ Required</h3>
              <ul className="text-sm space-y-1">
                <li>• End-to-end encryption</li>
                <li>• Audit logging</li>
                <li>• Access controls (RBAC)</li>
                <li>• Data retention policies</li>
                <li>• Business Associate Agreements</li>
                <li>• Regular security audits</li>
              </ul>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🛡️ Built-in</h3>
              <ul className="text-sm space-y-1">
                <li>• PII detection & masking</li>
                <li>• Content filtering</li>
                <li>• Secure session management</li>
                <li>• Error handling</li>
                <li>• Input validation</li>
                <li>• Safety monitoring</li>
              </ul>
            </div>
          </div>

          <h2>💡 Use Cases</h2>

          <h3>1. Lab Results Explanation</h3>
          <p>
            <strong>Patient:</strong> "Can you explain my cholesterol results?"
          </p>
          <p>
            <strong>Assistant:</strong> Retrieves results, explains each value, provides context and recommendations
          </p>

          <h3>2. Medication Questions</h3>
          <p>
            <strong>Patient:</strong> "Can I take ibuprofen with my blood pressure medication?"
          </p>
          <p>
            <strong>Assistant:</strong> Checks drug interactions, provides safety information
          </p>

          <h3>3. Appointment Booking</h3>
          <p>
            <strong>Patient:</strong> "I need to see a cardiologist next week"
          </p>
          <p>
            <strong>Assistant:</strong> Finds available specialists, shows time slots, books appointment
          </p>

          <h2>📦 Technologies</h2>
          <ul>
            <li>Next.js 15 for framework</li>
            <li>OpenAI GPT-4 for medical knowledge</li>
            <li>PII detection for privacy</li>
            <li>Audit logging for compliance</li>
            <li>TypeScript for type safety</li>
          </ul>

          <h2>🔗 Related Examples</h2>
          <ul>
            <li>
              <Link href="/examples/financial-advisor" className="text-brand-600 dark:text-brand-400 hover:underline">
                Financial Advisor
              </Link>{' '}
              - Similar compliance requirements
            </li>
            <li>
              <Link href="/guides/rag" className="text-brand-600 dark:text-brand-400 hover:underline">
                RAG Guide
              </Link>{' '}
              - For medical knowledge base integration
            </li>
          </ul>

          <h2>⚙️ Configuration</h2>
          <pre className="bg-surface-muted p-4 rounded-lg">
            <code>{`// .env.local
OPENAI_API_KEY=sk-...
HIPAA_MODE=true
AUDIT_LOGGING=enabled
PII_DETECTION=strict

// Optional: EHR Integration
EHR_API_URL=https://api.ehr-system.com
EHR_API_KEY=...`}</code>
          </pre>
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-950 dark:to-blue-950 rounded-xl border border-brand-200 dark:border-brand-800">
          <h3 className="text-2xl font-bold mb-4">🚀 Production Deployment</h3>
          <p className="text-text-secondary mb-6">
            Ready to deploy a HIPAA-compliant healthcare chatbot? Check our deployment guide.
          </p>
          <Link
            href="/guides/deployment"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
          >
            Deployment Guide →
          </Link>
        </div>
      </div>
    </div>
  )
}

