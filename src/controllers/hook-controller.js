/**
 * Webhook controller.
 *
 * @author Alva Persson
 * @version 1.0.0
 */

/**
 * Encapsulates a controller.
 */
export class HookController {
  /**
   * Called to handle a change in an issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  handleIssueChange (req, res, next) {
    const issueData = req.body.object_attributes
    const id = issueData.iid
    const issueDetails = {
      text: issueData.description,
      title: issueData.title,
      id
    }
    switch (issueData.action) {
      case 'open':
        issueDetails.avatarSrc = req.body.user.avatar_url
        res.io.emit('issueCreated', issueDetails)
        break
      case 'update':
        res.io.emit('issueUpdated', issueDetails)
        break
      case 'reopen':
        res.io.emit('issueReopen', { id })
        break
      case 'close':
        res.io.emit('issueClosed', { id })
        break
    }
    res.status(200).send('Received issue hook')
  }

  /**
   * Authorizes the webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authorize (req, res, next) {
    if (req.headers['x-gitlab-token'] !== process.env.HOOK_SECRET) {
      res.status(403).send('Incorrect Secret')
      return
    }

    next()
  }
}
