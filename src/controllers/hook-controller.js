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
    const issueDetails = {
      text: req.body.object_attributes.description,
      title: req.body.object_attributes.title,
      id: req.body.object_attributes.iid
    }
    switch (req.body.object_attributes.action) {
      case 'open':
        res.io.emit('issueCreated', issueDetails)
        break
      case 'update':
        res.io.emit('issueUpdated', issueDetails)
        break
      case 'reopen':
        res.io.emit('issueReopen', {
          id: req.body.object_attributes.iid
        })
        break
      case 'close':
        res.io.emit('issueClosed', {
          id: req.body.object_attributes.iid
        })
        break
    }
    res.status(200).send('Received issue hook')
  }
}
