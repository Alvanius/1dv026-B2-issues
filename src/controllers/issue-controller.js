/**
 * Isuue controller.
 *
 * @author Alva Persson
 * @version 1.0.0
 */
import fetch from 'node-fetch'

/**
 * Encapsulates a controller.
 */
export class IssueController {
  /**
   * Renders the start page with a login form.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async close (req, res, next) {
    const issueID = req.params.id
    const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues/${issueID}?state_event=close`
      , { headers: { Authorization: 'Bearer ' + process.env.PERSONAL_ACCESS_TOKEN }, method: 'PUT' })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      })
    console.log(response)
    res.redirect('/')
  }
}
