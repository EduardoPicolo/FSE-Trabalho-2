import net from 'net'

import { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

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
    case 'POST': {
      let data

      try {
        data = JSON.parse(req.body) as ServerEvent
        console.log('Event received ' + data.type + ' from ' + data.from)
        res?.socket?.server?.io.emit('event', data)
      } catch {
        res.status(400).send('Invalid event')
      }
    }

    default: {
      break
    }
  }

  res.end()
}

export default SocketHandler
