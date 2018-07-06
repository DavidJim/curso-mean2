'use strict'

var express = require ('express');
var artistController = require ('../controllers/artists');
var api = express.Router();

var md_auth = require ('../middlewares/authenticate');



module.exports = api;