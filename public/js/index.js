import '../socket.io/socket.io.js'

const wrapper = document.querySelector('#issueswrapper')

if (wrapper) {
  const baseURL = document.querySelector('base').getAttribute('href')
  const socket = window.io('/', { path: `${baseURL}socket.io` })

  socket.on('issueClosed', arg => {
    changeStateOfIssue(arg.id, 'Closed', 'reopen')
  })

  socket.on('issueReopen', arg => {
    changeStateOfIssue(arg.id, '', 'close')
  })

  socket.on('issueUpdated', arg => {
    updateIssue(arg.id, arg.title, arg.text)
  })

  socket.on('issueCreated', arg => {
    createIssue(arg.id, arg.title, arg.text, arg.avatarSrc)
  })
}

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
  document.querySelector(issueID).classList.toggle('closed')
}

/**
 * Called to update an issue.
 *
 * @param {number} id - The id of the issue.
 * @param {string} title - The text to use to display the state of the issue.
 * @param {string} text - The action that is possible to perform on the issue.
 */
function updateIssue (id, title, text) {
  const issueID = '#issue' + id
  document.querySelector(issueID + ' #title').textContent = title
  document.querySelector(issueID + ' #text').textContent = text
}

/**
 * Called to create an issue.
 *
 * @param {number} id - The id of the issue.
 * @param {string} title - The text to use to display the state of the issue.
 * @param {string} text - The action that is possible to perform on the issue.
 * @param {string} avatarSrc - The image src of the avatar to display.
 */
function createIssue (id, title, text, avatarSrc) {
  const issueTemplate = document.createElement('template')
  issueTemplate.innerHTML = `
  <div class="issue">
    <div id="textwrapper">
      <h3 id="title"></h3>
      <p id="text"></p>
    </div>
    <div id="otherwrapper">
      <img alt="avatar"> 
      <h5></h5>
      <form method="post">
      <button type="submit">Close issue</button>
      </form>
    </div>
  </div>`
  issueTemplate.content.querySelector('#text').textContent = text
  issueTemplate.content.querySelector('#title').textContent = title
  issueTemplate.content.querySelector('.issue').setAttribute('id', `issue${id}`)
  issueTemplate.content.querySelector('form').setAttribute('action', `issues/${id}/close`)
  issueTemplate.content.querySelector('img').setAttribute('src', avatarSrc)
  const newIssue = issueTemplate.content.cloneNode(true)
  if (wrapper.firstChild) {
    wrapper.insertBefore(newIssue, wrapper.firstChild)
  } else {
    wrapper.appendChild(newIssue)
  }
}
