import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const metadata = {
    title: 'User Authentication - Cookbook - Clarity Chat',
    description: 'Secure your chat app with user authentication using NextAuth.js.',
};
export default function AuthenticationPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Cookbook" }), _jsx("h1", { children: "User Authentication" }), _jsx("p", { className: "docs-lead", children: "Secure your chat with user accounts. Users log in, get their own conversations, and you know who's using your app." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Setup" }), _jsx(CodeBlock, { language: "bash", code: "npm install next-auth @auth/prisma-adapter @prisma/client" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 1: Configure NextAuth" }), _jsx(CodeBlock, { language: "typescript", code: `// lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    session: async ({ session, user }) => {
      session.user.id = user.id
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
}

// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 2: Protect API Routes" }), _jsx(CodeBlock, { language: "typescript", code: `// app/api/chat/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  // Check authentication
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = session.user.id
  
  // Now handle chat for this specific user
  const { messages } = await req.json()
  
  // ... rest of chat logic
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 3: Protect Chat Page" }), _jsx(CodeBlock, { language: "typescript", code: `// app/chat/page.tsx
'use client'

import { useSession, signIn } from 'next-auth/react'
import { ChatWindow } from '@clarity-chat/react'

export default function ChatPage() {
  const { data: session, status } = useSession()

  // Show loading while checking auth
  if (status === 'loading') {
    return <div>Loading...</div>
  }

  // Redirect to login if not authenticated
  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <h1>Sign in to chat</h1>
          <button
            onClick={() => signIn('google')}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  // User is authenticated - show chat
  return (
    <div className="h-screen">
      <ChatWindow {...props} />
    </div>
  )
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 4: Session Provider" }), _jsx(CodeBlock, { language: "typescript", code: `// app/providers.tsx
'use client'

import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Save User Conversations" }), _jsx(CodeBlock, { language: "typescript", code: `// Prisma schema
model User {
  id            String         @id @default(cuid())
  conversations Conversation[]
}

model Conversation {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  messages  Message[]
  createdAt DateTime  @default(now())
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  role           String
  content        String       @db.Text
  createdAt      DateTime     @default(now())
}

// In your API route
await prisma.message.create({
  data: {
    conversationId,
    role: 'user',
    content: userMessage.content
  }
})

// Load user's conversations
const conversations = await prisma.conversation.findMany({
  where: { userId: session.user.id },
  include: { messages: true },
  orderBy: { createdAt: 'desc' }
})` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related Recipes" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/cookbook/nextjs-integration", className: "docs-card", children: [_jsx("h3", { children: "Next.js Integration" }), _jsx("p", { children: "Foundation setup" })] }), _jsxs("a", { href: "/cookbook/rate-limiting", className: "docs-card", children: [_jsx("h3", { children: "Rate Limiting" }), _jsx("p", { children: "Protect your API" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map