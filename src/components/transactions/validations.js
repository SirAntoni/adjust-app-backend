const Joi = require("joi").extend(require('@joi/date'));

const agregar_Schema = Joi.object().keys({
    dominio: Joi.string().required(),
    tipo_movimiento: Joi.string().required().valid("egreso", "ingreso"),
    observacion: Joi.string().required(),
    motivo: Joi.string().required(),
    monto: Joi.number().required().min(0)
})
const listar_fechas_Schema = Joi.object().keys({
    fecha_inicio: Joi.date().format("DD/MM/YYYY").required(),
    fecha_fin: Joi.date().format("DD/MM/YYYY").required()
})
module.exports = {
    validar_listar_fechas(valores) {  
        let result = [];
        const validations = listar_fechas_Schema.validate(valores, { abortEarly: false });        
        if(validations.error && validations.error.details)
            result = validations.error.details.map(x => x.message);        
        return result;
    },
    validar_agregar(valores) {  
        let result = [];
        const validations = agregar_Schema.validate(valores, { abortEarly: false });        
        if(validations.error && validations.error.details)
            result = validations.error.details.map(x => x.message);        
        return result;
    }
}