const { categoriasModel } = require('./model')

module.exports = {
  async crear_categoria(data) {
    try {
      const model_categorias = new categoriasModel(data);
      const resultado = model_categorias.save();

      return resultado
    } catch (err) {
      throw new Error(err)
    }
  },
  async obtener_categorias(datos_buscar, datos_obtener) {
    try {

      const resultado = categoriasModel.find(datos_buscar, datos_obtener)

      return resultado
    } catch (err) {
      throw new Error(err)
    }
  },
  async obtener_categoria(datos_buscar, datos_obtener) {
    try {
      const resultado = categoriasModel.findOne(datos_buscar, datos_obtener)

      return resultado
    } catch (err) {
      throw new Error(err)
    }
  },
  async actualizar_categoria(datos_buscar, datos_actualizar) {
    try {
      let resultado = await categoriasModel.updateOne(datos_buscar, datos_actualizar)
      if (resultado.acknowledged == true && resultado.matchedCount > 0) {
        resultado = await categoriasModel.findOne(datos_buscar)
        return resultado
      }
      return false
    } catch (err) {
      throw new Error(err)
    }
  }
}
