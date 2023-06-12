const { v4: uuidv4 } = require('uuid');
const { uploadFile, getFileURL } = require('./s3');

const { respuesta_envio_api } = require('../../utils/error')

async function subir_imagen(archivo) {
  try {

    if(archivo === '') return respuesta_envio_api(false, 'ERROR', 'Necesita agregar una imagen.', []);
    
    const nombre = `${uuidv4()}-${archivo.name}`;

    await uploadFile(nombre,archivo);

    const respuesta = {
      nombre
    }
    
    return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', respuesta);
    
  } catch (err) {
    throw new Error(err)
  }
}

async function obtener_imagen(data) {
  try {

    const {name} = data;

    const url = await getFileURL(name);
    
  const respuesta = {
    url
  }
  
    return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', respuesta);
    
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  async subir_imagen(req, res) {
    try {
      
      let archivo = '';

      if(req.files){
        archivo = req.files.archivo;
      }

      const info = await subir_imagen(archivo)

      return res.json(info)

    } catch (err) {
      info = {
        bEstado: false,
        iCodigo: 0,
        sRpta: err.message,
        obj: []
      }
      console.log('[response error]', err.message)
      return res.status(500).send(info)
    }
  },
  async obtener_imagen(req, res) {
    try {
      
      const data = req.params;

      const info = await obtener_imagen(data)

      return res.json(info)

    } catch (err) {
      info = {
        bEstado: false,
        iCodigo: 0,
        sRpta: err.message,
        obj: []
      }
      console.log('[response error]', err.message)
      return res.status(500).send(info)
    }
  }


}
