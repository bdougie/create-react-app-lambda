const axios = require('axios')
const GITHUB_REPO = process.env.GITHUB_REPO
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN
const GITHUB_USERNAME = process.env.GITHUB_USERNAME

/* Github Request headers */
const config = {
  'headers': {
    'User-Agent': GITHUB_USERNAME,
    'Authorization': `token ${GITHUB_API_TOKEN}`
  }
}

function getReleaseData() {
  console.log(GITHUB_USERNAME)
  console.log(`token ${GITHUB_API_TOKEN}`)
  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/releases/?user=${GITHUB_USERNAME}&token=${GITHUB_API_TOKEN}`
  return axios.get(url, config).then(function(response) {
    return response.data
  })
}

export function handler(event, context, callback) {
  const body = JSON.parse(event.body)

  getReleaseData().then((response) => {
    console.log(reponse)
    return {
      item: "value"
    }
  })
  .catch((e) => {
    console.log(e)
    return callback(e)
  })
}

