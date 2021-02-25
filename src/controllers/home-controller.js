/**
 * Home controller.
 *
 * @author Alva Persson
 * @version 1.0.0
 */

import fetch from 'node-fetch'

const PROJECT = process.env.PROJECT_ID

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
      const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${PROJECT}/issues?page=${page}`
        , { headers: { Authorization: 'Bearer ' + process.env.PERSONAL_ACCESS_TOKEN } })
        .then(response => {
          if (response.ok) {
            numberOfPages = response.headers.raw()['x-total-pages'][0]
            return response.json()
          } else {
            console.log(`attempting to fetch issues from project ${PROJECT} and failed with status: ${response.status}`)
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
