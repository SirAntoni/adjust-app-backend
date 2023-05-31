const anioDao = require('./dao')
const { v4: uuidv4 } = require('uuid');
const { validar_crear_anio, validar_obtener_anio, validar_actualizar_anio} = require('./validations');

const { respuesta_envio_api } = require('../../utils/error')

async function crear_anio(data) {
  try {

    const lsErrors = validar_crear_anio(data);

    if(lsErrors.length != 0) return respuesta_envio_api(false, 'ERROR_CAMPOS_INVALIDOS', 'Los campos ingresados son invalidos', []);

    let { nombre } = data

    nombre = nombre.trim()
    nombre = nombre.toLowerCase()

    const existe_anio = await anioDao.obtener_anio({nombre});


    if(existe_anio) return respuesta_envio_api(false, 'ERROR', 'El anio ya existe.', [])

    
    const uuid = uuidv4();
    const fecha_generada = new Date().toISOString()

    const datos_crear = {
      nombre,
      uuid,
      fecha_creacion: fecha_generada,
      fecha_modificacion: fecha_generada
    }

    const resultado = await anioDao.crear_anio(datos_crear)

    return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)
  } catch (err) {
    throw new Error(err)
  }
}

async function obtener_anios(data){

    try{

        const resultado = await anioDao.obtener_anios(data);

        if(!resultado) return respuesta_envio_api(false, 'SUCCESS', 'No se encontraron datos', [])

        return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)

    }catch(err){
        throw new Error(err);
    }

}

async function obtener_anio(data){
    try{

        const lsErrors = validar_obtener_anio(data);

        if(lsErrors.length != 0) return respuesta_envio_api(false, 'ERROR_CAMPOS_INVALIDOS', 'Los campos ingresados son invalidos', []);

        const {uuid} = data;

        const datos_buscar = { uuid };

        const datos_obtener = {
            _id: 0,
            uuid:1,
            nombre: 1,
            estado: 1
        }

        const resultado = await anioDao.obtener_anio(datos_buscar,datos_obtener);

        if(!resultado) return respuesta_envio_api(false, 'SUCCESS', 'No se encontraron datos', []);

        return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)
        
    }catch(err){
        throw new Error(err);
    }
}

async function actualizar_anio(params,data){

    try{

        const lsErrors = validar_actualizar_anio(data);

        if(lsErrors.length != 0) return respuesta_envio_api(true, 'ERROR_CAMPOS_INVALIDOS', 'Los campos ingresados son invalidos', []);

        const {uuid} = params;

        const existe_uuid_anio = await anioDao.obtener_anio({uuid});
        
        if(!existe_uuid_anio) return respuesta_envio_api(true, 'ERROR', 'El anio ingresada no existe.', []);

        let {nombre} = data;

        nombre = nombre.trim();
        nombre = nombre.toLowerCase();

        const existe_nombre_anio = await anioDao.obtener_anio({nombre});

        if(existe_nombre_anio) return respuesta_envio_api(true, 'ERROR', 'El anio ingresada ya existe.', []);

        const fecha_generada = new Date().toISOString();

        const datos_actualizar = {
            nombre,
            fecha_modificacion: fecha_generada
        }

        const datos_buscar = {
            uuid
        }

        const resultado = await anioDao.actualizar_anio(datos_buscar,datos_actualizar);

        return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)

    }catch(err){
        throw new Error(err);
    }

}


async function eliminar_anio(data){

  try{

     const {uuid} = data;

      const existe_uuid_anio = await anioDao.obtener_anio({uuid});
      
      if(!existe_uuid_anio) return respuesta_envio_api(true, 'ERROR', 'El anio ingresada no existe.', []);

      const fecha_generada = new Date().toISOString();

      const datos_actualizar = {
          estado:false,
          fecha_modificacion: fecha_generada
      }

      const datos_buscar = {
          uuid
      }

      const resultado = await anioDao.actualizar_anio(datos_buscar,datos_actualizar);

      return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)

  }catch(err){
      throw new Error(err);
  }

}

module.exports = {
  async crear_anio(req, res) {
    try {
      const data = req.body

      const info = await crear_anio(data)
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
  async obtener_anios(req, res) {
    try {
      const data = req.query;
      const info = await obtener_anios(data)
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
  async obtener_anio(req, res) {
    try {
      const data = req.params
      const info = await obtener_anio(data)
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
  async actualizar_anio(req, res) {
    try {
      const params = req.params;
      const data = req.body
      const info = await actualizar_anio(params,data)
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
  async eliminar_anio(req, res) {
    try {
      const data = req.params;
      const info = await eliminar_anio(data)
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
