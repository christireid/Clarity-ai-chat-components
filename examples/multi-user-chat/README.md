# Multi-User Chat Demo

Real-time multi-user chat application with Socket.io and Remix.

## Features

- ✅ **Real-time messaging**: Instant message delivery via WebSockets
- ✅ **Multiple rooms**: Separate chat rooms for different topics
- ✅ **User presence**: See who's online in each room
- ✅ **Typing indicators**: Know when someone is typing
- ✅ **Join/leave notifications**: System messages for user activity
- ✅ **Persistent connections**: Automatic reconnection handling
- ✅ **Username display**: See who sent each message

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open multiple browser windows**:
   ```
   http://localhost:3000
   ```

4. **Join the same room from different windows to test multi-user functionality**

## How It Works

### Server Side (server/index.js)

Express server with Socket.io for WebSocket connections:

```javascript
io.on('connection', (socket) => {
  // User joins room
  socket.on('join', ({ username, room }) => {
    socket.join(room)
    io.to(room).emit('user_joined', { user, users })
  })

  // New message
  socket.on('send_message', ({ room, message }) => {
    io.to(room).emit('new_message', message)
  })

  // Typing indicators
  socket.on('typing_start', ({ room }) => {
    socket.to(room).emit('user_typing', { username })
  })
})
```

### Client Side (app/routes/_index.tsx)

React component with Socket.io client:

```typescript
const socket = connectSocket()

// Listen for new messages
socket.on('new_message', (message) => {
  setMessages((prev) => [...prev, message])
})

// Send messages
socket.emit('send_message', { room, message })
```

## Socket.io Events

### Client → Server

- `join` - Join a chat room
- `send_message` - Send a message to the room
- `typing_start` - Indicate user is typing
- `typing_stop` - Indicate user stopped typing

### Server → Client

- `user_joined` - User joined the room
- `user_left` - User left the room
- `new_message` - New message received
- `user_typing` - Another user is typing
- `user_stopped_typing` - User stopped typing

## Data Structures

### User

```typescript
{
  id: string          // Socket ID
  username: string    // Display name
  room: string        // Current room
  joinedAt: number    // Timestamp
}
```

### Message

```typescript
{
  id: string
  role: 'user' | 'system'
  content: string
  username?: string   // Who sent it
  timestamp: number
}
```

## Architecture

```
Client Browser
    ↓↑ WebSocket
Express Server + Socket.io
    ↓↑ WebSocket
Other Clients
```

### State Management

- **Server**: In-memory maps for users and rooms
- **Client**: React state for messages and users
- **Real-time sync**: Socket.io events keep clients in sync

## Production Enhancements

### 1. Persistent Storage

Add database for message history:

```typescript
// Store messages
await db.messages.create({
  room,
  username,
  content,
  timestamp: new Date(),
})

// Load history on join
const history = await db.messages.findMany({
  where: { room },
  orderBy: { timestamp: 'asc' },
  take: 100,
})
```

### 2. Authentication

Add user authentication:

```typescript
// Verify user on connection
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token
  const user = await verifyToken(token)
  if (user) {
    socket.data.user = user
    next()
  } else {
    next(new Error('Authentication error'))
  }
})
```

### 3. Rate Limiting

Prevent spam:

```typescript
const messageRateLimiter = new Map()

socket.on('send_message', ({ room, message }) => {
  const userId = socket.id
  const now = Date.now()
  const userMessages = messageRateLimiter.get(userId) || []
  
  // Allow max 10 messages per minute
  const recentMessages = userMessages.filter(time => now - time < 60000)
  if (recentMessages.length >= 10) {
    socket.emit('rate_limited')
    return
  }
  
  messageRateLimiter.set(userId, [...recentMessages, now])
  // Process message...
})
```

### 4. Redis for Scaling

Use Redis adapter for multi-server deployment:

```javascript
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'

const pubClient = createClient({ url: 'redis://localhost:6379' })
const subClient = pubClient.duplicate()

io.adapter(createAdapter(pubClient, subClient))
```

### 5. Message Encryption

Encrypt messages end-to-end:

```typescript
// Client side
import { encrypt, decrypt } from './crypto'

const encryptedMessage = await encrypt(message, roomKey)
socket.emit('send_message', { room, message: encryptedMessage })

socket.on('new_message', async (encryptedMsg) => {
  const decrypted = await decrypt(encryptedMsg.content, roomKey)
  setMessages((prev) => [...prev, { ...encryptedMsg, content: decrypted }])
})
```

## Deployment

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Render

```bash
# Build command
npm run build

# Start command
npm start
```

### Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Launch app
fly launch
fly deploy
```

## Environment Variables

```env
PORT=3000
NODE_ENV=production
```

## Testing Multi-User

1. Open 3+ browser windows
2. Join the same room with different usernames
3. Send messages from each window
4. Observe real-time delivery
5. Close a window to see leave notifications
6. Start typing to see typing indicators

## Project Structure

```
multi-user-chat/
├── app/
│   ├── components/
│   │   ├── JoinForm.tsx       # Room join form
│   │   └── UserList.tsx       # Active users sidebar
│   ├── lib/
│   │   └── socket.client.ts   # Socket.io client wrapper
│   ├── routes/
│   │   └── _index.tsx         # Main chat page
│   └── root.tsx               # Root layout
├── server/
│   └── index.js               # Express + Socket.io server
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
└── package.json
```

## Learn More

- [Socket.io Documentation](https://socket.io/docs/)
- [Remix Documentation](https://remix.run/docs)
- [Socket.io with Remix](https://github.com/remix-run/examples/tree/main/socket.io)

## License

MIT
