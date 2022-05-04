const modelo_dao = require("./dao");
const modelo_dominio_dao = require("../domains/dao");
const { nanoid } = require('nanoid');
const dominio_domains_dao = require("../domains/dao");

const { respuesta_envio_api } = require("../../utils/error");
const { validar_agregar, validar_listar_fechas} = require("./validations");

async function agregar(valores_datos, valores_usuario){
    try {
        const lsErrors = validar_agregar(valores_datos); 
        if (lsErrors.length != 0) return respuesta_envio_api( false, "ERROR_CAMPOS_INVALIDOS", "Los campos ingresados son invalidos", null);

        const datos_buscar = {
            nombre: valores_datos.dominio
        }

        const existe_dominio = await modelo_dominio_dao.existe_dominio_venta_dominio(datos_buscar);

        const { moneda_codigo } = existe_dominio;
        valores_datos.moneda_codigo = moneda_codigo;
        const resultado_asignar_dominio = await agregar_datos(valores_datos, valores_usuario);
        if(resultado_asignar_dominio){
            return respuesta_envio_api( true, "SUCCESS", "Se proceso correctamente", null);
        }
        return respuesta_envio_api( false, "ERROR", "No se proceso", null);
    } catch (err) {
        throw new Error(err);
    }
}
async function agregar_datos(valores_datos, valores_usuario){
    try {
        const codigo = nanoid();
        const fecha_generada = new Date().toISOString();
        let { dominio, tipo_movimiento, motivo, observacion, moneda_codigo, monto } = valores_datos;
        const datos_crear = {
            codigo,
            
            //origen,

            dominio, 
            fecha_transaccion: fecha_generada,
            tipo_movimiento,

            motivo,
            observacion,

            moneda_codigo,

            monto,
            //monto_tipo_cambio,

            estado: "activo",

            // usuario_creacion: _id,
            // usuario_modificacion: _id,

            fecha_creacion: fecha_generada,
            fecha_modificacion: fecha_generada
        }

        const resultado_crear = await modelo_dao.agregar(datos_crear);
        if(resultado_crear){
            if(tipo_movimiento === "ingreso"){
                monto = monto * (-1);
            }
            const valores_datos = {
                nombre: dominio,
                monto,
                fecha_modificacion: fecha_generada
            };
            const resultado_asignar_dominio = await actualizar_billetera_movil_datos(valores_datos);
            return resultado_asignar_dominio;
        }
        return false;
    } catch (err) {
        throw new Error(err);
    }
}
async function actualizar_billetera_movil_datos(valores_datos){
    try {
        let { nombre, monto, fecha_modificacion } = valores_datos;

        nombre = nombre ? nombre.toLowerCase() : "";
        nombre = nombre.replace("www.", "");

        const datos_buscar = {
            nombre
        }

        const existe_dominio = await dominio_domains_dao.existe_dominio_venta_dominio_venta_recurrente(datos_buscar);

        if(existe_dominio){
            const { saldo } = existe_dominio.billetera_movil;
            // const { _id } = valores_usuario;
            const saldo_actual = parseFloat(saldo) + parseFloat(monto);
            if(saldo_actual > 0){
                const datos_asignar = {
                    "billetera_movil.saldo": saldo_actual,
                    fecha_modificacion
                }
                const datos_buscar_dominio = {
                    nombre
                }
    
                const resultado_asignar_dominio = await dominio_domains_dao.actualizar_dominio(datos_buscar_dominio, datos_asignar);
                return resultado_asignar_dominio;
            }
            else{
                const datos_asignar = {
                    "billetera_movil.saldo": saldo_actual,
                    estado: "parcial",
                    fecha_modificacion
                }
                const datos_buscar_dominio = {
                    nombre
                }
    
                const resultado_asignar_dominio = await dominio_domains_dao.actualizar_dominio(datos_buscar_dominio, datos_asignar);
                return resultado_asignar_dominio;
            }
        }
        else{
            return false;
        }
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
    },
    async agregar_ventas_comision(req, res){
        try {
            let valores_datos = req.body;
            valores_datos.comision_venta = true;
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
    },
    async agregar_datos(valores_datos){
        try {

            const info = await agregar_datos(valores_datos);
            return info;
        } catch (err) {
            throw new Error(err)
        }
    }
}