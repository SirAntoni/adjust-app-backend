const mongoose = require("mongoose");

const { Schema } = mongoose;

const candidateClientsSchema = new Schema({
    codigo_cliente: { type: String },
    codigo_validacion: { type: String },
    dominio: { type: String },
    correo: { type: String },
    estado: { type: String },
    usuario_creacion: { type: Schema.Types.ObjectId },
    usuario_modificacion: { type: Schema.Types.ObjectId },
    fecha_creacion: { type: String },
    fecha_modificacion: { type: String }
});

module.exports.candidateClientsModel = mongoose.model("clientes_candidatos", candidateClientsSchema, "clientes_candidatos");
