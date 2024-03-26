'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
    nombre: String,
    apellidos: String,
    email: String,
    password: String,
    rol: String,
    avatar: String
})

module.exports = mongoose.model('Usuario', UsuarioSchema)