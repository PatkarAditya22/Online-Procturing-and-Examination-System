const dotenv = require("dotenv")
dotenv.config();
const AWS = require('aws-sdk');
const awsParams = require('./awsParams');
var info = {};
AWS.config.mediaconvert = { endpoint: 'https://xnbzilj6c.mediaconvert.ap-south-1.amazonaws.com' };
AWS.config.update({ region: 'ap-south-1' });

const startUpload = (data) => {
    var multiPartParams = {
        Bucket: `proctoringexams`,
        Key: `${data.testId}_${data.userId}.webm`,
        ContentType: 'video/webm',
    };
    s3.createMultipartUpload(multiPartParams, function (mpErr, multipart) {
        if (mpErr) {
            console.log('Error!', mpErr);
            return;
        }
        console.log('Got upload ID', multipart.UploadId);
        info[data.socketId] = {
            mp: multipart,
            multipartMap: {
                Parts: [],
            },
            partNumber: 1,
            data: [],
        };
    });
};

var s3 = new AWS.S3();
var mediaConvertService = new AWS.MediaConvert({ apiVersion: '2017-08-29' });
var transcribeService = new AWS.TranscribeService();

const stream = (socket) => {
    socket.on('subscribe', (data) => {
        try {
            socket.join(data.room);
            socket.join(data.socketId);
            if (socket.adapter.rooms[data.room].length > 1) {
                socket.to(data.room).emit('new user', { socketId: data.socketId });
            }
            console.log('subscribe');
        } catch (err) {
            console.log(err);
        }
    });
    socket.on('host-leave', (data) => {
        try {
            socket.to(data.room).emit('host-leave');
            console.log('hostleave');
        } catch (err) {
            console.log(err);
        }
    });
    socket.on('subscribe-upload', (data) => {
        try {
            startUpload(data);
        } catch (err) {
            console.log(err);
        }
    });
    socket.on('data_available', (data) => {
        try {
            info[data.socketId].data = [...info[data.socketId].data, ...data.chunk];
            if (info[data.socketId].data.length / (1024 * 1024 * 5) >= 1) {
                partParams = {
                    Body: Buffer.from(info[data.socketId].data),
                    Bucket: `proctoringexams`,
                    Key: `${data.testId}_${data.userId}.webm`,
                    PartNumber: String(info[data.socketId].partNumber),
                    UploadId: info[data.socketId].mp.UploadId,
                };
                info[data.socketId].partNumber++;
                var tryNum = tryNum || 1;
                s3.uploadPart(partParams, function (multiErr, mData) {
                    if (multiErr) {
                        console.log('multiErr, upload part error:', multiErr);
                        if (tryNum < maxUploadTries) {
                            console.log('Retrying upload of part: #', partParams.PartNumber);
                            uploadPart(s3, multipart, partParams, tryNum + 1);
                        } else {
                            console.log('Failed uploading part: #', partParams.PartNumber);
                        }
                        return;
                    }
                    info[data.socketId].multipartMap.Parts[this.request.params.PartNumber - 1] = {
                        ETag: mData.ETag,
                        PartNumber: Number(this.request.params.PartNumber),
                    };
                    console.log('Completed part', this.request.params.PartNumber);
                    console.log('mData', mData);
                });
                info[data.socketId].data = [];
            }
        } catch (err) {
            startUpload(data);
            console.log(err, info, data.socketId);
        }
    });

    socket.on('leave-upload', (data) => {
        try {
            partParams = {
                Body: Buffer.from(info[data.socketId].data),
                Bucket: `proctoringexams`,
                Key: `${data.testId}_${data.userId}.webm`,
                PartNumber: String(info[data.socketId].partNumber),
                UploadId: info[data.socketId].mp.UploadId,
            };
            info[data.socketId].partNumber++;
            var tryNum = tryNum || 1;
            s3.uploadPart(partParams, function (multiErr, mData) {
                if (multiErr) {
                    console.log('multiErr, upload part error:', multiErr);
                    if (tryNum < maxUploadTries) {
                        console.log('Retrying upload of part: #', partParams.PartNumber);
                        uploadPart(s3, multipart, partParams, tryNum + 1);
                    } else {
                        console.log('Failed uploading part: #', partParams.PartNumber);
                    }
                    return;
                }
                info[data.socketId].multipartMap.Parts[this.request.params.PartNumber - 1] = {
                    ETag: mData.ETag,
                    PartNumber: Number(this.request.params.PartNumber),
                };
                console.log('Completed part', this.request.params.PartNumber);
                console.log('mData', mData);
                var doneParams = {
                    Bucket: `proctoringexams`,
                    Key: `${data.testId}_${data.userId}.webm`,
                    MultipartUpload: info[data.socketId].multipartMap,
                    UploadId: info[data.socketId].mp.UploadId,
                };
                console.log('left');
                console.log(info[data.socketId].mp.UploadId);
                s3.completeMultipartUpload(doneParams, function (err, d) {
                    console.log('complete');
                    if (err) {
                        console.log('An error occurred while completing the multipart upload');
                        console.log(err);
                    } else {
                        console.log('Final upload data:', d);
                        var endpointPromise = mediaConvertService.createJob(awsParams.mediaConvertParams(data)).promise();
                        endpointPromise.then(
                            function (data) {
                                console.log('Job created! ', data);
                            },
                            function (err) {
                                console.log('Error', err);
                            }
                        );
                    }
                });
            });
            info[data.socketId].data = [];
        } catch (err) {
            console.log(err);
        }
    });
};

module.exports = stream;
