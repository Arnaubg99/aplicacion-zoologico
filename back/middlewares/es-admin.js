'use strict'

exports.esAdmin = (peticion, respuesta, next) => {
    if(peticion.usuario.rol !== 'ROL_ADMIN'){
        return respuesta.status(403).send({
            message: 'No tienes acceso a esta ruta.'
        })
    }
    next();
}