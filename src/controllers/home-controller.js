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
    const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues`
      , { headers: { Authorization: 'Bearer ' + process.env.PERSONAL_ACCESS_TOKEN } })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      })

    const issues = response.map(issueData => {
      return {
        title: issueData.title,
        description: issueData.description,
        avatarSrc: issueData.author.avatar_url
      }
    })

    res.render('home/index', { viewData: { issues }, title: 'Issue list' })
  }
}
