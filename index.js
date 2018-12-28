#!/usr/bin/env node
const program = require('commander');
const { setup } = require('./cli-setup');

program.version('0.1.1');
program
  .command('setup [env]')
  .description('Create the configuration needed to run this cli')
  .option('-t, --token', 'CircleCI personal API token you created')
  .option(
    '-v, --vcs_type',
    'The version control system (VCS) you are using. Either github or bitbucket.'
  )
  .option(
    '-u, --username',
    'The VCS project account username or organization name for the target project. Located at the top left of the screen in the CircleCI application.'
  )
  .option('-p, --project', 'The name of the target VCS repository.')
  .option('-m, --publisher', 'VSCode marketplace publisher name.')
  .action((env, options) => {
    setup(options);
  });

program.parse(process.argv);

/*
const last_builds_opts = {
  host: 'circleci.com',
  path: encodeURI(`/api/v1.1/project/${vcs_type}/${username}/${project}?circle-token=${CIRCLE_TOKEN}&limit=10&offset=0&filter=completed`),
  method: 'GET',
  headers: {
    Accept: 'application/json'
  }
};

if (typeof buildValue === 'undefined' || buildValue === '5') {
   console.error(chalk.red('You need to provide a circleci build run number.'));

   console.log('last_builds_opts: ', last_builds_opts);
   // get last success builds
   https_get(last_builds_opts).then((jsonData) => {
     if (jsonData.length > 0) {
       console.log('----- Last 10 successful circleci builds ------');
       // iterate and print successful build nums
       for (i in jsonData) {
         const buildNum = jsonData[i].build_num;
         console.log('----- Build #: ' + buildNum);
         console.log('----- Branch: ' + jsonData[i].branch);
         console.log('----- Subject: ' + jsonData[i].subject);
         console.log();
       }
     }
     process.exit(1);
   }).catch((err) => {
     console.error(chalk.red(err));
     process.exit(1);
   });
}

// https://circleci.com/docs/2.0/artifacts/#downloading-all-artifacts-for-a-build-on-circleci
const opts = {
  host: 'circleci.com',
  path: `/api/v1.1/project/${vcs_type}/${username}/${project}/${buildValue}/artifacts?circle-token=${CIRCLE_TOKEN}`,
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

      console.log(chalk.bold.yellow('Processing vsix : ') + vsixName);
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
  }).catch((err) => {
    console.error(chalk.red(err));
    process.exit(1);
  });

} catch (err) {
  console.error(chalk.red(err));
} */
