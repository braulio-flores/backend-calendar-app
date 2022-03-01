let { Schema, model} = require('mongoose');

let schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true
    },
});

module.exports = model('users', schema) 
// users SERA EL NOMBRE DE LA COLECCION EN MONGO
// SI NO EXISTE LA CREA