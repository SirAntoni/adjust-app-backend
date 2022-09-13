const empresaDao = require("./dao");
const { respuesta_envio_api } = require("../../utils/error");
async function obtener_empresas() {
    try {
        let resultado_obtener_empresas = await empresaDao.obtener_empresas();
        return respuesta_envio_api(true, "SUCCESS", "Se realizo correctamente", resultado_obtener_empresas);
    } catch (err) {
        throw new Error(err);
    }
}

async function crear_empresa(valores) {
    try {
        let { codigo_cliente, nombre_comercial, ruc_tienda, correo, representante,  } = valores;

        const fecha_generada = new Date().toISOString();

        const datos_asignar_empresa = {
            codigo_cliente,
            nombre_comercial,
            ruc_tienda,
            correo,
            representante,
            estado: "activo",
            fecha_creacion: fecha_generada,
            fecha_modificacion: fecha_generada
        }

        const resultado_asignar_empresa = await empresaDao.crear_empresa(datos_asignar_empresa);

        if (!resultado_asignar_empresa) {
            return respuesta_envio_api(false, "ERROR_ASIGNAR_EMPRESA", "No se logro crear una empresa", []);
        }

        return respuesta_envio_api(true, "SUCCESS", "Se verifico correctamente", []);
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = {

    async obtener_empresas(req, res) {
        try {

            const info = await obtener_empresas();
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
    async crear_empresa(req, res) {
        try {
            const valores_datos = req.body;
            const valores_usuario = req.user;

            const info = await crear_empresa(valores_datos, valores_usuario);
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

};
