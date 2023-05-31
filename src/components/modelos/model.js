const mongoose = require("mongoose");

const { Schema } = mongoose;

const modelosSchema = new Schema({
    nombre: { type: String },
    uuid:{type:String},
    marca:{type:String},
    estado:{type:Boolean, default: true},
    fecha_creacion: { type: Date },
    fecha_modificacion: { type: Date}
});

module.exports.modelosModel = mongoose.model("modelos", modelosSchema, "modelos");
