const axios = require('axios')
const GITHUB_REPO = process.env.GITHUB_REPO
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN
const GITHUB_USERNAME = process.env.GITHUB_USERNAME
const GITTER_TOKEN = process.env.GITTER_TOKEN
const GITTER_ROOM_ID = process.env.GITTER_ROOM_ID
const Twitter = require('twitter');
var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});


const exec = require('child_process').exec;

function sendToGitter(releaseData) {
  // Gitter does not allow posting message through http, POST requests must be
  // curl'd
  const foo = exec(
    `curl -X POST -i -H "Content-Type: application/json" -H "Accept: application/json" -H "Authorization: Bearer ${GITTER_TOKEN}" "https://api.gitter.im/v1/rooms/${GITTER_ROOM_ID}/chatMessages" -d '{"text":"I am testing my Netlify Function to see if it fires and it does 😻"}'`
  )
}

function getReleaseData() {
  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/releases/latest?user=${GITHUB_USERNAME}&token=${GITHUB_API_TOKEN}`
  return axios.get(url, config).then(function(response) {
    return response.data
  })
}

function createReleasePost(releaseData) {
  const content = {
    "message": releaseData["tag_name"],
    "committer": {
      "name": "Brian Douglas",
      "email": "ilikerbot@gmail.com"
    },
    "content": releaseData["body"]
  }
  const url = `https://api.github.com/repos/bdougie/create-react-app-lambda/contents/public/foo.md?token=${GITHUB_API_TOKEN}&user=${GITHUB_USERNAME}`
  return axios.put(url, content).then(function(response) {
    console.log(response);
  })
  .catch((e) => {
    console.log(e);
  })
}

function sendTweet(releaseData) {
  const msg = `New release ${releaseData['tag_name']} is shipped! 🚀 ${releaseData['url']}`

  twitterClient.post('statuses/update', {status: msg},  function(error, tweet, response) {
    if(error) throw error;
    console.log(tweet);
    console.log(response);
  });
}

export function handler(event, context, callback) {
  const body = JSON.parse(event.body)

  getReleaseData().then((response) => {
    const parsedData = JSON.parse(value);
    sendTweet(parsedData);
    createReleasePost(parsedData);

    return {
      status: "200"
    }
  })
  .catch((e) => {
    console.log(e)
    return callback(e)
  })
}

