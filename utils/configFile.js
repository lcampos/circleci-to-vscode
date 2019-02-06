const fs = require('fs');
const path = require('path');
const CONFIG_PATH = '../config.json';

const configExists = () => {
  const configFilePath = path.resolve(__dirname, CONFIG_PATH);
  return fs.existsSync(configFilePath);
};

const readConfigFile = () => {
  const configFilePath = path.resolve(__dirname, CONFIG_PATH);
  const testResultOutput = fs.readFileSync(configFilePath, 'utf8');
  const jsonSummary = JSON.parse(testResultOutput);
  return jsonSummary;
};

module.exports = {
  configExists,
  readConfigFile
};
