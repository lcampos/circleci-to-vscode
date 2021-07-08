const { extract, download, httpsGet } = require('./utils/reqmod');
const {
  buildHTTPOpts,
  getVsixName
} = require('./utils/circleci');
const { info, error } = require('./utils/log');
const { configExists, readConfigFile } = require('./utils/configFile');
const { parsePullRequestNumber, fetchBuildNumFromPR } = require('./utils/github');

const installVsix = (isInsiders, target) => {
  if (!configExists()) {
    error('The cli is not properly configured. Try running $ctv setup --help');
    process.exit(1);
  }
  const cliConfig = readConfigFile();
  const prNum = parsePullRequestNumber(target, cliConfig);
  if (prNum) {
    fetchBuildNumFromPR(prNum, cliConfig)
      .then(buildNum => getArtifactsAndInstall(buildNum, cliConfig, isInsiders))
      .catch((err) => error(err));
  } else {
    getArtifactsAndInstall(target, cliConfig, isInsiders);
  }
};

const getArtifactsAndInstall = (buildNum, cliConfig, isInsiders) => {
  const opts = buildHTTPOpts(buildNum, cliConfig);

  httpsGet(opts).then(jsonData => {
    if (jsonData.length > 0) {
      info(`VSIXs to be downloaded : ${jsonData.length}`);
    }

    for (let i = 0; i < jsonData.length; i++) {
      try {
        const vsixName = getVsixName(jsonData[i]);
        const downloadURL = jsonData[i].url;
        const dwn = download(vsixName, downloadURL);
        extract(dwn[0], dwn[1], isInsiders);
      } catch (e) {
        error(e.message);
      }

    }
  });
};

module.exports = { installVsix };
