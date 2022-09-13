const candidateClientsDao = require("./dao");
const { respuesta_envio_api } = require("../../utils/error");
async function obtener_clientes_candidatos() {
    try {
        let resultado_obtener_clientes_candidatos = await candidateClientsDao.obtener_empresas();
        return respuesta_envio_api(true, "SUCCESS", "Se realizo correctamente", resultado_obtener_clientes_candidatos);
    } catch (err) {
        throw new Error(err);
    }
}

async function crear_cliente_candidato(valores) {
    try {
        let { codigo_cliente, codigo_validacion, dominio, correo } = valores;

        dominio = dominio ? dominio.toLowerCase() : "";
        dominio = dominio.replace("www.", "");

        const fecha_generada = new Date().toISOString();

        const datos_asignar_cliente_candidato = {
            codigo_cliente,
            codigo_validacion,
            dominio,
            correo,
            estado: "inactivo",
            fecha_creacion: fecha_generada,
            fecha_modificacion: fecha_generada
        }

        const resultado_asignar_cliente_candidato = await candidateClientsDao.crear_cliente_cadidato(datos_asignar_cliente_candidato);

        if (!resultado_asignar_cliente_candidato) {
            return respuesta_envio_api(false, "ERROR_ASIGNAR_CLIENTE_CANDIDATO", "No se logro crear un cliente candidato", []);
        }

        return respuesta_envio_api(true, "SUCCESS", "Se verifico correctamente", []);
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = {

    async obtener_clientes_candidatos(req, res) {
        try {

            const info = await obtener_clientes_candidatos();
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
    async crear_cliente_candidato(req, res) {
        try {
            const valores_datos = req.body;
            const valores_usuario = req.user;

            const info = await crear_cliente_candidato(valores_datos, valores_usuario);
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
