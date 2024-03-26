'use strict'

//MODULOS
const bycript = require('bcrypt-nodejs');
const fs = require('fs');
const path = require('path');

//MODELOS
const Usuario = require('../modelos/usuarios');
const { param } = require('../rutas/usuarios');


//SERVICIOS
const jwt = require('../servicios/jwt')

//ACCIONES
function guardarUsuario(peticion, respuesta){
    //CREAR NUEVO USUARIO
    let nuevo_usuario = new Usuario();

    //RECOJER PARAMETROS
    let parametros = peticion.body;

    Usuario.findOne({
        email: parametros.email
    }).then(usuario => {
        if(usuario){
            respuesta.status(422).send({
                message: 'Ya hay un usuario registrado con ese email.'
            })
        }else{
            if(parametros.nombre && parametros.apellidos && parametros.email && parametros.password){
                nuevo_usuario.nombre = parametros.nombre;
                nuevo_usuario.apellidos = parametros.apellidos;
                nuevo_usuario.email = parametros.email;
                nuevo_usuario.avatar = parametros.avatar;
                nuevo_usuario.rol = 'ROL_USUARIO';
                
                bycript.hash(parametros.password, null, null, (error, hash) => {
                    //CIFRAR PASSWORD
                    nuevo_usuario.password = hash;

                    nuevo_usuario.save().then(usuario_guardado => {
                        if(!usuario_guardado){
                            respuesta.status(404).send({
                                message: 'No se ha registrado el usuario.'
                            })
                        }else{
                            respuesta.status(200).send(usuario_guardado)
                        }
                    }).catch(error => {
                        console.error(error)
                        respuesta.status(500).send({
                            message: 'No se ha podido completar la solicitud.'
                        })
                    })

                });
            }else{
                respuesta.status(404).send({
                    message: 'Introduce los datos correctamente.'
                })
            }

        }
    }).catch(error => {
        console.error(error)
        respuesta.status(500).send({
            message: 'No se ha podido completar la solicitud.'
        })
    })
}

function login(peticion, respuesta){
    //RECOJER PARAMETROS
    let parametros = peticion.body;

    Usuario.findOne({
        email: parametros.email
    }).then(usuario => {
        if(usuario){
            bycript.compare(parametros.password, usuario.password, (error, check) => {
                if(check){
                    //COMPROBAR Y GENERAR EL TOKEN
                    if(parametros.gettoken){
                        respuesta.status(200).send({
                            token: jwt.crearToken(usuario)
                        })
                    }else{
                        respuesta.status(200).send(usuario)
                    }
                }else{
                    respuesta.status(404).send({
                        message: 'Usuario o contraseña incorrectos.'
                    })
                }
            })
        }else{
            respuesta.status(404).send({
                message: 'No existe ningún usuario con este email.'
            })
        }
    }).catch(error => {
        console.error(error)
        respuesta.status(500).send({
            message: 'No se ha podido completar la solicitud.'
        })
    })
}

function actualizarUsuario(peticion, respuesta){
    //RECOJER LA ID DEL USUARIO A ACTUALIZAR
    let usuario_id = peticion.params.id;
    //RECOJER PARAMETROS
    let parametros = peticion.body;
    delete peticion.password;

    if(usuario_id !== peticion.usuario.sub){
        return respuesta.status(500).send({
            message: 'No tienes permiso para actualizar este usuario.'
        })
    }
    cambiarPropiedadesDeUnUsuario(respuesta, usuario_id, parametros);
 }

function subirAvatar(peticion, respuesta){
    let usuario_id = peticion.params.id;

    if(peticion.files){
        let ruta_archivo = peticion.files.image.path;
        let archivo_split = ruta_archivo.split('\\');
        let nombre_archivo = archivo_split[2];
        let extension_split = nombre_archivo.split('\.');
        let extension_archivo =  extension_split[1];
        if(extension_archivo === 'png' || extension_archivo === 'jpg' || extension_archivo === 'jpeg' || extension_archivo === 'gif'){
            if(usuario_id != peticion.usuario.sub){
                return respuesta.status(500).send({
                    message: 'No tienes permiso para actualizar este usuario.'
                })
            }
            // if(peticion.usuario.avatar){
            //     fs.unlink(`subidas/usuarios/${peticion.usuario.avatar}`, error =>{
            //         if(error){
            //             console.error(error)
            //         }
            //     })
            // }
            cambiarPropiedadesDeUnUsuario(respuesta, usuario_id, { avatar: nombre_archivo });

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

function obtenerAvatar(peticion, respuesta){
    let nombre_archivo = peticion.params.nombre_archivo;
    let ruta_archivo = `./subidas/usuarios/${nombre_archivo}`;

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

function getCuidadores(peticion, respuesta){
    Usuario.find({
        rol: 'ROL_ADMIN'
    }).then(cuidadores => {
        if(cuidadores.length === 0){
            respuesta.status(404).send({
                message: 'No hay cuidadores.'
            })
        }else{
            respuesta.status(200).send(cuidadores)
        }
    }).catch(error => {
        console.error(error)
        respuesta.status(500).send({
            message: 'No se ha podido completar la solicitud.'
        })
    })
}


function cambiarPropiedadesDeUnUsuario(respuesta, usuario_id, datos){
    Usuario.findByIdAndUpdate(usuario_id, datos, { new: true }).then(usuario_actualizado => {
        if(!usuario_actualizado){
            respuesta.status(404).send({
                message: 'No se ha podido actualizar el usuario.'
            })
        }else{
            respuesta.status(200).send(usuario_actualizado)
        }
    }).catch(error => {
        console.error(error)
        respuesta.status(500).send({
            message: 'No se ha podido completar la solicitud.'
        })
    })
}


module.exports = {
    guardarUsuario,
    login,
    actualizarUsuario,
    subirAvatar,
    obtenerAvatar,
    getCuidadores
}