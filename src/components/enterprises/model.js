const mongoose = require("mongoose");

const { Schema } = mongoose;

const empresasSchema = new Schema({
    codigo_cliente: { type: String },
    nombre_comercial: { type: String },
    ruc_tienda: { type: String },
    correo: { type: String },
    representante: {
        dni: { type: String },
        nombre: { type: String },
        correo: { type: String },
        celular:{ type: String}
    },
    estado: { type: String },
    usuario_creacion: { type: Schema.Types.ObjectId },
    usuario_modificacion: { type: Schema.Types.ObjectId },
    fecha_creacion: { type: String },
    fecha_modificacion: { type: String }
});

module.exports.empresasModel = mongoose.model("empresas", empresasSchema, "empresas");
