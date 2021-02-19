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

const PORT = process.env.PORT
const baseURL = process.env.BASE_URL
const directoryFullName = dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(logger('dev'))
app.use(helmet())
app.set('view engine', 'hbs')

// Configurations of the view engine.
app.engine('hbs', hbs.express4({
  defaultLayout: join(directoryFullName, 'views', 'layouts', 'default'),
  partialsDir: join(directoryFullName, 'views', 'partials')
}))
app.set('views', join(directoryFullName, 'views'))

app.use(express.urlencoded({ extended: false }))
app.use(express.static(join(directoryFullName, '..', 'public')))


app.use(function (req, res, next) {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }
  res.locals.baseURL = baseURL
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

// ------------------------------------
//      End of Middleware section
// ------------------------------------

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  console.log('Press Ctrl-C to terminate...')
})