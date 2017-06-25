'use strict';

var appServer = 'http://localhost:8080/getOssStsToken';
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

var listFiles = function (client) {
    var table = document.getElementById('list-files-table');
    console.log('list files');

    return client.list({
        'max-keys': 100
    }).then(function (result) {
        var objects = result.objects.sort(function (a, b) {
            var ta = new Date(a.lastModified);
            var tb = new Date(b.lastModified);
            if (ta > tb) return -1;
            if (ta < tb) return 1;
            return 0;
        });

        var numRows = table.rows.length;
        for (var i = 1; i < numRows; i ++) {
            table.deleteRow(table.rows.length - 1);
        }

        for (var i = 0; i < Math.min(3, objects.length); i ++) {
            var row = table.insertRow(table.rows.length);
            row.insertCell(0).innerHTML = objects[i].name;
            row.insertCell(1).innerHTML = objects[i].size;
            row.insertCell(2).innerHTML = objects[i].lastModified;
        }

    });
};

window.onload = function () {

    applyTokenDo(listFiles);
};
