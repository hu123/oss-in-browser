'use strict';

var appServer = 'http://localhost:3000';
var bucket = 'huluobuckettest';
var region = 'oss-cn-hangzhou';

var urllib = OSS.urllib;
var Buffer = OSS.Buffer;
var OSS = OSS.Wrapper;
var STS = OSS.STS;

// Play without STS. NOT SAFE! Because access key id/secret are
// exposed in web page.

// var client = new OSS({
//   region: 'oss-cn-hangzhou',
//   accessKeyId: '<access-key-id>',
//   accessKeySecret: '<access-key-secret>',
//   bucket: '<bucket-name>'
// });
//
// var applyTokenDo = function (func) {
//   return func(client);
// };

var applyTokenDo = function (func) {
  var url = appServer;
  return urllib.request(url, {
    method: 'GET'
  }).then(function (result) {
      console.log(result);
      console.log(result.headers);
      console.log(result.res);
      console.log(JSON.parse(result.data));


    var creds = JSON.parse(result.data);
    var client = new OSS({
      region: region,
      accessKeyId: creds.AccessKeyId,
      accessKeySecret: creds.AccessKeySecret,
      stsToken: creds.SecurityToken,
      bucket: bucket
    });

    return func(client);
  });
};

var downloadFile = function (client) {
  var object = document.getElementById('dl-object-key').value.trim();
  var filename = document.getElementById('dl-file-name').value.trim();
  console.log(object + ' => ' + filename);

  var result = client.signatureUrl(object, {
    response: {
      'content-disposition': 'attachment; filename="' + filename + '"'
    }
  });
  window.location = result;

  return result;
};

window.onload = function () {
  document.getElementById('dl_btn').onclick = function () {
    applyTokenDo(downloadFile);
  }

};
