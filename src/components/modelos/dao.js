const { modelosModel } = require('./model')

module.exports = {
  async crear_modelo(data) {
    try {
      const modelo_modelo = new modelosModel(data)

      const resultado = modelo_modelo.save()

      return resultado
    } catch (err) {
      throw new Error(err)
    }
  },
  async obtener_modelos(datos_buscar) {
    try {
      
      const resultado = modelosModel.find(datos_buscar)

      return resultado
    } catch (err) {
      throw new Error(err)
    }
  },
  async obtener_modelo(datos_buscar, datos_obtener) {
    try {
      const resultado = modelosModel.find(datos_buscar, datos_obtener)

      return resultado
    } catch (err) {
      throw new Error(err)
    }
  },
  async actualizar_modelo(datos_buscar, datos_actualizar) {
    try {
      let resultado = await modelosModel.updateOne(datos_buscar, datos_actualizar)
      if (resultado.acknowledged == true && resultado.matchedCount > 0) {
        resultado = await modelosModel.findOne(datos_buscar)
        return resultado
      }
      return false
    } catch (err) {
      throw new Error(err)
    }
  }
}
