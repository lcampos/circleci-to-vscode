const https = require('https');
const admZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

// helper functions
const ensureDirectoryExists = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
};

module.exports = {
  https_get: (opts) => {
    return new Promise((resolve, reject) => {
      // Set up the request.
      let respData = '';
      const req = https.request(opts, (res) => {
        console.log('STATUS: ' + res.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          respData += chunk;
        });

        // get data from response.
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(respData));
          } else {
            reject('request status = ' + res.statusCode);
          }
        }); // end
      });

      req.on('error', function(e) {
        console.log('problems with request: ' + e.message);
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
        // console.log('STATUS: ' + res.statusCode);
        // console.log(res.headers);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(fileName + ' downloaded to ' + tmpFilePath);
          resolve([tmpFilePath, fileName]);
        });

        /*
        res.on('data', (chunk) => {
          file.write(chunk);
        });

        res.on('end', () => {
           file.end();
           console.log(fileName + ' downloaded to ' + tmpFilePath);
           // extract(tmpFilePath, fileName);
           resolve([tmpFilePath, fileName]);
        })*/
      });

      req.on('error', function(e) {
        console.log('problems downloading a vsix: ' + e.message);
        reject('problems downloading a vsix');
      });
      req.end();
    }); //end Promise
  },

  extract: (filePath, fileName) => {
    const zip = new admZip(filePath);
    const extractedFilePath = path.resolve(__dirname, `tmp/extracted/${fileName}`);
    ensureDirectoryExists(extractedFilePath);
    zip.extractAllTo(extractedFilePath);
  }
};
