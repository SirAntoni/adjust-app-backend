const mongoose = require("mongoose");

const { Schema } = mongoose;

const tiposSchema = new Schema({
    nombre: { type: String },
    uuid:{type:String},
    estado:{type:Boolean, default: true},
    fecha_creacion: { type: Date },
    fecha_modificacion: { type: Date}
});

module.exports.tiposModel = mongoose.model("tipos", tiposSchema, "tipos");
