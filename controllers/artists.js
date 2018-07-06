'use strict'

var path = require('path');
var fs = require ('fs');
var mongoosePaginate = require ('mongoose-pagination');

var Artist = require ('../models/artist');
var Album = require ('../models/album');
var Song = require ('../models/song');

function getArtist (req,res){

	var artistId = req.params.id;
	Artist.findById (artistId, (err, artist) => {
		if (err){
			res.status(500).send({message: 'Error en busqueda de artista'})
		}else{
			if (!artist){
				res.status(404).send({message: 'Artista no encontrado'})
			}else{
				res.status(200).send(artist)
			}
		}
	})
	
}

function getArtists (req, res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}
	var itemsPerPage = 3;
	Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
		if (err){
			res.status(500).send({message: 'Error en la peticion'})
		}else{
			if(!artists){
				res.status(404).send({message: 'No hay artistas'})
			}else{
				return res.status(200).send({
					total_items: total,
					artists: artists
				})
			}
		}
	})
}

function saveArtist (req, res){
	var artist = new Artist();
	var params = req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = params.image;

	artist.save((err, artistStored) => {

		if (err){
			res.status(500).send({ message: 'Error al guardar artista'});
		}else{
			if (!artistStored){
				res.status(404).send({ message: 'El artista ha sido guardado' });
			}else{
				res.status(200).send({ artist: artistStored});
			}
		}

	});
}

function updateArtist (req, res){


	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
		if (err){
			res.status(500).send({message: 'Error al actualizar'})
		}else{
			if(!artistUpdated){
				res.status(404).send({message: 'No se puede actualizar el artista'})
			}else{
				res.status(200).send({artist: artistUpdated})
			}
		}
	})
}


function deleteArtist (req, res){

	var artistId = req.params.id;
	
	console.log("Paso por aqui");
	Artist.findByIdAndRemove(req.params.id, (err, artistRemoved) => {
		if (err){
			console.log('Paso 500');
			res.status(500).send({message:'Error al intentar borrar artista'})
		}else{
			if(!artistRemoved){
				console.log('Paso 404 1');
				res.status(404).send({message:'Artista no se puede borrar'})
			}else{
				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
					if (err){
						res.status(500).send({message:'Error al borrar album'})
					}else{
						if(!albumRemoved){
							res.status(404).send({message: 'No se puede borrar el álbum'})
						}else{
							Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
								if(err){
									res.status(500).send({message: 'Error al borrar cancion'})
								}else{
									if(!songRemoved){
										res.status(404).send({message: 'No se puede borrar la cancion'})
									}else{
										res.status(200).send({artist: artistRemoved})
									}
								}
							})
						}
					}
				})
			
			}
		}
	})
}

function uploadImage(req, res){
	var artistId = req.params.id;
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

			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err,artistUpdated) => {
				if (err){
					res.status(500).send({message: 'Error al actualizar'});
				}else{
					if (!userUpdated){
						res.status(404).send({message: 'No se ha podido actualizar el usuario'});
					}else{
						res.status(200).send({artist: artistUpdated});
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

	fs.exists('./uploads/artists/'+imageFile, function(exists){
		if (exists){
			res.sendFile(path.resolve('./uploads/artists/'+imageFile));
		}else{
			res.status(200).send({message: 'No existe la imagen'});
		}
	})
}

module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
}