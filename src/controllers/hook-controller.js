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
  handleIssue (req, res, next) {
    const reqIssue = req.body.object_attributes
    const id = reqIssue.iid
    const issueDetails = {
      text: reqIssue.description,
      title: reqIssue.title,
      id
    }
    switch (reqIssue.action) {
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
}
