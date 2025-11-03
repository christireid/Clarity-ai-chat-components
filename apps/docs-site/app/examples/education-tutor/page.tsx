import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, GraduationCap, BookOpen, Award, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Education Tutor Example',
  description: 'Interactive AI learning assistant with quizzes and progress tracking',
}

export default function EducationTutorPage() {
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
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-xl">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-4">Education Tutor</h1>
            <p className="text-xl text-text-secondary">
              Interactive AI learning assistant with personalized lessons and progress tracking
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-sm font-medium">
            Intermediate
          </span>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 rounded-full text-sm">
            Education
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-sm">
            Interactive Learning
          </span>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>✨ Features</h2>
          <ul>
            <li>
              <strong>Interactive Lessons</strong> - Adaptive explanations based on student level
            </li>
            <li>
              <strong>Quiz Generation</strong> - Auto-generated quizzes to test understanding
            </li>
            <li>
              <strong>Progress Tracking</strong> - Monitor learning progress and mastery
            </li>
            <li>
              <strong>Homework Help</strong> - Step-by-step problem solving
            </li>
            <li>
              <strong>Visual Aids</strong> - Diagrams, charts, and illustrations
            </li>
            <li>
              <strong>Multi-Subject Support</strong> - Math, science, history, languages
            </li>
            <li>
              <strong>Adaptive Difficulty</strong> - Adjusts to student's pace
            </li>
            <li>
              <strong>Parent Dashboard</strong> - Track student progress
            </li>
          </ul>

          <h2>🚀 Quick Start</h2>
          <pre className="bg-surface-muted p-4 rounded-lg">
            <code>{`cd examples/ai-tutor
npm install
npm run dev`}</code>
          </pre>

          <h2>💬 Example Learning Session</h2>

          <h3>Teaching Photosynthesis</h3>
          <div className="bg-surface-elevated p-4 rounded-lg border border-border not-prose mb-4">
            <p className="font-medium mb-2">👤 Student: "Teach me about photosynthesis"</p>
            <p className="text-text-secondary text-sm mb-3">🤖 Tutor provides structured lesson:</p>
            <div className="space-y-2 text-sm">
              <div>
                <strong>1. Introduction</strong>
                <p className="text-text-secondary">Explains what photosynthesis is with simple analogy</p>
              </div>
              <div>
                <strong>2. The Process</strong>
                <p className="text-text-secondary">Breaks down light-dependent and independent reactions</p>
              </div>
              <div>
                <strong>3. Visual Aid</strong>
                <p className="text-text-secondary">Shows diagram of chloroplast structure</p>
              </div>
              <div>
                <strong>4. Quiz</strong>
                <p className="text-text-secondary">Tests understanding with 3 questions</p>
              </div>
            </div>
          </div>

          <h3>Homework Help</h3>
          <div className="bg-surface-elevated p-4 rounded-lg border border-border not-prose mb-4">
            <p className="font-medium mb-2">👤 Student: "How do I solve: 2x + 5 = 13?"</p>
            <p className="text-text-secondary text-sm mb-2">🤖 Tutor provides step-by-step:</p>
            <div className="font-mono text-sm space-y-1 bg-slate-950 text-slate-200 p-3 rounded">
              <div>Step 1: Subtract 5 from both sides</div>
              <div className="ml-4">2x + 5 - 5 = 13 - 5</div>
              <div className="ml-4">2x = 8</div>
              <div className="mt-2">Step 2: Divide both sides by 2</div>
              <div className="ml-4">2x ÷ 2 = 8 ÷ 2</div>
              <div className="ml-4">x = 4</div>
              <div className="mt-2 text-green-400">✓ Answer: x = 4</div>
            </div>
          </div>

          <h2>🎯 Learning Modes</h2>
          <div className="grid md:grid-cols-2 gap-4 not-prose my-6">
            <div className="p-4 border border-border rounded-lg">
              <BookOpen className="w-6 h-6 text-brand-500 mb-2" />
              <h3 className="font-semibold mb-2">Concept Explanation</h3>
              <p className="text-sm text-text-secondary">
                Clear, structured explanations with examples and analogies
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <CheckCircle className="w-6 h-6 text-brand-500 mb-2" />
              <h3 className="font-semibold mb-2">Practice Problems</h3>
              <p className="text-sm text-text-secondary">
                Generate unlimited practice problems with solutions
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <Award className="w-6 h-6 text-brand-500 mb-2" />
              <h3 className="font-semibold mb-2">Quizzes & Tests</h3>
              <p className="text-sm text-text-secondary">
                Adaptive quizzes that adjust to student's knowledge level
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <Star className="w-6 h-6 text-brand-500 mb-2" />
              <h3 className="font-semibold mb-2">Progress Tracking</h3>
              <p className="text-sm text-text-secondary">
                Visual progress reports and mastery indicators
              </p>
            </div>
          </div>

          <h2>🧠 Pedagogical Approach</h2>
          <p>The tutor uses evidence-based learning techniques:</p>
          <ul>
            <li>
              <strong>Socratic Method</strong> - Asks questions to guide understanding
            </li>
            <li>
              <strong>Spaced Repetition</strong> - Reviews concepts at optimal intervals
            </li>
            <li>
              <strong>Active Learning</strong> - Encourages problem-solving over passive reading
            </li>
            <li>
              <strong>Immediate Feedback</strong> - Corrects misconceptions instantly
            </li>
            <li>
              <strong>Adaptive Difficulty</strong> - Adjusts to student's current level
            </li>
          </ul>

          <h2>📚 Supported Subjects</h2>
          <div className="grid md:grid-cols-3 gap-3 not-prose my-6">
            {[
              { subject: '🔢 Mathematics', topics: 'Algebra, Geometry, Calculus' },
              { subject: '🧪 Science', topics: 'Biology, Chemistry, Physics' },
              { subject: '📖 English', topics: 'Grammar, Writing, Literature' },
              { subject: '🌍 History', topics: 'World, US, Ancient' },
              { subject: '💻 Computer Science', topics: 'Python, JavaScript, Algorithms' },
              { subject: '🌐 Languages', topics: 'Spanish, French, Mandarin' },
            ].map((item) => (
              <div key={item.subject} className="p-3 border border-border rounded-lg text-sm">
                <div className="font-medium mb-1">{item.subject}</div>
                <div className="text-text-secondary text-xs">{item.topics}</div>
              </div>
            ))}
          </div>

          <h2>🎓 Educational Standards</h2>
          <p>Aligned with:</p>
          <ul>
            <li>Common Core Standards (US)</li>
            <li>Next Generation Science Standards</li>
            <li>Cambridge International Curriculum</li>
            <li>IB (International Baccalaureate)</li>
          </ul>

          <h2>👨‍👩‍👧‍👦 Parent Features</h2>
          <ul>
            <li>Progress reports and learning analytics</li>
            <li>Time limits and session controls</li>
            <li>Content filtering for age-appropriate material</li>
            <li>Activity summaries</li>
          </ul>

          <h2>🔗 Related Examples</h2>
          <ul>
            <li>
              <Link href="/examples/code-assistant" className="text-brand-600 dark:text-brand-400 hover:underline">
                Code Assistant
              </Link>{' '}
              - For computer science tutoring
            </li>
            <li>
              <Link href="/reference/components/interactive-card" className="text-brand-600 dark:text-brand-400 hover:underline">
                Interactive Card
              </Link>{' '}
              - For quiz questions
            </li>
          </ul>
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-brand-950 dark:to-indigo-950 rounded-xl border border-brand-200 dark:border-brand-800">
          <h3 className="text-2xl font-bold mb-4">📚 Start Teaching with AI</h3>
          <p className="text-text-secondary mb-6">
            Create your own AI tutor and make learning more engaging and effective.
          </p>
          <a
            href="https://github.com/clarity-chat/ui/tree/main/examples/ai-tutor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
          >
            View Full Example →
          </a>
        </div>
      </div>
    </div>
  )
}

