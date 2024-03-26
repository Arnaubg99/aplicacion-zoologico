'use strict'

require('dotenv').config();
const mongooseDB = require('mongoose');
const app = require('./app');
const puerto = process.env.PORT;

mongooseDB.connect(process.env.MONGO_DB_CONEXION_ZOO).then(() => {

    console.log("Conexión a  la base de datos 'zoo' correcta.")
    app.listen(puerto, () =>{
        console.log(`Servidor corriendo en el puerto ${puerto}`)
    })
    
}).catch(error => {
    console.log(error)
})