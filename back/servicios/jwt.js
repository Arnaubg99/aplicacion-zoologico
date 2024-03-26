'use strict'

require('dotenv').config();
const jwt = require('jwt-simple');
const moment = require('moment');


exports.crearToken = function(usuario){
    let payload = {
        sub: usuario._id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
        avatar: usuario.avatar,
        fecha_iniciacion: moment().unix(),
        fecha_expiracion: moment().add(30, 'days').unix,
    }

    return jwt.encode(payload, process.env.CLAVE_CODIFICACION_TOKEN)
}