const {dominiosModel} = require("./model");
const axios = require('axios');

const URL_CDN_STORAGE=  process.env.URL_CDN_STORAGE;
const DOMAIN_SYSTEM=  process.env.DOMAIN_SYSTEM;

module.exports = {
    async crear_dominio(data){
        try{
            const dominio_modelo = new dominiosModel(data);
            
            const resultado_dominio = await dominio_modelo.save();
            return resultado_dominio;
        }catch(err){
            throw new Error(err);
        }
    },
    async actualizar_dominio(datos_buscar, datos_actualizar){
        try{
            const resultado_dominio = await dominiosModel.updateOne(datos_buscar, {$set: datos_actualizar})
            if(resultado_dominio.acknowledged == true && resultado_dominio.matchedCount > 0){
                return true;
            }
            return false;
        }catch(err){
            throw new Error(err);
        }
    },
    async actualizar_tienda_dominio(datos_buscar){
        try{
            const resultado_dominio = await forms.updateOne(datos_buscar, {$set:{ contacto: campos_formulario }})
            return resultado_dominio;
        }catch(err){
            throw new Error(err);
        }
    },
    async buscar_dominio(datos){
        try{
            const { nombre } = datos;
            const existe_dominio = await dominiosModel.findOne({ nombre });

            return existe_dominio;
        }catch(err){
            throw new Error(err);
        }
    },
    async buscar_dominio_billetera_movil(datos_buscar){
        try{
            const datos_obtener = {
                _id: 1,
                nombre: 1,
                moneda_codigo: 1,
                billetera_movil: 1,
                moneda: 1
            };
            const existe_dominio = await dominiosModel.find(datos_buscar, datos_obtener).lean();

            return existe_dominio;
        }catch(err){
            throw new Error(err);
        }
    },
    async buscar_dominio_movimiento(datos_buscar){
        try{
            const datos_obtener = {
                _id: 1,
                nombre: 1,
                moneda_codigo: 1,
                "billetera_movil.monto_porcentaje_venta": 1,
                moneda: 1
            };
            const existe_dominio = await dominiosModel.findOne(datos_buscar, datos_obtener).lean();

            return existe_dominio;
        }catch(err){
            throw new Error(err);
        }
    },
    async existe_dominio(datos_buscar){
        try{
            const datos_obtener = {
                _id: 1
            };
            const existe_dominio = await dominiosModel.findOne(datos_buscar, datos_obtener);

            return existe_dominio;
        }catch(err){
            throw new Error(err);
        }
    },
    async existe_dominio_venta_dominio(datos_buscar){
        try{
            const datos_obtener = {
                _id: 1,
                moneda_codigo: 1,
            };
            const existe_dominio = await dominiosModel.findOne(datos_buscar, datos_obtener).lean();

            return existe_dominio;
        }catch(err){
            throw new Error(err);
        }
    },
    async existe_dominio_venta_dominio_venta_recurrente(datos_buscar){
        try{
            const datos_obtener = {
                _id: 1,
                billetera_movil: 1,
            };
            const existe_dominio = await dominiosModel.findOne(datos_buscar, datos_obtener).lean();

            return existe_dominio;
        }catch(err){
            throw new Error(err);
        }
    },
    async buscar_perfil_dominio(datos_buscar){
        try{
            const datos_obtener = {
                _id: 0,
                nombre_comercial: 1,
                correo_ordenes: 1,
                correo_ordenes_titulo: 1,
                tipo: 1,

                contacto_perfil: 1
            }

            const existe_dominio = await dominiosModel.findOne(datos_buscar, datos_obtener).lean();

            return existe_dominio;
        }catch(err){
            throw new Error(err);
        }
    },
    async buscar_facturacion_dominio(datos_buscar){
        try{
            const datos_obtener = {
                _id: 0,
                facturacion: 1
            }

            const existe_dominio = await dominiosModel.findOne(datos_buscar, datos_obtener).lean();

            return existe_dominio;
        }catch(err){
            throw new Error(err);
        }
    },
    async buscar_idiomas_formatos_dominio(datos_buscar){
        try{
            const datos_obtener = {
                _id: 0,
                pais_codigo: 1,
                idioma_codigo: 1,
                moneda_codigo: 1,
                unidad_peso_codigo: 1,
                unidad_medida_codigo: 1
            }

            const existe_dominio = await dominiosModel.findOne(datos_buscar, datos_obtener).lean();

            return existe_dominio;
        }catch(err){
            throw new Error(err);
        }
    },
    async buscar_existe_dominio(datos_buscar){
        try{
            const datos_obtener = {
                _id: 1
            }
            const existe_dominio = await dominiosModel.findOne(datos_buscar, datos_obtener).lean();

            return existe_dominio;
        }catch(err){
            throw new Error(err);
        }
    },
    async buscar_dominio_pasarela(datos_buscar, datos_obtener){
        try{
            const existe_dominio = await dominiosModel.findOne(datos_buscar, datos_obtener);

            return existe_dominio;
        }catch(err){
            throw new Error(err);
        }
    },
    async obtener_paginas_dominio(datos){
        try{
            const { plan } = datos;
            const version = Math.random() * (100 - 1) + 1;
            const path_plan_dominio = URL_CDN_STORAGE + DOMAIN_SYSTEM + "/js/planes-samishop/" + plan + ".json?version=" + version;
            let paginas_plan = await axios.get(path_plan_dominio);
            
            paginas_plan = paginas_plan.data;

            return paginas_plan;
        }catch(err){
            throw new Error(err);
        }
    },
    async enviar_correo_alerta_transaccion(datos){
        try{
            const template_code = "recover_password_code";

            const { codigo_recupero, correo, dominio } = datos;

            var Unique = [];
            //Asignar las claves y los valores del json consumido
            Unique.push({ Keys : "[[correo]]", Value : correo});
            Unique.push({ Keys : "[[codigo]]", Value : codigo_recupero });

            var Sections = [];
            var Items = { Unique : Unique, Sections : Sections };
            const email = {
                To: [correo]
            }
            const result_data = {
                domain: dominio,
                Template_Code: template_code,
                Email : email,
                Items : Items
            }

            const pathUrl = API_MAILING + "email/template";
            var resultReset = await axios.post(pathUrl, result_data);

            return resultReset.data.bEstado;
        }catch(err){
            throw new Error(err);
        }
    }
}
