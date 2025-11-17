import { createRequestHandler } from '@remix-run/express'
import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'

const viteDevServer =
  process.env.NODE_ENV === 'production'
    ? undefined
    : await import('vite').then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      )

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

// Store active users
const users = new Map()
const rooms = new Map()

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join', ({ username, room }) => {
    const user = {
      id: socket.id,
      username,
      room,
      joinedAt: Date.now(),
    }

    users.set(socket.id, user)
    socket.join(room)

    // Add user to room
    if (!rooms.has(room)) {
      rooms.set(room, new Set())
    }
    rooms.get(room).add(socket.id)

    // Notify room
    const roomUsers = Array.from(rooms.get(room)).map((id) => users.get(id))
    io.to(room).emit('user_joined', { user, users: roomUsers })

    console.log(`${username} joined room ${room}`)
  })

  socket.on('send_message', ({ room, message }) => {
    const user = users.get(socket.id)
    if (user) {
      io.to(room).emit('new_message', {
        id: `${Date.now()}-${socket.id}`,
        role: 'user',
        content: message,
        username: user.username,
        timestamp: Date.now(),
      })
    }
  })

  socket.on('typing_start', ({ room }) => {
    const user = users.get(socket.id)
    if (user) {
      socket.to(room).emit('user_typing', { username: user.username })
    }
  })

  socket.on('typing_stop', ({ room }) => {
    socket.to(room).emit('user_stopped_typing')
  })

  socket.on('disconnect', () => {
    const user = users.get(socket.id)
    if (user) {
      const { room, username } = user
      
      // Remove from room
      if (rooms.has(room)) {
        rooms.get(room).delete(socket.id)
        if (rooms.get(room).size === 0) {
          rooms.delete(room)
        } else {
          const roomUsers = Array.from(rooms.get(room)).map((id) => users.get(id))
          io.to(room).emit('user_left', { user, users: roomUsers })
        }
      }
      
      users.delete(socket.id)
      console.log(`${username} disconnected from room ${room}`)
    }
  })
})

// Remix middleware
if (viteDevServer) {
  app.use(viteDevServer.middlewares)
} else {
  app.use('/assets', express.static('build/client/assets', { immutable: true, maxAge: '1y' }))
}
app.use(express.static('build/client', { maxAge: '1h' }))

app.all(
  '*',
  createRequestHandler({
    build: viteDevServer
      ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
      : await import('../build/server/index.js'),
  })
)

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
