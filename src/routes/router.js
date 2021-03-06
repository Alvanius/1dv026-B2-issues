/**
 * The routes.
 *
 * @author Alva Persson
 * @version 1.0.0
 */

import express from 'express'
import { router as homeRouter } from './home-router.js'
import { router as hookRouter } from './hook-router.js'
import { router as issueRouter } from './issue-router.js'

export const router = express.Router()

router.use('/webhook', hookRouter)
router.use('/', homeRouter)
router.use('/issues', issueRouter)

router.use('*', (req, res, next) => {
  const error = new Error()
  error.status = 404
  next(error)
})
