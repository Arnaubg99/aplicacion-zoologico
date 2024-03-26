'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnimalSchema = Schema({
    nombre: String,
    descripcion: String,
    year: Number,
    imagen: String,
    usuario: { 
        type: Schema.ObjectId, ref: 'Usuario'
    }
})

module.exports = mongoose.model('Animal', AnimalSchema)