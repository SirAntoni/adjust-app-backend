const { aniosModel } = require('./model')

module.exports = {
  async crear_anio(data) {
    try {
      const modelo_anio = new aniosModel(data)

      const resultado = modelo_anio.save()

      return resultado
    } catch (err) {
      throw new Error(err)
    }
  },
  async obtener_anios(datos_buscar) {
    try {
      const resultado = aniosModel.find(datos_buscar)

      return resultado
    } catch (err) {
      throw new Error(err)
    }
  },
  async obtener_anio(datos_buscar, datos_obtener) {
    try {
      const resultado = aniosModel.findOne(datos_buscar, datos_obtener)

      return resultado
    } catch (err) {
      throw new Error(err)
    }
  },
  async actualizar_anio(datos_buscar, datos_actualizar) {
    try {
      let resultado = await aniosModel.updateOne(datos_buscar, datos_actualizar)
      if (resultado.acknowledged == true && resultado.matchedCount > 0) {
        resultado = await aniosModel.findOne(datos_buscar)
        return resultado
      }
      return false
    } catch (err) {
      throw new Error(err)
    }
  }
}
