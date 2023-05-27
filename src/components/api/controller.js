const pasarelasDao = require("./dao");
const { respuesta_envio_api } = require("../../utils/error");
async function api_test(valores_datos) {
    try {

        return "api test v0.1";
       // let resultado_obtener_pasarelas = await pasarelasDao.obtener_pasarelas(valores_datos);
       // return respuesta_envio_api(true, "SUCCESS", "Se realizo correctamente", resultado_obtener_pasarelas);
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = {

    async api_test(req, res) {
        try {

           // const valores_datos = req.query;

            const info = await api_test();
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
