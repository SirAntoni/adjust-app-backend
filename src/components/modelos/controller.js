const modeloDao = require('./dao')
const marcaDao = require('../marcas/dao')
const { v4: uuidv4 } = require('uuid');
const { validar_crear_modelo, validar_obtener_modelo, validar_actualizar_modelo} = require('./validations');

const { respuesta_envio_api } = require('../../utils/error')

async function crear_modelo(data) {
  try {

    const lsErrors = validar_crear_modelo(data);

    if(lsErrors.length != 0) return respuesta_envio_api(false, 'ERROR_CAMPOS_INVALIDOS', 'Los campos ingresados son invalidos', []);

    let { nombre,marca } = data
    nombre = nombre.trim()
    nombre = nombre.toLowerCase()
    const existe_modelo = await modeloDao.obtener_modelo({nombre});
    
    if(existe_modelo) return respuesta_envio_api(false, 'ERROR', 'El modelo ya existe.', []);

    
    marca = marca.trim();
    marca = marca.toLowerCase();

    const existe_marca = await marcaDao.obtener_marca({nombre:marca});

    if(!existe_marca) return respuesta_envio_api(false, 'ERROR', 'La marca no existe', [])

    const uuid = uuidv4();
    const fecha_generada = new Date().toISOString()

    const datos_crear = {
      nombre,
      uuid,
      marca,
      fecha_creacion: fecha_generada,
      fecha_modificacion: fecha_generada
    }

    const resultado = await modeloDao.crear_modelo(datos_crear)

    return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)
  } catch (err) {
    throw new Error(err)
  }
}

async function obtener_modelos(data){

    try{

        const resultado = await modeloDao.obtener_modelos(data);

        if(!resultado) return respuesta_envio_api(false, 'SUCCESS', 'No se encontraron datos', []);
        
        return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)

    }catch(err){
        throw new Error(err);
    }

}

async function obtener_modelo(data){
    try{

        const lsErrors = validar_obtener_modelo(data);

        if(lsErrors.length != 0) return respuesta_envio_api(false, 'ERROR_CAMPOS_INVALIDOS', 'Los campos ingresados son invalidos', []);

        const {marca}= data;

        const datos_buscar = { marca };

        const datos_obtener = {
            _id: 0,
            uuid:1,
            nombre: 1,
            marca:1,
            estado: 1
        }

        const resultado = await modeloDao.obtener_modelo(datos_buscar,datos_obtener);

        if(!resultado) return respuesta_envio_api(false, 'SUCCESS', 'No se encontraron datos', []);

        return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)
        
    }catch(err){
        throw new Error(err);
    }
}

async function actualizar_modelo(params,data){

    try{

        const lsErrors = validar_actualizar_modelo(data);

        if(lsErrors.length != 0) return respuesta_envio_api(true, 'ERROR_CAMPOS_INVALIDOS', 'Los campos ingresados son invalidos', []);

        const {uuid} = params;

        const existe_uuid_modelo = await modeloDao.obtener_modelo({uuid});
        
        if(!existe_uuid_modelo) return respuesta_envio_api(true, 'ERROR', 'El modelo ingresada no existe.', []);

        let {nombre, marca} = data;

        nombre = nombre.trim();
        nombre = nombre.toLowerCase();

        marca = marca.trim();
        marca = marca.toLowerCase();

        const existe_marca = await marcaDao.obtener_marca({nombre:marca});

        if(!existe_marca) return respuesta_envio_api(true, 'ERROR', 'La marca no existe.', []);

        const existe_nombre_modelo = await modeloDao.obtener_modelo({nombre});

        if(existe_nombre_modelo) return respuesta_envio_api(true, 'ERROR', 'El modelo ingresada ya existe.', []);

        const fecha_generada = new Date().toISOString();

        const datos_actualizar = {
            nombre,
            fecha_modificacion: fecha_generada
        }

        const datos_buscar = {
            uuid
        }

        const resultado = await modeloDao.actualizar_modelo(datos_buscar,datos_actualizar);

        return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)

    }catch(err){
        throw new Error(err);
    }

}

async function eliminar_modelo(data){

  try{

       const {uuid} = data;

      const existe_uuid_modelo = await modeloDao.obtener_modelo({uuid});
      
      if(!existe_uuid_modelo) return respuesta_envio_api(true, 'ERROR', 'El modelo ingresada no existe.', []);

      const fecha_generada = new Date().toISOString();

      const datos_actualizar = {
          estado:false,
          fecha_modificacion: fecha_generada
      }

      const datos_buscar = {
          uuid
      }

      const resultado = await modeloDao.actualizar_modelo(datos_buscar,datos_actualizar);

      return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)

  }catch(err){
      throw new Error(err);
  }

}

module.exports = {
  async crear_modelo(req, res) {
    try {
      const data = req.body

      const info = await crear_modelo(data)
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
  async obtener_modelos(req, res) {
    try {
      const data = req.query;
      const info = await obtener_modelos(data)
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
  async obtener_modelo(req, res) {
    try {
      const data = req.params
      const info = await obtener_modelo(data)
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
  async actualizar_modelo(req, res) {
    try {
      const params = req.params;
      const data = req.body
      const info = await actualizar_modelo(params,data)
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
  async eliminar_modelo(req, res) {
    try {
      const data = req.params
      const info = await eliminar_modelo(data)
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
