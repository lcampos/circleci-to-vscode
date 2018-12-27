// log.js
const chalk = require('chalk');

const info = data => {
  console.log(chalk.bold.cyan(data));
  console.log();
};

const error = data => {
  console.error(chalk.red(data));
};

module.exports = {
  info,
  error
};
