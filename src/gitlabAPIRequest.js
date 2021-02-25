/**
 * The gitlab api calls resource module.
 *
 * @author Alva Persson
 * @version 1.0.0
 */

export const gitlabIssuesURL = `https://gitlab.lnu.se/api/v4/projects/${process.env.PROJECT_ID}/issues/`

export const headers = {
  Authorization: 'Bearer ' + process.env.PERSONAL_ACCESS_TOKEN
}
