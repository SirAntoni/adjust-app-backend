const marcaDao = require('./dao')
const { v4: uuidv4 } = require('uuid');
const { validar_crear_marca, validar_obtener_marca, validar_actualizar_marca} = require('./validations');

const { respuesta_envio_api } = require('../../utils/error')

async function crear_marca(data) {
  try {

    const lsErrors = validar_crear_marca(data);

    if(lsErrors.length != 0) return respuesta_envio_api(false, 'ERROR_CAMPOS_INVALIDOS', 'Los campos ingresados son invalidos', []);

    let { nombre } = data
    nombre = nombre.trim();
    nombre = nombre.toLowerCase();

    const existe_marca = await marcaDao.obtener_marca({nombre});

    if(existe_marca) return respuesta_envio_api(false, 'ERROR', 'La marca ya existe.', []);

    const uuid = uuidv4();
    const fecha_generada = new Date().toISOString()

    const datos_crear = {
      nombre,
      uuid,
      fecha_creacion: fecha_generada,
      fecha_modificacion: fecha_generada
    }

    const resultado = await marcaDao.crear_marca(datos_crear)

    return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)
  } catch (err) {
    throw new Error(err)
  }
}

async function obtener_marcas(data){

    try{

        const resultado = await marcaDao.obtener_marcas(data);

        if(!resultado) return respuesta_envio_api(false, 'SUCCESS', 'No se encontraron datos', [])

        //return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)
        return resultado;

    }catch(err){
        throw new Error(err);
    }

}

async function obtener_marca(data){
    try{

        const lsErrors = validar_obtener_marca(data);

        if(lsErrors.length != 0) return respuesta_envio_api(false, 'ERROR_CAMPOS_INVALIDOS', 'Los campos ingresados son invalidos', []);

        const {uuid} = data;

        const datos_buscar = { uuid };

        const datos_obtener = {
            _id: 0,
            uuid:1,
            nombre: 1,
            estado: 1
        }

        const resultado = await marcaDao.obtener_marca(datos_buscar,datos_obtener);

        if(!resultado) return respuesta_envio_api(false, 'SUCCESS', 'No se encontraron datos', []);

        return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)
        
    }catch(err){
        throw new Error(err);
    }
}

async function actualizar_marca(params,data){

    try{

        const lsErrors = validar_actualizar_marca(data);

        if(lsErrors.length != 0) return respuesta_envio_api(true, 'ERROR_CAMPOS_INVALIDOS', 'Los campos ingresados son invalidos', []);

        const {uuid} = params;

        const existe_uuid_marca = await marcaDao.obtener_marca({uuid});
        
        if(!existe_uuid_marca) return respuesta_envio_api(true, 'ERROR', 'La marca ingresada no existe.', []);

        let {nombre} = data;

        nombre = nombre.trim();
        nombre = nombre.toLowerCase();

        const existe_nombre_marca = await marcaDao.obtener_marca({nombre});

        if(existe_nombre_marca) return respuesta_envio_api(true, 'ERROR', 'La marca ingresada ya existe.', []);

        const fecha_generada = new Date().toISOString();

        const datos_actualizar = {
            nombre,
            fecha_modificacion: fecha_generada
        }

        const datos_buscar = {
            uuid
        }

        const resultado = await marcaDao.actualizar_marca(datos_buscar,datos_actualizar);

        return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)

    }catch(err){
        throw new Error(err);
    }

}

async function eliminar_marca(data){

    try{

        const {uuid} = data;

        const existe_uuid_marca = await marcaDao.obtener_marca({uuid});
        
        if(!existe_uuid_marca) return respuesta_envio_api(true, 'ERROR', 'La marca ingresada no existe.', []);


        const fecha_generada = new Date().toISOString();

        const datos_actualizar = {
            estado:false,
            fecha_modificacion: fecha_generada
        }

        const datos_buscar = {
            uuid
        }

        const resultado = await marcaDao.actualizar_marca(datos_buscar,datos_actualizar);

        return respuesta_envio_api(true, 'SUCCESS', 'Se realizo correctamente', resultado)

    }catch(err){
        throw new Error(err);
    }

}

module.exports = {
  async crear_marca(req, res) {
    try {
      const data = req.body

      const info = await crear_marca(data)
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
  async obtener_marcas(req, res) {
    try {
      const data = req.query;
      const info = await obtener_marcas(data)
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
  async obtener_marca(req, res) {
    try {
      const data = req.params
      const info = await obtener_marca(data)
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
  async actualizar_marca(req, res) {
    try {
      const params = req.params;
      const data = req.body
      const info = await actualizar_marca(params,data)
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
  async eliminar_marca(req, res) {
    try {
      const data = req.params;
      const info = await eliminar_marca(data)
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
