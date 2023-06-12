const Joi = require('joi')

const crear_modeloSchema = Joi.object().keys({
  nombre: Joi.string().required(),
  marca: Joi.string().required()
})

const obtener_modeloSchema = Joi.object().keys({
  marca: Joi.string().required()
})

const actualizar_modeloSchema = Joi.object().keys({
  nombre: Joi.string().required(),
  marca: Joi.string().required()
})

module.exports = {
  validar_crear_modelo(valores) {
    let result = []
    const validations = crear_modeloSchema.validate(valores, { abortEarly: false })
    if (validations.error && validations.error.details) result = validations.error.details.map((x) => x.message)
    return result
  },
  validar_obtener_modelo(valores) {
    let result = []
    const validations = obtener_modeloSchema.validate(valores, { abortEarly: false })
    if (validations.error && validations.error.details) result = validations.error.details.map((x) => x.message)
    return result
  },
  validar_actualizar_modelo(valores) {
    let result = []
    const validations = actualizar_modeloSchema.validate(valores, { abortEarly: false })
    if (validations.error && validations.error.details) result = validations.error.details.map((x) => x.message)
    return result
  }
}
