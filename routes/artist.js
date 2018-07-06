'use strict'

var express = require ('express');
var artistController = require ('../controllers/artists');
var api = express.Router();

var md_auth = require ('../middlewares/authenticate');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/artists'});

api.get('/artist/:id', md_auth.ensureAuth, artistController.getArtist);
api.post('/artist', md_auth.ensureAuth, artistController.saveArtist);
api.get('/artists/:page?', md_auth.ensureAuth, artistController.getArtists);
api.put('/artist/:id', md_auth.ensureAuth, artistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, artistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], artistController.uploadImage);
api.get('/get-image-artist/:imageFile', artistController.getImageFile);

module.exports = api;