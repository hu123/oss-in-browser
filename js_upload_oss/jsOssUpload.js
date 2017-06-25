'use strict';

var appServer = 'http://localhost:3000';
var bucket = 'huluobuckettest';
var region = 'oss-cn-hangzhou';

var urllib = OSS.urllib;
var Buffer = OSS.Buffer;
var OSS = OSS.Wrapper;
var STS = OSS.STS;


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


var uploadFile = function (client) {
    var file = document.getElementById('file').files[0];
    var key = document.getElementById('object-key-file').value.trim() || 'object';
    console.log(file.name + ' => ' + key);

    return client.multipartUpload(key, file).then(function (res) {
        console.log('upload success: %j', res);
        return null;
    });
};
window.onload = function () {
    document.getElementById('file-button').onclick = function () {
        applyTokenDo(uploadFile);
    }

};
