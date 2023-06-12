const categoriaDao = require('./dao')
const { v4: uuidv4 } = require('uuid');
const { validar_crear_tipo, validar_obtener_tipo, validar_actualizar_tipo} = require('./validations');

const { respuesta_envio_api } = require('../../utils/error')

async function crear_categoria(data) {
  try {

    // const lsErrors = validar_crear_tipo(data);

    // if(lsErrors.length != 0) return respuesta_envio_api(false, 'ERROR_CAMPOS_INVALIDOS', 'Los campos ingresados son invalidos', []);

    let { nombre, auto, cover } = data;

    // const existe_tipo = await tipoDao.obtener_tipo({nombre});

    // if(existe_tipo){
    //     return respuesta_envio_api(false, 'ERROR', 'El tipo ya existe.', [])
    // }

    nombre = nombre.trim();
    nombre = nombre.toLowerCase();

    auto = auto.trim();

    const uuid = uuidv4();
    const fecha_generada = new Date().toISOString();

    const datos_crear = {
      uuid,
      nombre,
      cover,
      fecha_creacion: fecha_generada,
      fecha_modificacion: fecha_generada
    }

    const resultado = await tipoDao.crear_tipo(datos_crear)

    return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado);

  } catch (err) {
    throw new Error(err)
  }
}

async function obtener_categorias(data){

    try{

        const resultado = await tipoDao.obtener_categorias(data);

        if(!resultado) return respuesta_envio_api(false, 'SUCCESS', 'No se encontraron datos', [])

        return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)

    }catch(err){
        throw new Error(err);
    }

}

async function obtener_categoria(data){
    try{

        // const lsErrors = validar_obtener_tipo(data);

        // if(lsErrors.length != 0) return respuesta_envio_api(false, 'ERROR_CAMPOS_INVALIDOS', 'Los campos ingresados son invalidos', []);

        const {uuid} = data;

        const datos_buscar = { uuid };

        const datos_obtener = {
            _id: 0,
            uuid:1,
            nombre: 1,
            auto:1,
            cover:1,
            estado: 1
        }

        const resultado = await categoriaDao.obtener_categoria(datos_buscar,datos_obtener);

        if(!resultado) return respuesta_envio_api(false, 'SUCCESS', 'No se encontraron datos', []);

        return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)
        
    }catch(err){
        throw new Error(err);
    }
}

async function actualizar_categoria(params,data){

    try{

        // const lsErrors = validar_actualizar_tipo(data);

        // if(lsErrors.length != 0) return respuesta_envio_api(true, 'ERROR_CAMPOS_INVALIDOS', 'Los campos ingresados son invalidos', []);

        const {uuid} = params;

        const existe_uuid_tipo = await tipoDao.obtener_tipo({uuid});
        
        if(!existe_uuid_tipo) return respuesta_envio_api(true, 'ERROR', 'El tipo ingresada no existe.', []);

        let {nombre} = data;

        nombre = nombre.trim();
        nombre = nombre.toLowerCase();

        const existe_nombre_tipo = await tipoDao.obtener_tipo({nombre});

        if(existe_nombre_tipo) return respuesta_envio_api(true, 'ERROR', 'El tipo ingresada ya existe.', []);

        const fecha_generada = new Date().toISOString();

        const datos_actualizar = {
            nombre,
            fecha_modificacion: fecha_generada
        }

        const datos_buscar = {
            uuid
        }

        const resultado = await tipoDao.actualizar_tipo(datos_buscar,datos_actualizar);

        return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)

    }catch(err){
        throw new Error(err);
    }

}

async function eliminar_tipo(data){

  try{

      const {uuid} = data;

      const existe_uuid_tipo = await tipoDao.obtener_tipo({uuid});
      
      if(!existe_uuid_tipo) return respuesta_envio_api(true, 'ERROR', 'El tipo ingresada no existe.', []);

      const fecha_generada = new Date().toISOString();

      const datos_actualizar = {
          estado: false,
          fecha_modificacion: fecha_generada
      }

      const datos_buscar = {
          uuid
      }

      const resultado = await tipoDao.actualizar_tipo(datos_buscar,datos_actualizar);

      return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)

  }catch(err){
      throw new Error(err);
  }

}

module.exports = {
  async crear_tipo(req, res) {
    try {
      const data = req.body
      const info = await crear_tipo(data)
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
  async obtener_categorias(req, res) {
    try {
      const data = req.query;
      const info = await obtener_categorias(data)
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
  async obtener_tipo(req, res) {
    try {
      const data = req.params
      const info = await obtener_tipo(data)
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
  async actualizar_tipo(req, res) {
    try {
      const params = req.params;
      const data = req.body
      const info = await actualizar_tipo(params,data)
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
  async eliminar_tipo(req, res) {
    try {
      const data = req.params;
      const info = await eliminar_tipo(data)
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
