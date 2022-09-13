const {candidateClientsModel} = require("./model");
const axios = require('axios');

const URL_CDN_STORAGE=  process.env.URL_CDN_STORAGE;
const DOMAIN_SYSTEM=  process.env.DOMAIN_SYSTEM;

module.exports = {
    async obtener_empresas(){
        try{
            const datos_obtener = {
                _id: 1,
                codigo_cliente: 1,
                codigo_validacion: 1,
                dominio:1,
                correo:1,
                estado:1,
                fecha_creacion:1
            };
            const obtener_clientes_candidatos = await candidateClientsModel.find({estado:"activo"}, datos_obtener).lean();
            return obtener_clientes_candidatos;
        }catch(err){
            throw new Error(err);
        }
    },
    async crear_cliente_cadidato(data){
        try{
            const cliente_candidato_modelo = new candidateClientsModel(data);
            
            const resultado_cliente_cadidato = await cliente_candidato_modelo.save();
            return resultado_cliente_cadidato;
        }catch(err){
            throw new Error(err);
        }
    }
}
