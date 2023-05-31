const mongoose = require("mongoose");

const { Schema } = mongoose;

const aniosSchema = new Schema({
    nombre: { type: String },
    uuid:{type:String},
    estado:{type:Boolean, default: true},
    fecha_creacion: { type: Date },
    fecha_modificacion: { type: Date}
});

module.exports.aniosModel = mongoose.model("anios", aniosSchema, "anios");
