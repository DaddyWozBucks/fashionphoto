const functions = require('firebase-functions');
const request = require('request');
const cors = require('cors')({origin: true});
const Flickr = require('flickr-sdk');
var moment = require('moment');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.searchTags = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
  var fAgent = new Flickr('0dcdaf57835fe56c55753e242a947db9');

  fAgent.photos.search(request.body.search).then(function (res) {
      console.log('yay!', res.body);
        res.body.photos.photo[0]
		    response.status(200).send(res.body);
    }).catch(function (err) {
      response.status(500).send('error');
    });
  })
});

exports.getSizes = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
  var fAgent = new Flickr('0dcdaf57835fe56c55753e242a947db9');
  console.log(request)
  fAgent.photos.getSizes({photo_id:request.body.photo_id}).then(function (res) {
      console.log('yay!', res.body);
		    response.status(200).send(res.body);
    }).catch(function (err) {
      response.status(500).send('error');
    });
  })
});
