'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

exports.createToken = function(user){

	var payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		image: user.image,
		//fecha creacion del token
		iat: moment().unix(),
		//fecha de expiracion
		exp: moment().add(30, 'days').unix(),
	};

	//clave secreta para generar el hash y codificar el objeto usuario
	return jwt.encode(payload, secret);
}