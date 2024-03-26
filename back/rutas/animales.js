'use strict'

const express = require('express');
const AnimalesController = require('../controladores/animales');
const middleware_autenticacion = require('../middlewares/autenticacion');
const middleware_admin = require('../middlewares/es-admin');
const multiparty = require('connect-multiparty');
const multiSubirArchivos = multiparty({ uploadDir: './subidas/animales' })
const rutasApi = express.Router();



rutasApi.post('/animal', [middleware_autenticacion.autenticacion, middleware_admin.esAdmin], AnimalesController.guardarAnimal);
rutasApi.get('/animales', AnimalesController.obtenerAnimales);
rutasApi.get('/animal/:id', AnimalesController.obtenerAnimal);
rutasApi.put('/animal/:id', [middleware_autenticacion.autenticacion, middleware_admin.esAdmin], AnimalesController.actualizarAnimal);
rutasApi.post('/subir-imagen-animal/:id',[middleware_autenticacion.autenticacion, multiSubirArchivos, middleware_admin.esAdmin], AnimalesController.subirImagen);
rutasApi.get('/obtener-imagen-animal/:nombre_archivo', AnimalesController.obtenerImagen);
rutasApi.delete('/animal/:id', [middleware_autenticacion.autenticacion, middleware_admin.esAdmin], AnimalesController.eliminarAnimal);

module.exports = rutasApi;