const Joi = require("joi");

const asignar_perfil_contactoSchema = Joi.object().keys({
    nombres: Joi.string().required().alphanum(),
    apellidos: Joi.string().required().alphanum(),
    correo_electronico: Joi.string().required().email(),
    telefono: Joi.string().required().max(20).pattern(/^[0-9]+$/),
    pais_codigo: Joi.string().required().alphanum().lowercase(),
})
const asignar_estado_dominioSchema = Joi.object().keys({
    dominio: Joi.string().required(),
    situacion: Joi.string().required(),
})
const asignar_plan_dominioSchema = Joi.object().keys({
    dominio: Joi.string().required(),
    plan: Joi.string().required(),
})
const asignar_perfil_facturacionSchema = Joi.object().keys({
    nombres: Joi.string().required().alphanum(),
    apellidos: Joi.string().required().alphanum(),
    correo_electronico: Joi.string().required().email(),
    telefono: Joi.string().required().max(20).pattern(/^[0-9]+$/)
})
const asignar_perfil_tiendaSchema = Joi.object().keys({
    nombre_comercial: Joi.string().required().alphanum(),
    correo_ordenes: Joi.string().required().email(),
    correo_ordenes_titulo: Joi.string().required().alphanum(),
    tipo: Joi.string().required().valid('intranet', 'ecommerce', 'Intranet', 'Ecommerce'),
})

const asignar_facturacion_datosSchema = Joi.object().keys({
    documento_tipo: Joi.string().required().valid('boleta', 'factura'),
    datos: Joi.object().keys({
        nombre: Joi.string().required(),
        documento_numero: Joi.string().required().min(8).max(11).alphanum(),
        direccion: Joi.string().required(),
        pais_codigo: Joi.string().required().alphanum().lowercase(),
        departamento_codigo: Joi.string().required().alphanum().lowercase(),
        provincia_codigo: Joi.string().required().alphanum().lowercase(),
        distrito_codigo: Joi.string().required().alphanum().lowercase()
    }).required()
})
const asignar_idiomas_formatos_datosSchema = Joi.object().keys({
    pais_codigo: Joi.string().required().lowercase(),
    idioma_codigo: Joi.string().required().lowercase(),
    moneda_codigo: Joi.string().required().lowercase(),
    unidad_peso_codigo: Joi.string().required().lowercase(),
    unidad_medida_codigo: Joi.string().lowercase(),
})
const asignar_billetera_movil_schema = Joi.object().keys({
    nombre: Joi.string().required().lowercase(),
    monto_cobrar: Joi.number().required().min(0),
    monto_alerta: Joi.number().required().min(0),
    monto_porcentaje_venta: Joi.number().required().min(0),
    frecuencia: Joi.string().required().lowercase().valid("dias", "semanas", "meses", "anos"),
    frecuencia_numero: Joi.number().min(0),
    //pasarela: Joi.string().lowercase()
})
module.exports = {

    validar_asignar_perfil_contacto(valores) {  
        let result = [];
        const validations = asignar_perfil_contactoSchema.validate(valores, { abortEarly: false });        
        if(validations.error && validations.error.details)
            result = validations.error.details.map(x => x.message);        
        return result;
    },
    validar_asignar_estado_dominio(valores) {  
        let result = [];
        const validations = asignar_estado_dominioSchema.validate(valores, { abortEarly: false });        
        if(validations.error && validations.error.details)
            result = validations.error.details.map(x => x.message);        
        return result;
    },
    validar_asignar_plan_dominio(valores) {  
        let result = [];
        const validations = asignar_plan_dominioSchema.validate(valores, { abortEarly: false });        
        if(validations.error && validations.error.details)
            result = validations.error.details.map(x => x.message);        
        return result;
    },
    validar_asignar_perfil_facturacion(valores) {  
        let result = [];
        const validations = asignar_perfil_facturacionSchema.validate(valores, { abortEarly: false });        
        if(validations.error && validations.error.details)
            result = validations.error.details.map(x => x.message);        
        return result;
    },
    validar_asignar_perfil_tienda(valores) {  
        let result = [];
        const validations = asignar_perfil_tiendaSchema.validate(valores, { abortEarly: false });        
        if(validations.error && validations.error.details)
            result = validations.error.details.map(x => x.message);        
        return result;
    },
    validar_asignar_facturacion_datos(valores) {  
        let result = [];
        const validations = asignar_facturacion_datosSchema.validate(valores, { abortEarly: false });        
        if(validations.error && validations.error.details)
            result = validations.error.details.map(x => x.message);        
        return result;
    },
    validar_asignar_idiomas_formatos_datos(valores) {  
        let result = [];
        const validations = asignar_idiomas_formatos_datosSchema.validate(valores, { abortEarly: false });        
        if(validations.error && validations.error.details)
            result = validations.error.details.map(x => x.message);        
        return result;
    },
    validar_asignar_billetera_movil(valores) {  
        let result = [];
        const validations = asignar_billetera_movil_schema.validate(valores, { abortEarly: false });        
        if(validations.error && validations.error.details)
            result = validations.error.details.map(x => x.message);        
        return result;
    }
}