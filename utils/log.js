/* eslint-disable no-console */
const chalk = require('chalk');

const info = data => {
  console.log(chalk.bold.cyan(data));
};

const error = data => {
  console.error(chalk.red(data));
};

module.exports = {
  info,
  error
};
