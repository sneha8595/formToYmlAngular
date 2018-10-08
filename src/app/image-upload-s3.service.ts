import { Injectable } from '@angular/core';
import * as AWS from "aws-sdk";
import * as config from "../assets/config";

const albumBucketName = config.awsCredentials.albumBucketName;
const bucketRegion = config.awsCredentials.bucketRegion;
const IdentityPoolId = config.awsCredentials.IdentityPoolId;

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: albumBucketName }
});

@Injectable({
  providedIn: 'root'
})

export class ImageUploadS3Service {
  createAndAddPhoto(userData, cb) {
    //wrapper around create album and add photo
    const files = userData['picture'];
    const albumName = userData['name'];
    this.createAlbum(albumName, result => {
      if (!result) {
        cb();
        return;
      }
      else {
        this.addPhoto(albumName, files, cb);
      }
    });
  }

  createAlbum(albumName, callback) {
    albumName = albumName.trim();
    if (!albumName) {
      callback();
      return;
      //return console.log('Album names must contain at least one non-space character.');
    }
    if (albumName.indexOf('/') !== -1) {
      callback();
      return;
      //return console.log('Album names cannot contain slashes.');
    }
    const albumKey = encodeURIComponent(albumName) + '/';
    s3.headObject({
      Bucket: albumBucketName,
      Key: albumKey
    }, function (err, data) {
      if (!err) {
        callback(true);
        return;
        //return console.log('Album already exists.');
      }
      if (err.code !== 'NotFound') {
        callback();
        return;
        //return console.log('There was an error creating your album: ' + err.message);
      }
      s3.putObject({
        Bucket: albumBucketName,
        Key: albumKey
      }, function (err, data) {
        if (err) {
          callback();
          return;
          //return console.log('There was an error creating your album: ' + err.message);
        }
        callback(true);
        //console.log('Successfully created album.');
        //this.viewAlbum(albumName);
      });
    });
  }

  viewAlbum(albumName) {
    const albumPhotosKey = encodeURIComponent(albumName) + '/';
    s3.listObjects({
      Bucket: albumBucketName,
      Prefix: albumPhotosKey
    }, function (err, data) {
      if (err) {
        return console.log('There was an error viewing your album: ' + err.message);
      }
      // `this` references the AWS.Response instance that represents the response
      const href = this.request.httpRequest.endpoint.href;
      const bucketUrl = href + albumBucketName + '/';

      return data.Contents.map(function (photo) {
        const photoKey = photo.Key;
        return bucketUrl + encodeURIComponent(photoKey);
      });
    });
  }

  addPhoto(albumName, files, callback) {
    if (!files.length) {
      callback();
      return;
      //return console.log('Please choose a file to upload first.');
    }
    const file = files[0];
    const fileName = file.name;
    const albumPhotosKey = encodeURIComponent(albumName) + '//';

    const photoKey = albumPhotosKey + fileName;
    s3.upload({
      Bucket: albumBucketName,
      Key: photoKey,
      Body: file,
      ACL: 'public-read'
    }, function (err, data) {
      if (err) {
        callback();
        return;
        //return console.log('There was an error uploading your photo: ', err.message);
      }
      //console.log('Successfully uploaded photo.');
      callback(data);
      //this.viewAlbum(albumName);
    });
  }

  deletePhoto(albumName, photoKey) {
    s3.deleteObject({
      Bucket: albumBucketName,
      Key: photoKey
    }, function (err, data) {
      if (err) {
        return console.log('There was an error deleting your photo: ', err.message);
      }
      console.log('Successfully deleted photo.');
      //this.viewAlbum(albumName);
    });
  }
  deleteAlbum(albumName) {
    const albumKey = encodeURIComponent(albumName) + '/';
    s3.listObjects({
      Bucket: albumBucketName,
      Prefix: albumKey
    }, function (err, data) {
      if (err) {
        return console.log('There was an error deleting your album: ', err.message);
      }
      const objects = data.Contents.map(function (object) {
        return { Key: object.Key };
      });
      s3.deleteObjects({
        Bucket: albumBucketName,

        Delete: { Objects: objects, Quiet: true }
      }, function (err, data) {
        if (err) {
          return console.log('There was an error deleting your album: ', err.message);
        }
        console.log('Successfully deleted album.');
        //this.listAlbums();
      });
    });
  }

  constructor() { }
}
