const https = require('https');
const admZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

// helper functions
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

const getReleaseVersion = () => {
  return ((navData.getDefaultAPIVersion() + 64) * 2).toFixed(1);
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

  download: (filename, optsDownload) => {
    console.log('--------- download ---------- ');
    console.log('filename', filename);
    console.log('optsDownload', optsDownload);
    const tmpFilePath = path.resolve(__dirname, `tmp/${filename}.zip`);
    console.log('tmpFilePath', tmpFilePath);

    https.get(optsDownload, (res) => {
      console.log('STATUS: ' + res.statusCode);
      ensureDirectoryExistence(tmpFilePath);
      var file = fs.createWriteStream(tmpFilePath);
      res.on('data', (chunk) => {
        // fs.appendFileSync(tmpFilePath, data)
        /// console.log('being downloaded ...');
        file.write(chunk);
      });
      res.on('end', () => {
         // const zip = new admZip(tmpFilePath)
         // zip.extractAllTo('/Users/lcamposguajardo/vsixes/extracted/' + filename);
         // fs.unlink(tmpFilePath)
         file.end();
         console.log(filename + ' downloaded to ' + tmpFilePath);
      })
    });

  }
};
