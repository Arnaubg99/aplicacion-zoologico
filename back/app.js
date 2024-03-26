'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// app.use(cors());

//CARGAR RUTAS 
const rutas_usuarios = require('./rutas/usuarios');
const rutas_animales = require('./rutas/animales');

//MIDDLEWARES DE BODY_PARSER
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//CONFIGURAR CABECERAS Y CORS
app.use((peticion, respuesta, next) => {
    respuesta.header('Access-Control-Allow-Origin', '*');
    respuesta.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    respuesta.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    respuesta.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
})

//RUTAS BASE
app.use('/api', rutas_usuarios);
app.use('/api', rutas_animales);

module.exports = app;