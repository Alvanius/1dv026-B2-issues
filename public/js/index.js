import '../socket.io/socket.io.js'

const socket = window.io()

socket.on('issueClosed', arg => {
  changeStateOfIssue(arg.id, 'Closed', 'reopen')
})

socket.on('issueReopen', arg => {
  changeStateOfIssue(arg.id, '', 'close')
})

socket.on('issueUpdated', arg => {
  updateIssue(arg.id, arg.title, arg.text)
})

/**
 * Called to change state of an issue.
 *
 * @param {number} id - The id of the issue.
 * @param {string} statetext - The text to use to dispaly the state of the issue.
 * @param {string} action - The action that is possible to perform on the issue.
 */
function changeStateOfIssue (id, statetext, action) {
  const issueID = '#issue' + id
  document.querySelector(issueID + ' h5').textContent = statetext
  document.querySelector(issueID + ' form').setAttribute('action', `issues/${id}/${action}`)
  document.querySelector(issueID + ' button').textContent = action + ' issue'
}

/**
 * Called to update an issue.
 *
 * @param {number} id - The id of the issue.
 * @param {string} title - The text to use to dispaly the state of the issue.
 * @param {string} text - The action that is possible to perform on the issue.
 */
function updateIssue (id, title, text) {
  const issueID = '#issue' + id
  document.querySelector(issueID + ' #title').textContent = title
  document.querySelector(issueID + ' #text').textContent = text
}
