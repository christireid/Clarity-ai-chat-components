# Customer Support Demo

AI-powered customer support chat with persistent conversation history using Next.js 15 and Supabase.

## Features

- ✅ **Customer information collection**: Name, email, subject
- ✅ **Persistent conversations**: All messages stored in Supabase
- ✅ **Conversation history**: Load previous conversations
- ✅ **Customer context**: Track customer information throughout conversation
- ✅ **Real-time updates**: Supabase realtime subscriptions ready
- ✅ **Support dashboard ready**: Database schema supports admin views

## Prerequisites

- Node.js 18+
- Supabase account (free tier works)
- npm or yarn

## Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be set up (takes ~2 minutes)
3. Get your API credentials from Project Settings > API

### 2. Set Up Database

Run the migration in Supabase SQL Editor:

```bash
# Copy the SQL from supabase/migrations/20240101000000_initial_schema.sql
# Paste and run in Supabase SQL Editor
```

Or use Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Schema

### Conversations Table

```sql
conversations {
  id: UUID
  customer_email: TEXT
  customer_name: TEXT
  subject: TEXT
  status: 'open' | 'pending' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  created_at: TIMESTAMPTZ
  updated_at: TIMESTAMPTZ
}
```

### Messages Table

```sql
messages {
  id: UUID
  conversation_id: UUID (FK)
  role: 'user' | 'assistant' | 'system'
  content: TEXT
  created_at: TIMESTAMPTZ
}
```

## How It Works

### 1. Customer Form

Collects customer information and creates a new conversation:

```typescript
const { data: conversation } = await supabase
  .from('conversations')
  .insert({
    customer_email: 'customer@example.com',
    customer_name: 'John Doe',
    subject: 'Need help with...',
    status: 'open',
    priority: 'medium',
  })
  .select()
  .single()
```

### 2. Message Storage

Every message is persisted to Supabase:

```typescript
await supabase.from('messages').insert({
  conversation_id: conversationId,
  role: 'user',
  content: messageContent,
})
```

### 3. Conversation History

Load messages when resuming a conversation:

```typescript
const { data: messages } = await supabase
  .from('messages')
  .select('*')
  .eq('conversation_id', conversationId)
  .order('created_at', { ascending: true })
```

## Real-time Updates

Enable real-time message updates:

```typescript
const channel = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`,
    },
    (payload) => {
      // Add new message to state
      setMessages((prev) => [...prev, payload.new])
    }
  )
  .subscribe()
```

## Admin Dashboard (Future Enhancement)

Build a support agent dashboard to:

- View all active conversations
- Filter by status, priority, customer
- Take over AI conversations
- View customer history
- Update conversation status

Example query:

```typescript
const { data: conversations } = await supabase
  .from('conversations')
  .select('*, messages(count)')
  .eq('status', 'open')
  .order('updated_at', { ascending: false })
```

## AI Integration

Replace the simulated response with actual AI:

```typescript
// Use OpenAI, Anthropic, or your preferred LLM
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    conversationId,
    messages,
    customerContext: {
      email: customer.email,
      name: customer.name,
    },
  }),
})
```

## Deployment

### Vercel + Supabase

```bash
# Deploy to Vercel
vercel

# Add environment variables in Vercel dashboard
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Cloudflare Pages

```bash
npm run build
npx wrangler pages publish .next

# Set environment variables
npx wrangler pages secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler pages secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Production Considerations

1. **Row Level Security**: Tighten RLS policies to restrict access
2. **API Keys**: Use service role key only on server-side routes
3. **Rate Limiting**: Add rate limits to prevent abuse
4. **Email Verification**: Verify customer emails
5. **Analytics**: Track conversation metrics
6. **Notifications**: Email/SMS notifications for customers and agents

## Project Structure

```
customer-support/
├── src/
│   ├── app/
│   │   ├── api/           # API routes (future)
│   │   ├── dashboard/     # Admin dashboard (future)
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Main chat page
│   │   └── globals.css    # Global styles
│   ├── components/
│   │   └── CustomerForm.tsx
│   └── lib/
│       ├── supabase.ts    # Supabase client
│       └── store.ts       # Zustand store
├── supabase/
│   └── migrations/
│       └── 20240101000000_initial_schema.sql
├── .env.example           # Environment variables template
└── package.json
```

## Learn More

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Next.js App Router](https://nextjs.org/docs/app)

## License

MIT
