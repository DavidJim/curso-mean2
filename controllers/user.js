'user strict'

console.log('starting');
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res){
	res.status(200).send({
		message: 'Probando acción de controlador de usuarios del api rest con Node y Mongo'
	});
}

function saveUser(req,res){
	var user = new User();

	var params = req.body;

	console.log(params);

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

	if(params.password){
		//Encriptar y guardar
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;
			if(user.name != null && user.surname != null && user.email != null){
				//Guardar usuario
				user.save((err, userStored) => {
					if(err){
						res.status(500).send({message: 'Error al guardar el usuario'});
					}else{
						if(!userStored){
							res.status(404).send({message: 'No se ha guardado el usuario'});
						}else{
							res.status(200).send({user: userStored});
						}
					}
				})

			}else{
				res.status(200).send({message: 'Rellena todos los campos'});

			}
		})
	}else{
		res.status(200).send({message: 'Introduce la contraseña'});
	}

}

console.log('por subido');

function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if (err){
			res.status(500).send({message: 'Error al actualizar'});
		}else{
			if (!userUpdated){
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({user: userUpdated});
			}
		}
	});
}

function loginUser(req, res){

	var params=req.body;
	var email= params.email;
	var password=params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) => {
		if(err){
			res.status(500).send({message: 'Error en la conexion'});
		}else{
			if(!user){
				res.status(404).send({message: 'El usuario no existe'})
			}else{
			bcrypt.compare(password, user.password, function(err, check){
				if (check){
					//devolver datos de usuario logueado
					if (params.gethash){
						//devolver un token de JWT
						res.status(200).send({
							token: jwt.createToken(user)
						})
					}else{
						res.status(200).send({user});
					}
				}else{
					res.status(404).send({message: 'Contraseña incorrecta'});
					}	
				});
			} 

		}


	});

}


function uploadImage(req, res){
	var userId = req.params.id;
	var file_name = 'No subido...';

	if (req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];
		console.log(file_name);

		var ext_split = file_name.split('\.');
		var ext_name = ext_split[1];
		console.log(ext_name);

		if (ext_name == 'jpeg'|| ext_name == 'jpg' || ext_name == 'png' || ext_name == 'gif'){

			User.findByIdAndUpdate(userId, {image: file_name}, (err,userUpdated) => {
				if (err){
					res.status(500).send({message: 'Error al actualizar'});
				}else{
					if (!userUpdated){
						res.status(404).send({message: 'No se ha podido actualizar el usuario'});
					}else{
						res.status(200).send({user: userUpdated});
					}
				}	

			});

		}else{

			res.status(200).send({message: 'La imagen debe ser jpg, png o gif'});

		}
		
	}else{
		res.status(200).send({message: 'No ha subido ninguna imagen'});
	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;

	fs.exists('./uploads/users/'+imageFile, function(exists){
		if (exists){
			res.sendFile(path.resolve('./uploads/users/'+imageFile));
		}else{
			res.status(200).send({message: 'No existe la imagen'});
		}
	})
}


module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};