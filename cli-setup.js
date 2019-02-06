const { info, error } = require('./utils/log');
const fs = require('fs');

const setup = options => {
  console.log(options.token);
  try {
    if (!options.token) {
      throw new Error('--token is required');
    }

    const vcsType = options.vcs_type || 'github';
    if (!options.vcs_type) {
      info('Defaulting version control system setting to github');
    }

    if (!options.username) {
      throw new Error('--username is required');
    }

    if (!options.project) {
      throw new Error('--project is required');
    }

    if (!options.publisher) {
      throw new Error('--publisher is required');
    }

    const inputConfig = {
      CIRCLE_TOKEN: options.token,
      vcs_type: vcsType,
      username: options.username,
      project: options.project,
      vscode_publisher: options.publisher
    };

    fs.writeFileSync('./config.json', JSON.stringify(inputConfig, null, 2));
  } catch (e) {
    error(`Error while creating the cli configuration : ${e.message}`);
    process.exit(1);
  }
  info('The cli was successfully configured.');
};

module.exports = { setup };
