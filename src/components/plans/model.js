const mongoose = require("mongoose");

const { Schema } = mongoose;

const planesSchema = new Schema({
    nombre: { type: String },

    tipo: { type: String },

    monto: { type: Number },
    comision: { type: Number },
    estado: { type: String },

    usuario_creacion: { type: Schema.Types.ObjectId },
    usuario_modificacion: { type: Schema.Types.ObjectId },

    fecha_creacion: { type: String },
    fecha_modificacion: { type: String }
});

module.exports.planesModel = mongoose.model("planes", planesSchema, "planes");
