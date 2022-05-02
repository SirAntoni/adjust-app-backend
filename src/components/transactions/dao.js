const { modelo } = require("./model");

module.exports = {
    async listar_fechas(datos_buscar){
        try{
            const datos_obtener = {
                _id: 0,
                codigo: 1,
                fecha_transaccion: 1,
                tipo_movimiento: 1,
                motivo: 1,
                observacion: 1,
                moneda: 1,
                monto: 1,
                monto_tipo_cambio: 1
            }
            const resultado = await modelo.find(datos_buscar, datos_obtener).lean();
            return resultado;
        }catch(err){
            throw new Error(err);
        }
    },
    async agregar(datos_crear){
        try{
            const modelo_nuevo = new modelo(datos_crear);
            
            const resultado = await modelo_nuevo.save();
            return resultado;
        }catch(err){
            throw new Error(err);
        }
    }
}
