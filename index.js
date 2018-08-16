const { https_get, download, extract } = require('./reqmod');
const program = require('commander');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const url = require('url');

// config.
const data = require('./config.json');
const CIRCLE_TOKEN = data.CIRCLE_TOKEN;
const vcs_type = data.vcs_type;
const username = data.username;
const project = data.project;
// const build_num = '';

program
.arguments('<build>')
// .option('-u, --username <username>', 'The user to authenticate as')
// .option('-p, --password <password>', 'The user\'s password')
.action(function(build) {
  co(function *() {
    // let some = yield prompt('some: ');
    // console.log('user: %s build: %s', some, build);

    // https://circleci.com/docs/2.0/artifacts/#downloading-all-artifacts-for-a-build-on-circleci
    const opts = {
      host: 'circleci.com',
      path: `/api/v1.1/project/${vcs_type}/${username}/${project}/${build}/artifacts?circle-token=${CIRCLE_TOKEN}`,
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    };

    try {
      // get the artifact urls from circlci.
      https_get(opts).then((jsonData) => {
        if (jsonData.length > 0) {
          console.log(chalk.bold.cyan('VSIXs to be downloaded : ') + jsonData.length);
        }

        for (i in jsonData) {
          const vsixName = jsonData[i].path.replace('home/circleci/project/extensions/', '').replace('.vsix', '');

          console.log('Processing vsix : ' + vsixName);
          const artifactUrl = new url.parse(jsonData[i].url);

          const optsDownload = {
            host: artifactUrl.host,
            path: artifactUrl.pathname,
            method: 'GET'
          }

          download(vsixName, optsDownload).then((resultArray) => {
            extract(resultArray[0], resultArray[1]);
          }).catch((err) => {
            console.error(chalk.red(err));
          });
        }

        // exit the program.
        // process.exit(0);
      }).catch((err) => {
        console.error(chalk.red(err));
        process.exit(1);
      });

    } catch (err) {
      console.error(chalk.red(err));
    }
  });
})
.parse(process.argv);
