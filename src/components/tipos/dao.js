const { tiposModel } = require('./model')

module.exports = {
  async crear_tipo(data) {
    try {
      const tipo_tipo = new tiposModel(data)

      const resultado = tipo_tipo.save()

      return resultado
    } catch (err) {
      throw new Error(err)
    }
  },
  async obtener_tipos(datos_buscar, datos_obtener) {
    try {
      const resultado = tiposModel.find(datos_buscar, datos_obtener)

      return resultado
    } catch (err) {
      throw new Error(err)
    }
  },
  async obtener_tipo(datos_buscar, datos_obtener) {
    try {
      const resultado = tiposModel.findOne(datos_buscar, datos_obtener)

      return resultado
    } catch (err) {
      throw new Error(err)
    }
  },
  async actualizar_tipo(datos_buscar, datos_actualizar) {
    try {
      let resultado = await tiposModel.updateOne(datos_buscar, datos_actualizar)
      if (resultado.acknowledged == true && resultado.matchedCount > 0) {
        resultado = await tiposModel.findOne(datos_buscar)
        return resultado
      }
      return false
    } catch (err) {
      throw new Error(err)
    }
  }
}
