const Joi = require('joi')

const crear_tipoSchema = Joi.object().keys({
  nombre: Joi.string().required()
})

const obtener_tipoSchema = Joi.object().keys({
  uuid: Joi.string().required()
})

const actualizar_tipoSchema = Joi.object().keys({
  nombre: Joi.string().required()
})

module.exports = {
  validar_crear_tipo(valores) {
    let result = []
    const validations = crear_tipoSchema.validate(valores, { abortEarly: false })
    if (validations.error && validations.error.details) result = validations.error.details.map((x) => x.message)
    return result
  },
  validar_obtener_tipo(valores) {
    let result = []
    const validations = obtener_tipoSchema.validate(valores, { abortEarly: false })
    if (validations.error && validations.error.details) result = validations.error.details.map((x) => x.message)
    return result
  },
  validar_actualizar_tipo(valores) {
    let result = []
    const validations = actualizar_tipoSchema.validate(valores, { abortEarly: false })
    if (validations.error && validations.error.details) result = validations.error.details.map((x) => x.message)
    return result
  }
}
