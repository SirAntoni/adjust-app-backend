const Joi = require('joi')

const crear_anioSchema = Joi.object().keys({
  nombre: Joi.string().required()
})

const obtener_anioSchema = Joi.object().keys({
  uuid: Joi.string().required()
})

const actualizar_anioSchema = Joi.object().keys({
  nombre: Joi.string().required()
})

module.exports = {
  validar_crear_anio(valores) {
    let result = []
    const validations = crear_anioSchema.validate(valores, { abortEarly: false })
    if (validations.error && validations.error.details) result = validations.error.details.map((x) => x.message)
    return result
  },
  validar_obtener_anio(valores) {
    let result = []
    const validations = obtener_anioSchema.validate(valores, { abortEarly: false })
    if (validations.error && validations.error.details) result = validations.error.details.map((x) => x.message)
    return result
  },
  validar_actualizar_anio(valores) {
    let result = []
    const validations = actualizar_anioSchema.validate(valores, { abortEarly: false })
    if (validations.error && validations.error.details) result = validations.error.details.map((x) => x.message)
    return result
  }
}
