const { marcasModel } = require('./model')

module.exports = {
  async crear_marca(data) {
    try {
      const modelo_marca = new marcasModel(data)

      const resultado = modelo_marca.save()

      return resultado
    } catch (err) {
      throw new Error(err)
    }
  },
  async obtener_marcas(datos_buscar) {
    try {
        
      const resultado = marcasModel.find(datos_buscar);

      return resultado
    } catch (err) {
      throw new Error(err)
    }
  },
  async obtener_marca(datos_buscar, datos_obtener) {
    try {
      const resultado = marcasModel.findOne(datos_buscar, datos_obtener)

      return resultado
    } catch (err) {
      throw new Error(err)
    }
  },
  async actualizar_marca(datos_buscar, datos_actualizar) {
    try {
      let resultado = await marcasModel.updateOne(datos_buscar, datos_actualizar)
      if (resultado.acknowledged == true && resultado.matchedCount > 0) {
        resultado = await marcasModel.findOne(datos_buscar)
        return resultado
      }
      return false
    } catch (err) {
      throw new Error(err)
    }
  }
}
