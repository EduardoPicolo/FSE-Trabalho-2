import net from 'net'

import { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

import { MessageBuffer } from '@utils/MessageBuffer'

const connectedSockets: Record<string, net.Socket> = {}

const received = new MessageBuffer('\n')

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

const SocketHandler = (req: NextApiRequest, res: ExtendedNextApiResponse) => {
  switch (req.method) {
    case 'GET': {
      if (!res?.socket?.server?.io) {
        console.log('Starting Socket.io')

        // @ts-ignore
        const io = new Server(res?.socket?.server)

        io.on('connection', (socket) => {
          socket.on('hello', (msg) => {
            // console.log('HELLO SERVER: ', msg)
            // console.log('CONNECTIONS>: ', connectedSockets)
            socket.emit('hello', 'hello FROM SERVER')

            connectedSockets?.['Térreo'].write(
              JSON.stringify({
                type: 'lampada',
                value: 0
              })
            )
          })
        })

        // @ts-ignore
        res?.socket.server.io = io

        const server = res?.server as net.Server
        server?.listen(10049, function () {
          console.log('Socket is listening on port 10049')
        })

        server?.on('connection', (connection) => {
          connection.prependOnceListener('data', (data) => {
            console.log(data?.toString?.() + ' Connected')
            connectedSockets[data?.toString?.()] = connection
          })

          connection.on('data', function (data) {
            console.log('Received event: ' + data)
            // received.push(data)

            // while (!received.isFinished()) {
            //   const message = received.handleData()
            //   console.log(JSON.parse(message))
            // }

            // console.log('AFTER: ', received.getMessage())

            fetch('http://localhost:3000/api/event', {
              method: 'POST',
              body: data
            })
          })

          connection.on('end', function () {
            Object.keys(connectedSockets).forEach((socket) => {
              if (connectedSockets[socket] === connection) {
                console.log(`${socket} disconnected`)
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
