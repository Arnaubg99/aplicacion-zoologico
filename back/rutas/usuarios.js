'use strict'

const express = require('express');
const UsuarioController = require('../controladores/usuarios');
const middleware_autenticacion = require('../middlewares/autenticacion');
const middleware_admin = require('../middlewares/es-admin');
const multiparty = require('connect-multiparty');
const multiSubirArchivos = multiparty({ uploadDir: './subidas/usuarios' })
const rutasApi = express.Router();



rutasApi.post('/registrar', UsuarioController.guardarUsuario);
rutasApi.post('/login', UsuarioController.login);
rutasApi.put('/actualizar-usuario/:id', middleware_autenticacion.autenticacion, UsuarioController.actualizarUsuario);
rutasApi.post('/subir-avatar-usuario/:id',[middleware_autenticacion.autenticacion, multiSubirArchivos], UsuarioController.subirAvatar);
rutasApi.get('/obtener-avatar-usuario/:nombre_archivo', UsuarioController.obtenerAvatar);
rutasApi.get('/cuidadores', UsuarioController.getCuidadores);

module.exports = rutasApi;