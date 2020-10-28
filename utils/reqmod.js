const https = require('https');
const admZip = require('adm-zip');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const os = require('os');
const { error } = require('./log');
const { readConfigFile } = require('./configFile');
const { vsixStats } = require('./vsixStats');
const shell = require('shelljs');

// helper functions
const ensureDirectoryExists = filePath => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
};

const getVsixName = fileName => {
  return fileName.replace('extensions/', '');
};

const installExtension = (originExtractPath, extensionName, isInsiders) => {
  const vscodeExtDirRoot = isInsiders
    ? path.join(os.homedir(), '.vscode-insiders', 'extensions')
    : path.join(os.homedir(), '.vscode', 'extensions');
  const publisher = readConfigFile().vscode_publisher;
  const vsixName = getVsixName(extensionName);
  const extensionInstallDir = path.join(
    vscodeExtDirRoot,
    `${publisher}.${vsixName}`
  );

  // create new dir for extension to be installed
  ensureDirectoryExists(extensionInstallDir);

  // move extension from cli to vscode dirs
  const originExtension = path.join(originExtractPath, 'extension');

  // Move extension contents.
  fse
    .move(originExtension, extensionInstallDir, { overwrite: true })
    .then(() => {
      // Move extension manifest.
      const originExtensionManifest = path.join(
        originExtractPath,
        'extension.vsixmanifest'
      );

      fse
        .move(
          originExtensionManifest,
          path.join(extensionInstallDir, '.vsixmanifest'),
          {
            overwrite: true
          }
        )
        .then(() => {
          vsixStats.printStats(extensionName);
        })
        .catch(err => {
          error(`Error installing ${extensionName} : ${err}`);
        });
    })
    .catch(err => {
      error(err.message);
    });
};

const getFilesizeInMegabytes = filePath => {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes / 1000000.0;
};

module.exports = {
  httpsGet: opts => {
    return new Promise((resolve, reject) => {
      // Set up the request.
      let respData = '';
      const req = https.request(opts, res => {
        res.setEncoding('utf8');
        res.on('data', chunk => {
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

      req.on('error', e => {
        error(`Error on https request : ${e.message}`);
        reject('problems with request');
      });

      // write data to request body
      req.write('data\n');
      req.write('data\n');
      req.end();
    }); //end Promise
  },

  download: (fileName, artifactURL) => {
    const startTime = process.hrtime();
    const tmpFilePath = path.resolve(__dirname, `../tmp/${fileName}.zip`);
    ensureDirectoryExists(tmpFilePath);
    // Download vsix files, fail if it takes more than 30 seconds to connect or if the download exceeds 2 mins
    const curlResult = shell.exec(
      `curl -L --fail ${artifactURL} --output "${tmpFilePath}" --connect-timeout 30 --max-time 180`
    );
    if (curlResult.code !== 0) {
      const errorMsgIndex = curlResult.stderr.indexOf('curl:');
      if (errorMsgIndex > 0) {
        throw new Error(curlResult.stderr.substring(errorMsgIndex));
      }

      throw new Error(curlResult.stderr);
    }

    const hrend = process.hrtime(startTime);
    vsixStats.add(fileName, { downloadTime: hrend });
    return [tmpFilePath, fileName];
  },

  extract: (filePath, fileName, isInsiders) => {
    const extSize = getFilesizeInMegabytes(filePath);
    vsixStats.add(fileName, { vsixSize: extSize });
    const zip = new admZip(filePath);
    const extractedFilePath = path.resolve(
      __dirname,
      `tmp/extracted/${fileName}`
    );
    ensureDirectoryExists(extractedFilePath);
    try {
      zip.extractAllTo(extractedFilePath);
    } catch (e) {
      error(`Exception while installing ${fileName} : ${e}`);
    }
    installExtension(extractedFilePath, fileName, isInsiders);
  }
};
