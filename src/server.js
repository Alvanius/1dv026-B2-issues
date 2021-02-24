/**
 * The starting point of the application.
 *
 * @author Alva Persson
 * @version 1.0.0
 */

import express from 'express'
import helmet from 'helmet'
import hbs from 'express-hbs'
import logger from 'morgan'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { router } from './routes/router.js'
import http from 'http'
import { Server } from 'socket.io'

const PORT = process.env.PORT
const baseURL = process.env.BASE_URL
const directoryFullName = dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(logger('dev'))
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': ["'self'", 'gitlab.lnu.se']
    }
  })
)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, {
  secure: true
})

io.on('connection', (socket) => {
  console.log('A user connected')

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

app.set('view engine', 'hbs')

app.engine('hbs', hbs.express4({
  defaultLayout: join(directoryFullName, 'views', 'layouts', 'default'),
  partialsDir: join(directoryFullName, 'views', 'partials')
}))

app.set('views', join(directoryFullName, 'views'))
app.use(express.static(join(directoryFullName, '..', 'public')))

app.use(function (req, res, next) {
  res.locals.baseURL = baseURL
  res.io = io
  next()
})

app.use('/', router)

app.use(function (err, req, res, next) {
  if (app.get('env') === 'development') {
    res
      .status(err.status || 500)
      .render('errors/error', { error: err })
  }
})

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  console.log('Press Ctrl-C to terminate...')
})
