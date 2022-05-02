const mongoose = require("mongoose");

const { Schema } = mongoose;

const dominiosSchema = new Schema({
    nombre: { type: String },

    nombre_comercial: { type: String },

    correo_ordenes: { type: String },
    correo_ordenes_titulo: { type: String },
    tipo: { type: String },

    tipo_pago: { type: String },

    plan: { type: String },

    situacion: { type: String },

    contacto_perfil: {
        nombres: { type: String },
        apellidos: { type: String },

        correo_electronico: { type: String },
        telefono: { type: String },

        pais: { type: String },
        pais_codigo: { type: String },
    },

    facturacion: {
        documento_tipo: { type: String },
        datos: { type: Object },

        contacto: {
            nombres: { type: String },
            apellidos: { type: String },
    
            correo_electronico: { type: String },
            telefono: { type: String }
        },
    },

    pais: { type: String },
    pais_codigo: { type: String },

    idioma: { type: String },
    idioma_codigo: { type: String },

    moneda: { type: String },
    moneda_codigo: { type: String },

    unidad_peso: { type: String },
    unidad_peso_codigo: { type: String },

    unidad_medida: { type: String },
    unidad_medida_codigo: { type: String },

    billetera_movil: {
        monto_cobro: { type: Number },
        monto_alerta: { type: Number },

        monto_total: { type: Number },
        monto_pagado: { type: Number },

        monto_porcentaje_venta: { type: Number },

        frecuencia: { type: String },
        frecuencia_numero: { type: Number },

        fecha_cobro_inicial: { type: Number },
        proximo_cobro: { type: Number },
        //usuario_asignado: { type: Schema.Types.ObjectId },

        //estado: { type: String }
    },

    usuario_creacion: { type: Schema.Types.ObjectId },
    usuario_modificacion: { type: Schema.Types.ObjectId },

    fecha_creacion: { type: String },
    fecha_modificacion: { type: String }
});

module.exports.dominiosModel = mongoose.model("dominios", dominiosSchema, "dominios");
