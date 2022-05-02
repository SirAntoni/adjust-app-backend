const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
const crypto = require('crypto');
const { validar_token_usuario } = require('../../components/users/dao');

const APP_SECRET_ACCESS=  process.env.APP_SECRET_ACCESS;
const APP_SECRET_ACCESS_TIME=  process.env.APP_SECRET_ACCESS_TIME;

const CRIPTO_KEY=  process.env.CRIPTO_KEY;
const CRIPTO_ALGORITHM=  process.env.CRIPTO_ALGORITHM;
//Utility functions
module.exports.generarSalt = async() => {
        return await bcrypt.genSaltSync()
},
module.exports.generarContrasena = async (password, salt) => {
        return await bcrypt.hashSync(password, salt);
};
module.exports.validarContrasena = async (enteredPassword, savedPassword) => {
        return await bcrypt.compareSync(enteredPassword, savedPassword);
};
module.exports.generarEncriptacion = async (textDecrypted) => {
        const iv = crypto.randomBytes(16).toString("hex").slice(0, 16);

        const cipher = crypto.createCipheriv(CRIPTO_ALGORITHM, CRIPTO_KEY, iv);

        let encryptedData = await cipher.update(textDecrypted, "utf-8", "hex");
        encryptedData += cipher.final("hex");

        return { valor_encriptado: encryptedData, iv};
};
module.exports.generarDesencriptacion = async (textEncrypt, iv) => {

        const decipher = await crypto.createDecipheriv(CRIPTO_ALGORITHM, CRIPTO_KEY, iv);

        let decryptedData = await decipher.update(textEncrypt, "hex", "utf-8");
        decryptedData += decipher.final("utf8");

        return decryptedData;
};
module.exports.generarFirma = async (payload) => {
        const token = await jwt.sign(payload, APP_SECRET_ACCESS, { expiresIn: APP_SECRET_ACCESS_TIME} );
        const data = {
                token_acceso: token,
                token_tiempo: APP_SECRET_ACCESS_TIME
        }
        return data
},
module.exports.ValidateSignature  = async(req) => {

        try {
            const signature = req.get('Authorization');
            if(signature){
                const tokenAccess = signature.split(' ')[1];
                const payload = await jwt.verify(tokenAccess, APP_SECRET_ACCESS);
                
                req.user = payload;
                req.tokenAccess = tokenAccess;
                return true;
            }
        } catch (error) {
                return false
        }
};
module.exports.validacion_credencial_publica  = async(req) => {
        try {
            const signature = req.get('Authorization');
            if(signature){
                const tokenAccess = signature.split(' ')[1];
                const payload = await jwt.verify(tokenAccess, APP_SECRET_ACCESS);
                
                req.user = payload;
                return true;
            }
        } catch (error) {
                return false
        }
};
module.exports.get_values_signature_req  = async(req) => {

        try {
            const signature = req.get('Authorization');
            if(signature){
                const tokenAccess = signature.split(' ')[1];
                var base64Payload = tokenAccess;
                var payload = JSON.parse(Buffer.from(base64Payload.split('.')[1], 'base64').toString());
                
                req.user = payload;
                req.tokenAccess = tokenAccess;
                return true;
            }
        } catch (error) {
                return false
        }
};
module.exports.get_values_signature  = (signature) => {

        try {
                var payload = JSON.parse(Buffer.from(signature.split('.')[1], 'base64').toString());
                return payload;
        } catch (error) {
                return null;
        }
};
module.exports.auth_values_signature  = async(req) => {

        try {   
                const token_valid = await this.ValidateSignature(req);
                if(token_valid){
                        const { _id, correo, usuario_tipo} = req.user;
                        const tokenAccess = req.tokenAccess;
                        //const fecha_generada= new Date().toISOString();
                
                        const datos_encontrar_usuario = {
                                _id,
                                correo,
                                usuario_tipo,
                                token_acceso: tokenAccess
                        }

                        const validar_token_base_datos = await validar_token_usuario(datos_encontrar_usuario);

                        if(validar_token_base_datos){
                                return true;
                        }
                }
                return false;
        } catch (err) {
                throw new Error(err);
        }
};