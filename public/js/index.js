import '../socket.io/socket.io.js'

const socket = window.io()

socket.on('issueClosed', arg => {
  console.log('closed: ', arg.id)
  const issue = document.querySelector(`#id${arg.id}`)
  issue.firstElementChild.textContent = 'closed'
  const form = document.querySelector(`#id${arg.id} form`)
  form.setAttribute('action', `issues/${arg.id}/reopen`)
  const button = document.querySelector(`#id${arg.id} button`)
  button.textContent = 'REOPEN text'
})

socket.on('issueReopen', arg => {
  console.log('reopen: ', arg)
  const issue = document.querySelector(`#id${arg.id}`)
  issue.firstElementChild.textContent = ''
  const form = document.querySelector(`#id${arg.id} form`)
  form.setAttribute('action', `issues/${arg.id}/close`)
  const button = document.querySelector(`#id${arg.id} button`)
  button.textContent = 'CLOSE text'
})
