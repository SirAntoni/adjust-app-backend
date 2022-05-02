const mongoose = require("mongoose");

const { Schema } = mongoose;

const esquema = new Schema({
    codigo: { type: String },

    fecha_transaccion: { type: String },
    tipo_movimiento: { type: String },

    motivo: { type: String },
    observacion: { type: String },

    dominio: { type: String },

    moneda: { type: String },
    moneda_nombre: { type: String },

    monto: { type: Number },
    monto_tipo_cambio: { type: Number },

    estado: { type: String },

    usuario_creacion: { type: Schema.Types.ObjectId },
    usuario_modificacion: { type: Schema.Types.ObjectId },

    fecha_creacion: { type: String },
    fecha_modificacion: { type: String }
});

module.exports.modelo = mongoose.model("billetera_movil", esquema, "billetera_movil");
