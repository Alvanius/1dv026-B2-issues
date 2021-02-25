/**
 * Home controller.
 *
 * @author Alva Persson
 * @version 1.0.0
 */

import fetch from 'node-fetch'
import { gitlabIssuesURL, headers } from '../gitlabAPIRequest.js'

/**
 * Encapsulates a controller.
 */
export class HomeController {
  /**
   * Renders the start page with a login form.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    let page = 1
    let numberOfPages
    const issues = []
    do {
      const getProjectIssuesURL = new URL(gitlabIssuesURL)
      getProjectIssuesURL.searchParams.append('page', page)
      const response = await fetch(getProjectIssuesURL.toString(), { headers })
        .then(response => {
          if (response.ok) {
            numberOfPages = response.headers.raw()['x-total-pages'][0]
            return response.json()
          } else {
            console.log(`attempting to fetch issues from project ${process.env.PROJECT_ID} and failed with status: ${response.status}`)
            res.locals.fetchFailed = true
          }
        })
        .catch(error => {
          console.log('error caught when fetching issues: ', error)
          res.locals.fetchFailed = true
        })
      if (Array.isArray(response)) {
        issues.push(...response.map(issueData => {
          return {
            title: issueData.title,
            description: issueData.description,
            avatarSrc: issueData.author.avatar_url,
            id: issueData.iid,
            closedstate: issueData.state === 'opened' ? '' : issueData.state
          }
        }))
      }
    } while (page++ < numberOfPages)

    res.render('home/index', { viewData: { issues }, title: 'Issue list' })
  }
}
