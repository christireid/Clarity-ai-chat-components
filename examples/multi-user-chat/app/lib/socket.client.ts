import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(typeof window !== 'undefined' ? window.location.origin : '', {
      autoConnect: false,
    })
  }
  return socket
}

export function connectSocket() {
  const socket = getSocket()
  if (!socket.connected) {
    socket.connect()
  }
  return socket
}

export function disconnectSocket() {
  if (socket && socket.connected) {
    socket.disconnect()
  }
}
