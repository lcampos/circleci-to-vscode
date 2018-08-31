const https = require('https');
const admZip = require('adm-zip');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

// config.
const data = require('./config.json');
const PUBLISHER = data.vscode_publisher;

// helper functions
const ensureDirectoryExists = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
};

const installExtension = (originExtractPath, extensionName) => {
  const vscodeExtDirRoot = `${os.homedir()}/.vscode/extensions`;
  const extensionInstallDir = `${vscodeExtDirRoot}/${PUBLISHER}.${extensionName}`;

  // create new dir for extension to be installed
  ensureDirectoryExists(extensionInstallDir);

  // move extension from cli to vscode dirs
  const originExtension = `${originExtractPath}/extension`;

  // Move extension contents.
  fse.move(originExtension, extensionInstallDir, {overwrite:true})
  .then(() => {
    // Move extension manifest.
    const originExtensionManifest = `${originExtractPath}/extension.vsixmanifest`;

    fse.move(originExtensionManifest, extensionInstallDir + '/.vsixmanifest', {overwrite:true})
    .then(() => {
      console.log(chalk.bold.cyan(`Successfully installed extension ${extensionName}`));
      console.log();
    })
    .catch(err => {
      console.error(chalk.red(`Error installing ${extensionName} : ${err}`));
    })
  })
  .catch(err => {
    console.error(chalk.red(err));
  });
};

module.exports = {
  https_get: (opts) => {
    return new Promise((resolve, reject) => {
      // Set up the request.
      let respData = '';
      const req = https.request(opts, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          respData += chunk;
        });

        // get data from response.
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(respData));
          } else {
            // console.log('seems it was not 200, response = ', respData);
            reject('request status = ' + res.statusCode);
          }
        }); // end
      });

      req.on('error', function(e) {
        reject('problems with request');
      });

      // write data to request body
      req.write('data\n');
      req.write('data\n');
      req.end();
    }); //end Promise
  },

  download: (fileName, optsDownload) => {
    return new Promise((resolve, reject) => {
      const tmpFilePath = path.resolve(__dirname, `tmp/${fileName}.zip`);
      ensureDirectoryExists(tmpFilePath);
      let file = fs.createWriteStream(tmpFilePath);

      let req = https.get(optsDownload, (res) => {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve([tmpFilePath, fileName]);
        });
      });

      req.on('error', function(e) {
        reject('problems downloading a vsix');
      });
      req.end();
    }); //end Promise
  },

  extract: (filePath, fileName) => {
    const zip = new admZip(filePath);
    const extractedFilePath = path.resolve(__dirname, `tmp/extracted/${fileName}`);
    ensureDirectoryExists(extractedFilePath);
    try {
      zip.extractAllTo(extractedFilePath);
    } catch (e) {
      console.error(chalk.red(`Exception while installing ${fileName} : ${e}`));
    }
    installExtension(extractedFilePath, fileName);
  }
};
