import net from 'net'

import { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

const connectedSockets: Record<string, net.Socket> = {}

// broadcast to all connected sockets except one
// connectedSockets.broadcast = function (data: any, except: any) {
//   for (const sock of this) {
//     if (sock !== except) {
//       sock.write(data)
//     }
//   }
// }

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
            console.log('HELLO SERVER: ', msg)
            console.log('CONNECTIONS>: ', connectedSockets)
            socket.emit('hello', 'hello FROM SERVER')

            // connectedSockets?.broadcast?.(
            //   JSON.stringify({
            //     data: 'CENTRAL SERVER'
            //   }),
            //   'nexiste'
            // )
          })
        })

        // @ts-ignore
        res?.socket.server.io = io

        const server = res?.server as net.Server
        server?.listen(8080, function () {
          console.log('Socket is listening on port 8080')
        })

        server?.on('connection', (connection) => {
          connection.prependOnceListener('data', (data) => {
            const teste = JSON.parse(data?.toString()) as ServerEvent
            connectedSockets[teste?.name] = connection
          })

          connection.on('data', function (data) {
            console.log('Received: ' + data)
            //   connection.write('Hello FROM SERVER\r\n')
            fetch('http://localhost:3000/api/socket?teste=teste', {
              method: 'POST',
              body: data
            })
            // connection.destroy() // kill client after server's response
            // connectedSockets.broadcast(data, sock);
          })

          //   connection.write('Connection accepted!!!\r\n')
          //   connection.pipe(connection)

          connection.on('end', function () {
            console.log('Client disconnected')
            Object.keys(connectedSockets).forEach((key) => {
              if (connectedSockets[key] === connection)
                delete connectedSockets[key]
            })
          })
        })
      } else {
        console.log('Socket.io already running')
      }

      break
    }

    case 'POST': {
      const data = JSON.parse(req.body)
      console.log('RECEIVED: ', data)

      res?.socket?.server?.io.emit('update-temperature', data)
    }

    default: {
      break
    }
  }

  res.end()
}

export default SocketHandler
