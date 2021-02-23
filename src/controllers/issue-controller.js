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
    // .catch(error => /* failed to create new issue */ )
    res.redirect('/')
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
    const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues/?title=${req.body.issuetitle}&description=${req.body.description}&labels=${req.body.labels.split(' ').join(', ')}`
      , { headers: { Authorization: 'Bearer ' + process.env.PERSONAL_ACCESS_TOKEN }, method: 'POST' })
    // .catch(error => /* failed to create new issue */ )
    if (!response.ok) {
      console.log('failed to create a new issue')
    } else {
      console.log('successfully created a new issue')
    }
    res.redirect('/')
  }
}
