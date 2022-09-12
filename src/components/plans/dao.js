const {planesModel} = require("./model");
const axios = require('axios');

const URL_CDN_STORAGE=  process.env.URL_CDN_STORAGE;
const DOMAIN_SYSTEM=  process.env.DOMAIN_SYSTEM;

module.exports = {
    async obtener_planes(){
        try{
            const datos_obtener = {
                _id: 1,
                nombre: 1,
                tipo: 1,
                monto:1,
                comision:1,
                estado:1,
                fecha_creacion:1
            };
            const obtener_planes = await planesModel.find({}, datos_obtener).lean();
            return obtener_planes;
        }catch(err){
            throw new Error(err);
        }
    },
    async crear_plan(data){
        try{
            const plan_modelo = new planesModel(data);
            
            const resultado_plan = await plan_modelo.save();
            return resultado_plan;
        }catch(err){
            throw new Error(err);
        }
    },
    async actualizar_dominio(datos_buscar, datos_actualizar){
       /* try{
            const resultado_dominio = await dominiosModel.updateOne(datos_buscar, {$set: datos_actualizar})
            if(resultado_dominio.acknowledged == true && resultado_dominio.matchedCount > 0){
                return true;
            }
            return false;
        }catch(err){
            throw new Error(err);
        } */
    },
    async actualizar_tienda_dominio(datos_buscar){
      /*  try{
            const resultado_dominio = await forms.updateOne(datos_buscar, {$set:{ contacto: campos_formulario }})
            return resultado_dominio;
        }catch(err){
            throw new Error(err);
        } */
    }
}
