const mongoose = require("mongoose");

const { Schema } = mongoose;

const marcasSchema = new Schema({
    nombre: { type: String },
    uuid:{type:String},
    estado:{type:Boolean, default: true},
    fecha_creacion: { type: Date },
    fecha_modificacion: { type: Date}
});

module.exports.marcasModel = mongoose.model("marcas", marcasSchema, "marcas");
