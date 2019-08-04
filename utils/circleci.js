const url = require('url');

const buildHTTPOpts = (buildNum, config) => {
  // https://circleci.com/docs/2.0/artifacts/#downloading-all-artifacts-for-a-build-on-circleci
  return {
    host: 'circleci.com',
    path: `/api/v1.1/project/${config.vcs_type}/${config.username}/${
      config.project
    }/${buildNum}/artifacts?circle-token=${config.CIRCLE_TOKEN}`,
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  };
};

const getVsixName = data => {
  return data.path
    .replace('home/circleci/project/extensions/', '')
    .replace('.vsix', '');
};

const buildVsixUrl = data => {
  const artifactUrl = new url.parse(data.url);
  return {
    host: artifactUrl.host,
    path: artifactUrl.pathname,
    method: 'GET'
  };
};

module.exports = {
  buildHTTPOpts,
  buildVsixUrl,
  getVsixName
};
