// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const net = require('net')

app.prepare().then(() => {
  fetch('http://localhost:3000/api/socket')
  const server = net.createServer()

  //   server.listen(8080, function () {
  //     console.log('Socket is listening on port 8080')
  //   })

  createServer(async (req, res) => {
    res.server = server

    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal server error')
    }
  })
    .listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://${hostname}:${port}`)
    })
    .on('close', () => {
      console.log('> Server closed')
      server.close()
    })
})
