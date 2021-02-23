/**
 * Home controller.
 *
 * @author Alva Persson
 * @version 1.0.0
 */

import fetch from 'node-fetch'

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
      const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues?page=${page}`
        , { headers: { Authorization: 'Bearer ' + process.env.PERSONAL_ACCESS_TOKEN } })
        .then(response => {
          if (response.ok) {
            numberOfPages = response.headers.raw()['x-total-pages'][0]
            return response.json()
          }
        })

      issues.push(...response.map(issueData => {
        return {
          title: issueData.title,
          description: issueData.description,
          avatarSrc: issueData.author.avatar_url
        }
      }))
    } while (page++ < numberOfPages)

    res.render('home/index', { viewData: { issues: issues.reverse() }, title: 'Issue list' })
  }
}
