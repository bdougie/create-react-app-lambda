const axios = require('axios')
const GITHUB_REPO = process.env.GITHUB_REPO
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN
const GITHUB_USERNAME = process.env.GITHUB_USERNAME
const Twitter = require('twitter');
var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

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

function sendTweet(response) {
  const msg = `New release ${response['tag_name']} is shipped! 🚀 ${response['url']}`

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
    // commented now to prevent me spamming my twitter account while testing
    // sendTweet(parsedData);
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

