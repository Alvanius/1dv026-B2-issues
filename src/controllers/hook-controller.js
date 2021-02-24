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
    switch (req.body.object_attributes.action) {
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
