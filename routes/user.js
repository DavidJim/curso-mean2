'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var md_auth = require ('../middlewares/authenticate');

var api = express.Router();

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);

//exportar archivo
module.exports = api;