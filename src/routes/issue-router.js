/**
 * Issue routes.
 *
 * @author Alva Persson
 * @version 1.0.0
 */

import express from 'express'
import { IssueController } from '../controllers/issue-controller.js'

export const router = express.Router()

const controller = new IssueController()

router.post('/:id/close', controller.close)
router.get('/new', controller.new)
router.post('/create', controller.create)
