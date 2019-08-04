const chalk = require('chalk');
const util = require('util');

class VsixStats {
  constructor() {
    if (!VsixStats.instance) {
      // eslint-disable-next-line no-undef
      this.dataMap = new Map();
      VsixStats.instance = this;
    }

    return VsixStats.instance;
  }

  add(id, item) {
    if (this.dataMap.has(id)) {
      const existingValue = this.dataMap.get(id);
      this.dataMap.set(id, Object.assign(existingValue, item));
      return;
    }
    this.dataMap.set(id, item);
  }

  get(id) {
    return this.dataMap.get(id);
  }
  /* eslint-disable no-console */
  printStats(id) {
    const stats = this.get(id);
    console.log(chalk.bold.cyan(`Successfully installed extension ${id}`));
    console.log(
      `${chalk.bold.cyan('Vsix size :')} ${chalk.bold.yellow(
        `${stats.vsixSize} MB`
      )}`
    );

    const download = stats.downloadTime;
    console.log(
      `${chalk.bold.cyan('Download time :')} ${chalk.bold.yellow(
        `${util.format('%d%d', download[0], download[1] / 1000000)} ms`
      )}\n`
    );
  }
}

const vsixStats = new VsixStats();
module.exports = { vsixStats };
