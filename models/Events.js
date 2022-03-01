let { Schema, model} = require('mongoose');

let schema = new Schema({
    title: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    notes: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    }
});

schema.method('toJSON', function(){
    const { __v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
    // AQUI SE HACEN LAS CORRECCIONES PARA QUE EN VEZ DE SER _id SEA id, SOLO ESO
})

module.exports = model('Event', schema) ;