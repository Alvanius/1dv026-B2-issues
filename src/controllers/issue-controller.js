/**
 * Issue controller.
 *
 * @author Alva Persson
 * @version 1.0.0
 */
import fetch from 'node-fetch'
import { basename } from 'path'
import { gitlabIssuesURL, headers } from '../gitlabAPIRequest.js'

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
    const changeStateURL = new URL(gitlabIssuesURL + issueID)
    changeStateURL.searchParams.append('state_event', requestedAction)
    await fetch(changeStateURL.toString(), { headers, method: 'PUT' })
      .then(response => {
        if (response.ok) {
          res.redirect('/')
        } else {
          console.log('unsuccessful attempt to change issue state, got response: ', response)
          const error = new Error()
          error.status = 404
          next(error)
        }
      })
      .catch(error => {
        console.log('error making gitlab API call changing state: ', error)
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
    const createIssueURL = new URL(gitlabIssuesURL)
    createIssueURL.searchParams.append('title', req.body.issuetitle)
    createIssueURL.searchParams.append('description', req.body.description)
    createIssueURL.searchParams.append('labels', req.body.labels.split(' ').join(', '))
    await fetch(createIssueURL.toString(), { headers, method: 'POST' })
      .then(response => {
        if (response.status === 201) {
          res.redirect('/')
        } else {
          console.log('unsuccessful attempt to create issue, got response: ', response)
          const error = new Error()
          if (response.status === 400) {
            error.status = 400
          }
          next(error)
        }
      })
      .catch(error => {
        console.log('error making gitlab API call creating issue: ', error)
        next(error)
      })
  }
}
