const planDao = require("./dao");
const controlador_transacion = require("../transactions/controller");
const { respuesta_envio_api } = require("../../utils/error");
async function obtener_planes() {
    try {
        let resultado_obtener_planes = await planDao.obtener_planes();
        return respuesta_envio_api(true, "SUCCESS", "Se realizo correctamente", resultado_obtener_planes);
    } catch (err) {
        throw new Error(err);
    }
}

async function crear_plan(valores) {
    try {
        let { nombre, tipo, monto, comision } = valores;

        nombre = nombre ? nombre.toLowerCase() : "";

        const fecha_generada = new Date().toISOString();

        const datos_asignar_plan = {
            nombre,
            tipo,
            monto,
            comision,
            estado: "activo",
            fecha_creacion: fecha_generada,
            fecha_modificacion: fecha_generada
        }

        const resultado_asignar_plan = await planDao.crear_plan(datos_asignar_plan);

        if (!resultado_asignar_plan) {
            return respuesta_envio_api(false, "ERROR_ASIGNAR_PLAN", "No se logro crear plan", []);
        }

        return respuesta_envio_api(true, "SUCCESS", "Se verifico correctamente", []);
    }catch (err) {
        throw new Error(err);
    }
}

module.exports = {

    async obtener_planes(req, res) {
        try {

            const info = await obtener_planes();
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
    async crear_plan(req, res){
        try {
            const valores_datos = req.body;
            const valores_usuario = req.user;

            const info = await crear_plan(valores_datos, valores_usuario);
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
