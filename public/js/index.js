import '../socket.io/socket.io.js'

const socket = window.io()

socket.on('issueClosed', arg => {
  changeStateOfIssue(arg.id, 'Closed', 'reopen')
})

socket.on('issueReopen', arg => {
  changeStateOfIssue(arg.id, '', 'close')
})

/**
 * Called to change state of an issue.
 *
 * @param {number} id - The id of the issue.
 * @param {string} statetext - The text to use to dispaly the state of the issue.
 * @param {string} action - The action that is possible to perform on the issue.
 */
function changeStateOfIssue (id, statetext, action) {
  const issue = document.querySelector(`#id${id}`)
  issue.firstElementChild.textContent = statetext
  const form = document.querySelector(`#id${id} form`)
  form.setAttribute('action', `issues/${id}/${action}`)
  const button = document.querySelector(`#id${id} button`)
  button.textContent = action
}
