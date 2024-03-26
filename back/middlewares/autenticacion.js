'use strict'

require('dotenv').config();
const jwt = require('jwt-simple')
const moment = require('moment');

exports.autenticacion = (peticion, respuesta, next) => {
    if(!peticion.headers.authorization){
        return respuesta.status(403).send({
            message: 'Error de autenticación.'
        })
    }
    let token = peticion.headers.authorization.replace(/['"]+/g, '');
    let payload;
    try {
        payload = jwt.decode(token, process.env.CLAVE_CODIFICACION_TOKEN);
        if(payload.ext <= moment().unix()){
            return respuesta.status(498).send({
                message: 'El token ha expirado.'
            })
        }
    } catch (error) {
        return respuesta.status(498).send({
            message: 'El token no es válido.'
        })
    }
    peticion.usuario = payload;
    next();
}
