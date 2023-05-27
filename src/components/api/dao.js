//const {pasarelasModel} = require("./model");

module.exports = {
    async api_test(d){
        try{
            console.log('api_test');
          //  const obtener_pasarelas = await pasarelasModel.find(datos_buscar).lean();
          //  return obtener_pasarelas;
        }catch(err){
            throw new Error(err);
        }
    }
}
