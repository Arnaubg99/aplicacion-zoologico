'use strict'

//MODULOS
const bycript = require('bcrypt-nodejs');
const fs = require('fs');
const path = require('path');

//MODELOS
const Animal = require('../modelos/animales');

//ACCIONES
function guardarAnimal(peticion, respuesta){
    let nuevo_animal = new Animal();
    let parametros = peticion.body;

    if(parametros.nombre){
        nuevo_animal.nombre = parametros.nombre;
        nuevo_animal.descripcion = parametros.descripcion;
        nuevo_animal.year = parametros.year;
        nuevo_animal.imagen = null;
        nuevo_animal.usuario = peticion.usuario.sub;

        nuevo_animal.save().then(animal_guardado => {
            if(animal_guardado){
                respuesta.status(200).send( animal_guardado )
            }else{
                respuesta.status(404).send({
                    message: 'No se ha podido guardar el animal.'
                })
            }
        }).catch(error => {
            console.error(error)
            respuesta.status(500).send({
                message: 'No se ha podido completar la solicitud.'
            })
        })
    }else{
        respuesta.status(404).send({
            message: 'El nombre del animal es obligatorio.'
        })
    }
}

function obtenerAnimales(peticion, respuesta){
    Animal.find({}).populate({path: 'usuario'}).exec().then( animales => {
        if(animales.length === 0){
            respuesta.status(404).send({
                message: 'No hay animales.'
            })
        }else{
            respuesta.status(200).send(animales)
        }
    }).catch(error => {
        console.error(error)
        respuesta.status(500).send({
            message: 'No se ha podido completar la solicitud.'
        })
    })
}

function obtenerAnimal(peticion, respuesta){
    let animal_id = peticion.params.id;

    Animal.findById(animal_id).populate({path: 'usuario'}).exec().then( animal => {
        if(animal){
            respuesta.status(200).send(animal)
        }else{
            respuesta.status(404).send({
                message: 'No se ha encontrado el animal.'
            })
        }
    }).catch(error => {
        console.error(error)
        respuesta.status(500).send({
            message: 'No se ha podido completar la solicitud.'
        })
    })
}

function actualizarAnimal(peticion, respuesta){
    let animal_id = peticion.params.id;
    let parametros = peticion.body;

    actualizarPropiedadesDeUnAnimal(respuesta, animal_id, parametros)
}

function subirImagen(peticion, respuesta){
    let animal_id = peticion.params.id;
    // let nombre_archivo = 'No subido....';

    if(peticion.files){
        let ruta_archivo = peticion.files.image.path;
        let archivo_split = ruta_archivo.split('\\');
        let nombre_archivo = archivo_split[2];
        let extension_split = nombre_archivo.split('\.');
        let extension_archivo =  extension_split[1];

        if(extension_archivo === 'png' || extension_archivo === 'jpg' || extension_archivo === 'jpeg' || extension_archivo === 'gif'){
            actualizarPropiedadesDeUnAnimal(respuesta, animal_id, {imagen: nombre_archivo})
        }else{
            fs.unlink(ruta_archivo, (error) =>{
                if(error){
                    respuesta.status(500).send({
                        message: 'Tipo de archivo no válido y archivo no eliminado.'
                    })
                }else{
                    respuesta.status(500).send({
                        message: 'Tipo de archivo no válido.'
                    })
                }
            });
           
        }
    }else{
        respuesta.status(404).send({
            message: 'No hay archivo.'
        })
    }
}

function obtenerImagen(peticion, respuesta){
    let nombre_archivo = peticion.params.nombre_archivo;
    let ruta_archivo = `./subidas/animales/${nombre_archivo}`;

    fs.exists(ruta_archivo, (exists) =>{
        if(exists){
            respuesta.sendFile(path.resolve(ruta_archivo));
        }else{
            respuesta.status(404).send({
                message: 'El archivo no existe.'
            })
        }
    })
}

function eliminarAnimal(peticion, respuesta){
    let animal_id = peticion.params.id;
    Animal.findByIdAndDelete(animal_id).then(animal_eliminado => {
        if(animal_eliminado){
            respuesta.status(200).send({
                message: 'Animal eliminado.'
            })
        }else{
            respuesta.status(404).send({
                message: 'No se ha podido eliminar al animal.'
            })
        }
    }).catch(error => {
        console.error(error)
        respuesta.status(500).send({
            message: 'No se ha podido completar la solicitud.'
        })
    })
}

function actualizarPropiedadesDeUnAnimal(respuesta, animal_id, datos){
    Animal.findByIdAndUpdate(animal_id, datos, { new: true }).then(animal_actualizado => {
        if(!animal_actualizado){
            respuesta.status(404).send({
                message: 'No se ha podido actualizar el animal.'
            })
        }else{
            respuesta.status(200).send(animal_actualizado)
        }
    }).catch(error => {
        console.error(error)
        respuesta.status(500).send({
            message: 'No se ha podido completar la solicitud.'
        })
    })
}


module.exports = {
    guardarAnimal,
    obtenerAnimales,
    obtenerAnimal,
    actualizarAnimal,
    subirImagen,
    obtenerImagen,
    eliminarAnimal
}