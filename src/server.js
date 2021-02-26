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
import fetch from 'node-fetch'
const { FetchError } = fetch

const PORT = process.env.PORT
const baseURL = process.env.BASE_URL
const directoryFullName = dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(logger('dev'))
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': ["'self'", 'gitlab.lnu.se']
    }
  }
}))
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
  let title = 'An error occured'
  let error = '500 Internal server error'
  let errortext = 'Sorry, but something went wrong.'
  if (err instanceof FetchError) {
    errortext = 'The action could not be performed. Please try again later.'
  } else if (err.status === 404) {
    title = 'Page not found'
    error = '404 Not Found'
    errortext = 'Sorry, but the page you were trying to view does not exist.'
  } else if (err.status === 400) {
    title = 'Request failed'
    error = '400 Bad request'
    errortext = 'A new issue could not be created with the passed data.'
  }
  res
    .status(err.status || 500)
    .render('errors/error', { title, error, errortext })
})

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  console.log('Press Ctrl-C to terminate...')
})
