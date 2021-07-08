const url = require('url');
const { httpsGet } = require('./reqmod');

const GITHUB_HOST = 'api.github.com';

const buildPRHTTPOpts = (prNumber, config) => {
  return buildHTTPOpts(
    `/repos/${config.username}/${config.project}/pulls/${prNumber}`
  );
};

const buildStatusesHTTPOpts = (sha, config) => {
  return buildHTTPOpts(
    `/repos/${config.username}/${config.project}/statuses/${sha}`
  );
};

const buildHTTPOpts = (path) => {
  return {
    host: GITHUB_HOST,
    path,
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'circleci-to-vscode'
    }
  };
};

module.exports = {
  parsePullRequestNumber: (url, config) => {
    const pattern = new RegExp(`https://github.com/${config.username}/${
        config.project}/pull/(\\d+)`);
    const matches = url.match(pattern);
    if (matches && matches.length === 2) {
        return matches[1];
    }
  }, 
  fetchBuildNumFromPR: (prNum, cliConfig) => {
    return new Promise((resolve, reject) => {
      const prOpts = buildPRHTTPOpts(prNum, cliConfig);
      httpsGet(prOpts).then(prData => {
        const statusesOpts = buildStatusesHTTPOpts(prData.head.sha, cliConfig);
        httpsGet(statusesOpts).then(statusData => {
          const circleStatus = statusData.find(status =>
            status.context === 'ci/circleci: build'
          );
          if (circleStatus) {
            const urlParts = url.parse(circleStatus.target_url).pathname.split('/');
            const buildNum = urlParts[urlParts.length - 1];
            return resolve(buildNum);
          }
          throw new Error();
        })
        .catch(() => {
          reject(`Couldn't fetch circleci status for pull request ${prNum}`);
        });
      })
      .catch(err => {
        reject(`Couldn't fetch pull request ${prNum} from GitHub: ${err}`);
      });
    });
  }
};