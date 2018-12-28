const { httpsGet, download } = require('./utils/reqmod');
const {
  buildHTTPOpts,
  buildVsixUrl,
  getVsixName
} = require('./utils/circleci');
const { info, error } = require('./utils/log');
const { configExists, readConfigFile } = require('./utils/configFile');

const installVsix = (isInsiders, buildNum) => {
  if (!configExists()) {
    error('The cli is not properly configured. Try running $ctv setup --help');
    process.exit(1);
  }

  info('lets start loading our config');
  const cliConfig = readConfigFile();
  const opts = buildHTTPOpts(buildNum, cliConfig);

  // get the artifact urls from circlci.
  httpsGet(opts).then(jsonData => {
    if (jsonData.length > 0) {
      info(`VSIXs to be downloaded : ${jsonData.length}`);
    }

    for (const i in jsonData) {
      console.log('vsix data : ', jsonData[i]);
      const vsixName = getVsixName(jsonData[i]);
      const optsDownload = buildVsixUrl(jsonData[i]);

      download(vsixName, optsDownload)
        .then(resultArray => {
          // extract(resultArray[0], resultArray[1]);
          console.log(resultArray[0]);
          console.log(resultArray[1]);
        })
        .catch(err => {
          error(err.message);
        });
    }
  });
};

module.exports = { installVsix };
