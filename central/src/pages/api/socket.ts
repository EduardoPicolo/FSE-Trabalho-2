import fs from 'fs'
import net from 'net'

import { NextApiRequest, NextApiResponse } from 'next'
import ObjectsToCsv from 'objects-to-csv'
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

const SocketHandler = (req: NextApiRequest, res: ExtendedNextApiResponse) => {
  switch (req.method) {
    case 'GET': {
      if (!res?.socket?.server?.io) {
        try {
          process.stdout.write('Erasing log file... ')
          fs.writeFileSync('./static/log.csv', '')
          console.log('done')
        } catch (error) {
          console.error(error)
        }

        console.log('Starting Socket.io')
        const io = new Server(res?.socket?.server)

        io.on('connection', (socket) => {
          socket.onAny((event, ...args) => {
            const log = [
              {
                comando: `${Number(args[0]?.value) ? 'Liga' : 'Desliga'} ${
                  args[0]?.type ?? 'todos'
                }`,
                andar: args[0]?.to,
                horario: new Date().toLocaleString()
              }
            ]
            new ObjectsToCsv(log).toDisk('./static/log.csv', { append: true })
          })

          socket.on('input-event', (data) => {
            const { to, type, value } = data

            connectedSockets?.[to]?.write?.(
              JSON.stringify({
                type,
                value
              })
            )
          })
        })

        // @ts-ignore
        res?.socket.server.io = io

        console.log(process.env.NODE_ENV)
        const server = net.createServer()

        server.on('error', (e) => {
          if (e?.code === 'EADDRNOTAVAIL') {
            console.log('Address not available, retrying...')
            setTimeout(() => {
              server.close()
              server.listen(10049, 'localhost', () => {
                console.log('Socket listening on port localhost:10049')
              })
            }, 1000)
          }
        })

        server?.listen(
          10049,
          process.env.NODE_ENV === 'development' ? 'localhost' : '192.168.0.53',
          () => {
            console.log('Socket listening on port 10049')
          }
        )

        server?.on('connection', (connection) => {
          const received = new MessageBuffer('\n')

          connection.on('data', function (data) {
            received.push(data)

            while (!received.isFinished()) {
              const message = received.handleData()
              console.log('RECEIVED: ', JSON.parse(message))
              const payload = JSON.parse(message) as ServerEvent

              try {
                switch (payload.type) {
                  case 'identity': {
                    connectedSockets[payload.value] = connection
                    io.emit('connection', {
                      from: payload?.value,
                      type: 'connection',
                      value: 1
                    })
                    break
                  }
                  case 'dht': {
                    io.emit('dht', payload)
                    break
                  }
                  case 'confirmacao': {
                    io.emit('confirmation', payload)
                    break
                  }
                  case 'contagemPredio':
                  case 'contagemAndar': {
                    io.emit('count', payload)
                    break
                  }
                  default:
                    io.emit('event', payload)
                    break
                }
              } catch (error) {
                console.error('Invalid event: ', error)
              }
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
