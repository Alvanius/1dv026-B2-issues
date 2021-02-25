/**
 * Isuue controller.
 *
 * @author Alva Persson
 * @version 1.0.0
 */
import fetch from 'node-fetch'
import { basename } from 'path'

/**
 * Encapsulates a controller.
 */
export class IssueController {
  /**
   * Called to change the state of an issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async changeState (req, res, next) {
    const issueID = req.params.id
    const requestedAction = basename(req.path) // evaluates to reopen or close depending on the action of the form the user submitted
    await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues/${issueID}?state_event=${requestedAction}`, {
      headers: { Authorization: 'Bearer ' + process.env.PERSONAL_ACCESS_TOKEN },
      method: 'PUT'
    })
      .then(response => {
        if (!response.ok) {
          const error = new Error()
          error.status = 404
          next(error)
        } else {
          res.redirect('/')
        }
      })
      .catch(error => {
        next(error)
      })
  }

  /**
   * Renders the new issue page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  new (req, res, next) {
    res.render('issues/newIssue', { title: 'New issue' })
  }

  /**
   * Called to create a new issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues/?title=${req.body.issuetitle}&description=${req.body.description}&labels=${req.body.labels.split(' ').join(', ')}`
      , { headers: { Authorization: 'Bearer ' + process.env.PERSONAL_ACCESS_TOKEN }, method: 'POST' })
      .then(response => {
        if (response.status === 201) {
          res.redirect(201, '/')
        } else if (response.status === 400) {
          const error = new Error()
          error.status = 400
          next(error)
        } else {
          const error = new Error()
          next(error)
        }
      })
      .catch(error => {
        next(error)
      })
  }
}
