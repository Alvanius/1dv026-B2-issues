/**
 * Webhook routes.
 *
 * @author Alva Persson
 * @version 1.0.0
 */

import express from 'express'
import { HookController } from '../controllers/hook-controller.js'

export const router = express.Router()

const controller = new HookController()

router.post('/issue', controller.authorize, controller.handleIssueChange)
