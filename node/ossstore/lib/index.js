"use strict";
var AWS = require("aws-sdk");
require("events").EventEmitter.prototype._maxListeners = 1000;
// var TIMEOUT = 30000; //30秒
var TIMEOUT = parseInt(localStorage.getItem("connectTimeout") || 60000); //30秒
console.log("TIMEOUT: " + TIMEOUT);

var UploadJob = require("./upload-job");
var DownloadJob = require("./download-job");

/**
 * OssStore
 *
 * @constructor OssStore
 *
 * @param config
 *    config.aliyunCredential
 *    config.stsToken
 *    config.endpoint
 */

function OssStore(config) {
  if (!config) {
    console.log("需要 config");
    return;
  }
  this._config = {};
  Object.assign(this._config, config);

  if (!this._config.aliyunCredential && !this._config.stsToken) {
    console.log("需要 stsToken");
    return;
  }

  if (!this._config.endpoint) {
    console.log("需要 endpoint");
    return;
  }

  if (this._config.stsToken) {
    AWS.config.update({
      accessKeyId: this._config.stsToken.Credentials.AccessKeyId,
      secretAccessKey: this._config.stsToken.Credentials.AccessKeySecret,
      sessionToken: this._config.stsToken.Credentials.SecurityToken,
    });
    this.oss = new AWS.S3({
      endpoint: this._config.endpoint,
      s3ForcePathStyle: !this._config.endpoint.includes('.amazonaws.com'), // Use path style for custom endpoints, virtual style for AWS
      signatureVersion: 'v4',
      httpOptions: {
        timeout: TIMEOUT,
      }
    });
    // Create a compatibility wrapper for download jobs that expect ali-oss methods
    var s3Client = this.oss; // Store reference to avoid closure issues
    this.aliOSS = {
      useBucket: function(bucket) {
        // No-op for AWS S3
      },
      getStream: function(key, options) {
        var params = {
          Bucket: key.split('/')[0], // Extract bucket from key if formatted as "bucket/key"
          Key: key.substring(key.indexOf('/') + 1), // Extract key from full path
        };
        // Add range if provided
        if (options && options.headers && options.headers.Range) {
          params.Range = options.headers.Range;
        }
        var request = s3Client.getObject(params);
        var stream = request.createReadStream();
        return new Promise(function(resolve, reject) {
          // Resolve with an object containing stream as expected by download job
          resolve({ stream: stream });
          // Handle potential errors
          stream.on('error', function(err) {
            reject(err);
          });
        });
      }
    };
  } else {
    AWS.config.update({
      accessKeyId: this._config.aliyunCredential.accessKeyId,
      secretAccessKey: this._config.aliyunCredential.secretAccessKey,
      // No sessionToken for regular access keys
    });
    this.oss = new AWS.S3({
      endpoint: this._config.endpoint,
      s3ForcePathStyle: !this._config.endpoint.includes('.amazonaws.com'), // Use path style for custom endpoints, virtual style for AWS
      signatureVersion: 'v4',
      httpOptions: {
        timeout: TIMEOUT,
      }
    });
    // Create a compatibility wrapper for download jobs that expect ali-oss methods
    var s3Client2 = this.oss; // Store reference to avoid closure issues
    this.aliOSS = {
      useBucket: function(bucket) {
        // No-op for AWS S3
      },
      getStream: function(key, options) {
        var params = {
          Bucket: key.split('/')[0], // Extract bucket from key if formatted as "bucket/key"
          Key: key.substring(key.indexOf('/') + 1), // Extract key from full path
        };
        // Add range if provided
        if (options && options.headers && options.headers.Range) {
          params.Range = options.headers.Range;
        }
        var request = s3Client2.getObject(params);
        var stream = request.createReadStream();
        return new Promise(function(resolve, reject) {
          // Resolve with an object containing stream as expected by download job
          resolve({ stream: stream });
          // Handle potential errors
          stream.on('error', function(err) {
            reject(err);
          });
        });
      }
    };
  }

  var arr = this._config.endpoint.split("://");
  if (arr.length < 2) {
    console.log("endpoint 格式错误");
    return;
  }
  this._config.endpoint = {
    protocol: arr[0],
    host: arr[1],
  };
}

OssStore.prototype.setStsToken = function (stsToken) {
  this._config.stsToken = stsToken;

  AWS.config.update({
    accessKeyId: this._config.stsToken.Credentials.AccessKeyId,
    secretAccessKey: this._config.stsToken.Credentials.AccessKeySecret,
    sessionToken: this._config.stsToken.Credentials.SecurityToken,
  });
  this.oss = new AWS.S3({
    endpoint: this._config.endpoint,
    s3ForcePathStyle: !this._config.endpoint.includes('.amazonaws.com'), // Use path style for custom endpoints, virtual style for AWS
    signatureVersion: 'v4',
    httpOptions: {
      timeout: TIMEOUT,
    }
  });
};

/**
 *
 * Usage:
 *
 *  new OssStore(cfg)
 *     .createUploadJob({from:'/home/a.jpg', to:'oss://a/b.jpg'})
 *
 * UploadJob class:

 class UploadJob{
    status: ''
    from: { name, size, path }
    to: { bucket, key }
    prog: {loaded, total}

 }

 *
 * @param options
 *    options.from  {object|string} local path, as object: {name:'a.jpg', path:'/home/admin/a.jpg'},  as string: '/home/admin/a.jpg'
 *    options.to    {object|string} oss path, as object: {bucket:'bucket',key:'pic/b.jpg'} as string: 'oss://bucket/pic/b.jpg'
 *
 *    options.checkPoints {object} saveCpt
 *    options.enableCrc64 {boolean}
 */
OssStore.prototype.createUploadJob = function createUploadJob(options) {
  var self = this;

  var job = new UploadJob(self.oss, options);

  //默认是 waiting 状态
  return job;
};

/**
 *
 * Usage:
 *
 *  new OssStore(cfg)
 *     .createDownloadJob({from:'/home/a.jpg', to:'oss://a/b.jpg'})
 *
 * DownloadJob class:

 class DownloadJob{
    status: ''
    from: { name, size, path }
    to: { bucket, key }
    prog: {loaded, total}

 }

 *
 * @param options
 *    options.from    {string} path string, under oss prefix, example: '/pic/b.jpg', it will be append to presetting osspath
 *                       as: 'oss://bucket/users/test_user/pic/b.jpg'
 *    options.to  {string} local path string,  example: '/home/admin/a.jpg'
 *
 *    options.checkpoint {object} saveCpt
 *    options.enableCrc64 {boolean}
 */
OssStore.prototype.createDownloadJob = function createDownloadJob(options) {
  var self = this;

  var job = new DownloadJob(self.oss, options, self.aliOSS);

  //默认是 waiting 状态

  return job;
};

module.exports = OssStore;
