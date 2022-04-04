import net from 'net'

import { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

import { MessageBuffer } from '@utils/MessageBuffer'

interface ExtendedNextApiResponse<T = any> extends NextApiResponse<T> {
  server: net.Server
  socket:
    | (net.Socket & {
        server: {
          io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
        }
      })
    | null
}

const connectedSockets: Record<string, net.Socket> = {}
const received = new MessageBuffer('\r')

const SocketHandler = (req: NextApiRequest, res: ExtendedNextApiResponse) => {
  switch (req.method) {
    case 'GET': {
      if (!res?.socket?.server?.io) {
        console.log('Starting Socket.io')

        // @ts-ignore
        const io = new Server(res?.socket?.server)

        io.on('connection', (socket) => {
          socket.on('input-event', (data) => {
            const { to, type, value } = data

            connectedSockets?.[to].write(
              JSON.stringify({
                type,
                value
              })
            )
          })
        })

        // @ts-ignore
        res?.socket.server.io = io

        const server = net.createServer()
        server?.listen(10049, function () {
          console.log('Socket is listening on port 10049')
        })

        server?.on('connection', (connection) => {
          connection.prependOnceListener('data', (data) => {
            console.log(data?.toString?.() + ' Connected')
            connectedSockets[data?.toString?.()] = connection

            io.emit('connection', {
              from: data?.toString?.(),
              type: 'connection',
              value: 1
            })
          })

          connection.on('data', function (data) {
            // console.log('Received: ' + data)

            try {
              const payload = JSON.parse(data.toString()) as ServerEvent
              console.log('PAYLOAD: ', payload)
              // @ts-ignore
              if (payload.type === 'confirmacao') {
                io.emit('confirmation', payload)
              } else if (payload.type === 'dht') {
                io.emit('dht', payload)
              } else if (
                payload.type.includes('contagemPredio') ||
                payload.type.includes('contagemAndar')
              ) {
                io.emit('count', payload)
              } else io.emit('event', payload)
            } catch (error) {
              console.error('Invalid event')
            }
          })

          connection.on('end', function () {
            Object.keys(connectedSockets).forEach((socket) => {
              if (connectedSockets[socket] === connection) {
                console.log(`${socket} disconnected`)
                io.emit('connection', {
                  from: socket,
                  type: 'connection',
                  value: 0
                })
                delete connectedSockets[socket]
              }
            })
          })
        })
      } else {
        console.log('Socket.io already running')
      }

      break
    }

    default: {
      break
    }
  }

  res.end()
}

export default SocketHandler
