#!/usr/bin/env node
const program = require('commander');
const { setup } = require('./cli-setup');
const { installVsix } = require('./cli-install-vsix');

program.version('0.2.0');
program
  .command('setup [env]')
  .description('Create the configuration needed to run this cli')
  .option('-t, --token <t>', 'CircleCI personal API token you created')
  .option(
    '-v, --vcs_type [v]',
    'The version control system (VCS) you are using. Either github or bitbucket.'
  )
  .option(
    '-u, --username <u>',
    'The VCS project account username or organization name for the target project. Located at the top left of the screen in the CircleCI application.'
  )
  .option('-p, --project <p>', 'The name of the target VCS repository.')
  .option('-m, --publisher <m>', 'VSCode marketplace publisher name.')
  .action((env, options) => {
    setup(options);
  });

program
  .command('install <build>')
  .description('Install vsix files from CircleCi build number')
  .option('-i, --insiders', 'Install the extension for VSCode Insiders')
  .action((build, options) => {
    const isInsiders = options.insiders ? true : false;
    installVsix(isInsiders, build);
  });

program.parse(process.argv);
