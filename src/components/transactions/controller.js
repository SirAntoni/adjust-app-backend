const modelo_dao = require("./dao");
const { nanoid } = require('nanoid');

const { respuesta_envio_api } = require("../../utils/error");
const { validar_agregar, validar_listar_fechas} = require("./validations");

async function agregar(valores_datos, valores_usuario){
    try {
        const lsErrors = validar_agregar(valores_datos); 
        if (lsErrors.length != 0) return respuesta_envio_api( false, "ERROR_CAMPOS_INVALIDOS", "Los campos ingresados son invalidos", null);

        const { _id } = valores_usuario;

        const codigo = nanoid();
        const fecha_generada = new Date().toISOString();
        const { tipo_movimiento, motivo, observacion, moneda, monto, monto_tipo_cambio } = valores_datos;
        const datos_crear = {
            codigo,
            
            fecha_transaccion: fecha_generada,
            tipo_movimiento,

            motivo,
            observacion,

            moneda,

            monto,
            monto_tipo_cambio,

            estado: "activo",

            usuario_creacion: _id,
            usuario_modificacion: _id,

            fecha_creacion: fecha_generada,
            fecha_modificacion: fecha_generada
        }

        const resultado_crear = await modelo_dao.agregar(datos_crear);
        if(resultado_crear){
            return respuesta_envio_api( true, "SUCCESS", "Se proceso correctamente", null);
        }
        return respuesta_envio_api( false, "ERROR", "No se proceso", null);

    } catch (err) {
        throw new Error(err);
    }
}
async function listar_fechas(valores_datos, valores_usuario){
    try {
        const lsErrors = validar_listar_fechas(valores_datos);
        if (lsErrors.length != 0) return respuesta_envio_api( false, "ERROR_CAMPOS_INVALIDOS", "Los campos ingresados son invalidos", null);

        let { fecha_inicio, fecha_fin } = valores_datos;

        const datos_encontrar = {
            fecha_transaccion:{ $gte:ISODate(fecha_inicio), $lt:ISODate(fecha_fin) }
        }
        const resultado = await modelo_dao.listar_fechas(datos_encontrar);

        if(resultado){
            return respuesta_envio_api( true, "SUCCESS", "Se proceso correctamente", resultado );
        }
        else{
            return respuesta_envio_api( false, "ERROR_NO_EXISTE", "No existen registros", null);
        }
    } catch (err) {
        throw new Error(err);
    }
}
module.exports = {
    async listar_fechas(req, res){
        try {
            const valores_datos = req.query;
            const valores_usuario = req.user;

            const info = await listar_fechas(valores_datos, valores_usuario);
            return res.json(info);
        } catch (err) {
            info = {
                "bEstado": false,
                "iCodigo": 0,
                "sRpta": err.message,
                "obj": []
              }
            console.log('[response error]', err.message);
            return res.status(500).send(info);
        }
    },
    async agregar(req, res){
        try {
            const valores_datos = req.body;
            const valores_usuario = req.user;

            const info = await agregar(valores_datos, valores_usuario);
            return res.json(info);
        } catch (err) {
            info = {
                "bEstado": false,
                "iCodigo": 0,
                "sRpta": err.message,
                "obj": []
              }
            console.log('[response error]', err.message);
            return res.status(500).send(info);
        }
    }
}