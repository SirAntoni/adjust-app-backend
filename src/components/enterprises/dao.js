const {empresasModel} = require("./model");
const axios = require('axios');

const URL_CDN_STORAGE=  process.env.URL_CDN_STORAGE;
const DOMAIN_SYSTEM=  process.env.DOMAIN_SYSTEM;

module.exports = {
    async obtener_empresas(){
        try{
            const datos_obtener = {
                _id: 1,
                codigo_cliente: 1,
                nombre_comercial: 1,
                ruc_tienda:1,
                correo:1,
                representante:1,
                estado:1,
                fecha_creacion:1
            };
            const obtener_empresas = await empresasModel.find({}, datos_obtener).lean();
            return obtener_empresas;
        }catch(err){
            throw new Error(err);
        }
    },
    async crear_empresa(data){
        try{
            const empresa_modelo = new empresasModel(data);
            
            const resultado_empresa = await empresa_modelo.save();
            return resultado_empresa;
        }catch(err){
            throw new Error(err);
        }
    }
}
