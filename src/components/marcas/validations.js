const Joi = require('joi')

const crear_marcaSchema = Joi.object().keys({
  nombre: Joi.string().required()
})

const obtener_marcaSchema = Joi.object().keys({
  uuid: Joi.string().required()
})

const actualizar_marcaSchema = Joi.object().keys({
  nombre: Joi.string().required()
})

module.exports = {
  validar_crear_marca(valores) {
    let result = []
    const validations = crear_marcaSchema.validate(valores, { abortEarly: false })
    if (validations.error && validations.error.details) result = validations.error.details.map((x) => x.message)
    return result
  },
  validar_obtener_marca(valores) {
    let result = []
    const validations = obtener_marcaSchema.validate(valores, { abortEarly: false })
    if (validations.error && validations.error.details) result = validations.error.details.map((x) => x.message)
    return result
  },
  validar_actualizar_marca(valores) {
    let result = []
    const validations = actualizar_marcaSchema.validate(valores, { abortEarly: false })
    if (validations.error && validations.error.details) result = validations.error.details.map((x) => x.message)
    return result
  }
}
