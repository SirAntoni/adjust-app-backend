const mongoose = require("mongoose");

const { Schema } = mongoose;

const categoriasSchema = new Schema({
    uuid:{type:String},
    nombre: { type: String },
    cover: {type:String, default:'categoria.jpg'},
    estado:{type:Boolean, default: true},
    fecha_creacion: { type: Date },
    fecha_modificacion: { type: Date}
});

module.exports.categoriasModel = mongoose.model("categorias", categoriasSchema, "categorias");
