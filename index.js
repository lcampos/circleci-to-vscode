const { https_get, download } = require('./reqmod');
const program = require('commander');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');

const CIRCLE_TOKEN = '';
const vcs_type = '';
const username = '';
const project = '';
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
      let vsixUrls = [];
      // get the artifact urls from circlci.
      https_get(opts).then((jsonData) => {
        // console.log(jsonData);
        if (jsonData.length > 0) {
          console.log(chalk.bold.cyan('VSIXs to be downloaded : ') + jsonData.length);
        }

        for (i in jsonData) {
          console.log(jsonData[i].path.replace('home/circleci/project/extensions/', ''));
          vsixUrls.push(jsonData[i].url);
        }
        console.log('');
        const optsDownload = {
          host: '1593-95021029-gh.circle-artifacts.com',
          path: `/0/home/circleci/project/extensions/salesforcedx-vscode-43.11.0.vsix?circle-token=${CIRCLE_TOKEN}`,
          method: 'GET'
        }
        download('salesforcedx-vscode-43.11.0', optsDownload);
        // exit the program.
        // process.exit(0);
      }).catch((err) => {
        console.error(chalk.red(err));
        process.exit(1);
      })
    } catch (err) {
      console.error(chalk.red(err));
    }
  });
})
.parse(process.argv);
