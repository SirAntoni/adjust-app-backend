const dominioDao = require("./dao");

const { respuesta_envio_api } = require("../../utils/error");
const { auth_values_signature } = require("../../utils/secrets");
const { validar_asignar_perfil_contacto, validar_asignar_perfil_tienda, validar_asignar_idiomas_formatos_datos, validar_asignar_facturacion_datos, validar_asignar_perfil_facturacion } = require("./validations");

async function  asignar_dominio(valores){
    try {
        let { nombre, plan } = valores;

        nombre = nombre ? nombre.toLowerCase() : "";
        nombre = nombre.replace("www.", "");

        const datos_encontrar_dominio = {
            nombre
        }

        const existe_dominio = await dominioDao.buscar_dominio(datos_encontrar_dominio);

        if(!existe_dominio){
            const fecha_generada = new Date().toISOString();

            plan = plan ? plan.toLowerCase() : "";

            const datos_asignar_dominio = {
                nombre,
                plan,

                situacion: "activo",

                fecha_creacion: fecha_generada,
                fecha_modificacion: fecha_generada
            }

            const resultado_asignar_dominio = await dominioDao.crear_dominio(datos_asignar_dominio);

            if(!resultado_asignar_dominio){
                return respuesta_envio_api( false, "ERROR_ASIGNAR_DOMINIO", "No se logro asginar dominio", []);
            }

            return respuesta_envio_api( true, "SUCCESS", "Se verifico correctamente", []);
        }
        else{
            return respuesta_envio_api( false, "ERROR_EXISTE_DOMINIO", "El dominio ya existe", []);
        }
    } catch (err) {
        throw new Error(err);
    }
}
async function validar_paginas_dominio(valores, req){
    try {
        let { dominio, pagina } = valores;

        dominio = dominio ? dominio.toLowerCase() : "";
        dominio = dominio.replace("www.", "");
        const datos_encontrar_dominio = {
            nombre: dominio
        }

        const existe_dominio = await dominioDao.buscar_dominio(datos_encontrar_dominio);

        if(existe_dominio){
            
            

            const plan = existe_dominio.plan;
            const situacion = existe_dominio.situacion;

            const auth_values = await auth_values_signature(req);
            
            if(auth_values === false){
                return respuesta_envio_api( false, "ERROR_USUARIO_INVALIDO", "Usuario invalido", [{ situacion }]);
            }

            const { usuario_tipo } = req.user;
            if(usuario_tipo != null && usuario_tipo == 2){
                const datos_encontrar_paginas = {
                    plan
                }
                const resultado_obtener_paginas_ = await dominioDao.obtener_paginas_dominio(datos_encontrar_paginas);
    
                const ExistingTrack = resultado_obtener_paginas_.filter(key => key == pagina);
    
                if(ExistingTrack.length != 0){
                    return respuesta_envio_api( true, "SUCCESS", "Se verifico correctamente", [{ situacion }]);
                }
                return respuesta_envio_api( false, "ERROR_NO_EXISTE_PAGINA_VALIDA_PLAN", "No se logró encontrar al pagina valida", [{ situacion }]);
            }
            else{
                return respuesta_envio_api( true, "SUCCESS", "Se verifico correctamente", [{ situacion }]);
            }
        }
        else{
            return respuesta_envio_api( false, "ERROR_NO_EXISTE_DOMINIO", "No se logró encontrar al dominio", []);
        }
    } catch (err) {
        throw new Error(err);
    }
}
async function buscar_dominio_pasarela(valores){
    try {
        let { dominio } = valores;

        dominio = dominio ? dominio.toLowerCase() : "";
        dominio = dominio.replace("www.", "");
        const datos_buscar_dominio = {
            nombre: dominio
        }
        const datos_obtener_dominio = {
            pais: 1,
            idioma: 1
        }
        const existe_dominio = await dominioDao.buscar_dominio_pasarela(datos_buscar_dominio, datos_obtener_dominio);

        if(existe_dominio){
            return respuesta_envio_api( true, "SUCCESS", "Se verifico correctamente", [ existe_dominio ]);
        }
        else{
            return respuesta_envio_api( false, "ERROR_NO_EXISTE_DOMINIO", "No se logró encontrar al dominio", []);
        }
    } catch (err) {
        throw new Error(err);
    }
}

async function obtener_perfil(valores_usuario){
    try {
        let { dominio_asignado } = valores_usuario;

        const datos_encontrar_dominio = {
            nombre: dominio_asignado,
            situacion: "activo"
        }

        const existe_dominio = await dominioDao.buscar_perfil_dominio(datos_encontrar_dominio);

        if(existe_dominio){
            return respuesta_envio_api( true, "SUCCESS", "Se verifico correctamente", [ existe_dominio ]);
        }
        else{
            return respuesta_envio_api( false, "ERROR_NO_EXISTE_DOMINIO", "El dominio no existe", []);
        }
    } catch (err) {
        throw new Error(err);
    }
}
async function asignar_perfil_contacto(valores_datos, valores_usuario){
    try {
        const lsErrors = validar_asignar_perfil_contacto(valores_datos);
            
        if (lsErrors.length != 0) return respuesta_envio_api( false, "ERROR_CAMPOS_INVALIDOS", "Los campos ingresados son invalidos", []);

        const { _id, dominio_asignado } = valores_usuario;

        const datos_encontrar_dominio = {
            nombre: dominio_asignado,
            situacion: "activo"
        }

        const existe_dominio = await dominioDao.buscar_existe_dominio(datos_encontrar_dominio);

        if(existe_dominio){
            let { nombres, apellidos, correo_electronico, telefono, pais_codigo } = valores_datos;
            nombres = nombres.trim();
            apellidos = apellidos.trim();
            correo_electronico = correo_electronico.trim();
            telefono = telefono.trim();
            pais_codigo = pais_codigo.trim().toLowerCase();

            const datos_buscar_dominio = {
                _id: existe_dominio._id
            }

            let pais = "";
            pais_codigo = pais_codigo.toLowerCase();
            if(pais_codigo === "pe" || pais_codigo === "per"){
                pais = "perú"
            }
            const fecha_generada = new Date().toISOString();

            const datos_actualizar_dominio = {
                contacto_perfil: {
                    nombres,
                    apellidos,
                    correo_electronico,
                    telefono,
                    pais,
                    pais_codigo
                },

                usuario_modificacion: _id,
                fecha_modificacion: fecha_generada
            }

            const resultado_asignar_dominio = await dominioDao.actualizar_dominio(datos_buscar_dominio, datos_actualizar_dominio);

            if(resultado_asignar_dominio != false){
                return respuesta_envio_api( true, "SUCCESS", "Se proceso correctamente", []);
            }
            return respuesta_envio_api( false, "ERROR_ASIGNAR_DOMINIO", "No se logro asignar los valores al dominio", []);
        }
        else{
            return respuesta_envio_api( false, "ERROR_NO_EXISTE_DOMINIO", "El dominio no existe", []);
        }
    } catch (err) {
        throw new Error(err);
    }
}
async function asignar_perfil_tienda(valores_datos, valores_usuario){
    try {
        const lsErrors = validar_asignar_perfil_tienda(valores_datos);
            
        if (lsErrors.length != 0) return respuesta_envio_api( false, "ERROR_CAMPOS_INVALIDOS", "Los campos ingresados son invalidos", []);
        let { _id, dominio_asignado } = valores_usuario;

        const datos_encontrar_dominio = {
            nombre: dominio_asignado,
            situacion: "activo"
        }

        const existe_dominio = await dominioDao.buscar_existe_dominio(datos_encontrar_dominio);

        if(existe_dominio){
            let { nombre_comercial, correo_ordenes, correo_ordenes_titulo, tipo } = valores_datos;
            nombre_comercial = nombre_comercial.trim();
            correo_ordenes = correo_ordenes.trim().toLowerCase();
            correo_ordenes_titulo = correo_ordenes_titulo.trim();
            tipo = tipo.trim().toLowerCase();

            const datos_buscar_dominio = {
                _id: existe_dominio._id
            }
            const fecha_generada = new Date().toISOString();

            const datos_actualizar_dominio = {
                nombre_comercial,
                correo_ordenes,
                correo_ordenes_titulo,
                tipo,

                usuario_modificacion: _id,
                fecha_modificacion: fecha_generada
            }

            const resultado_asignar_dominio = await dominioDao.actualizar_dominio(datos_buscar_dominio, datos_actualizar_dominio);

            if(resultado_asignar_dominio != false){
                return respuesta_envio_api( true, "SUCCESS", "Se proceso correctamente", []);
            }
            return respuesta_envio_api( false, "ERROR_ASIGNAR_DOMINIO", "No se logro asignar los valores al dominio", []);
        }
        else{
            return respuesta_envio_api( false, "ERROR_DOMINIO_INVALIDO", "El dominio no existe o esta desactivado", []);
        }
    } catch (err) {
        throw new Error(err);
    }
}
async function obtener_facturacion(valores_usuario){
    try {
        let { dominio_asignado } = valores_usuario;

        const datos_encontrar_dominio = {
            nombre: dominio_asignado,
            situacion: "activo"
        }

        const existe_dominio = await dominioDao.buscar_facturacion_dominio(datos_encontrar_dominio);

        if(existe_dominio){
            return respuesta_envio_api( true, "SUCCESS", "Se verifico correctamente", [ existe_dominio ]);
        }
        else{
            return respuesta_envio_api( false, "ERROR_NO_EXISTE_DOMINIO", "El dominio no existe", []);
        }
    } catch (err) {
        throw new Error(err);
    }
}
async function asignar_facturacion_datos(valores_datos, valores_usuario){
    try {
        //onst { documento_tipo, datos } = valores_datos;

        const lsErrors = validar_asignar_facturacion_datos(valores_datos);
        if (lsErrors.length != 0) return respuesta_envio_api( false, "ERROR_CAMPOS_INVALIDOS", "Los campos ingresados son invalidos", []);

        let { _id, dominio_asignado } = valores_usuario;

        const datos_encontrar_dominio = {
            nombre: dominio_asignado,
            situacion: "activo"
        }

        const existe_dominio = await dominioDao.buscar_existe_dominio(datos_encontrar_dominio);

        if(existe_dominio){

            let { documento_tipo, datos } = valores_datos;
            documento_tipo = documento_tipo.trim();

            datos.nombre = datos.nombre.trim();
            datos.documento_numero = datos.documento_numero.trim();
            datos.direccion = datos.direccion.trim();
            datos.pais_codigo = datos.pais_codigo.trim();
            datos.departamento_codigo = datos.departamento_codigo.trim();
            datos.provincia_codigo = datos.provincia_codigo.trim();
            datos.distrito_codigo = datos.distrito_codigo.trim();

            const datos_buscar_dominio = {
                _id: existe_dominio._id
            }
            const fecha_generada = new Date().toISOString();

            const datos_actualizar_dominio = {
                "facturacion.documento_tipo": documento_tipo,
                "facturacion.datos": datos,

                usuario_modificacion: _id,
                fecha_modificacion: fecha_generada
            }

            const resultado_asignar_dominio = await dominioDao.actualizar_dominio(datos_buscar_dominio, datos_actualizar_dominio);

            if(resultado_asignar_dominio != false){
                return respuesta_envio_api( true, "SUCCESS", "Se proceso correctamente", []);
            }
            return respuesta_envio_api( false, "ERROR_ASIGNAR_DOMINIO", "No se logro asignar los valores al dominio", []);
        }
        else{
            return respuesta_envio_api( false, "ERROR_DOMINIO_INVALIDO", "El dominio no existe o esta desactivado", []);
        }
    } catch (err) {
        throw new Error(err);
    }
}
async function asignar_facturacion_contacto(valores_datos, valores_usuario){
    try {
        const lsErrors = validar_asignar_perfil_facturacion(valores_datos);
        if (lsErrors.length != 0) return respuesta_envio_api( false, "ERROR_CAMPOS_INVALIDOS", "Los campos ingresados son invalidos", []);

        let { _id, dominio_asignado } = valores_usuario;

        const datos_encontrar_dominio = {
            nombre: dominio_asignado,
            situacion: "activo"
        }

        const existe_dominio = await dominioDao.buscar_existe_dominio(datos_encontrar_dominio);

        if(existe_dominio){
            valores_datos.nombres = valores_datos.nombres.trim();
            valores_datos.apellidos = valores_datos.apellidos.trim();
            valores_datos.correo_electronico = valores_datos.correo_electronico.trim().toLowerCase();
            valores_datos.telefono = valores_datos.telefono.trim();

            const datos_buscar_dominio = {
                _id: existe_dominio._id
            }
            const fecha_generada = new Date().toISOString();

            const datos_actualizar_dominio = {
                "facturacion.contacto": valores_datos,

                usuario_modificacion: _id,
                fecha_modificacion: fecha_generada
            }

            const resultado_asignar_dominio = await dominioDao.actualizar_dominio(datos_buscar_dominio, datos_actualizar_dominio);

            if(resultado_asignar_dominio != false){
                return respuesta_envio_api( true, "SUCCESS", "Se proceso correctamente", []);
            }
            return respuesta_envio_api( false, "ERROR_ASIGNAR_DOMINIO", "No se logro asignar los valores al dominio", []);
        }
        else{
            return respuesta_envio_api( false, "ERROR_DOMINIO_INVALIDO", "El dominio no existe o esta desactivado", []);
        }
    } catch (err) {
        throw new Error(err);
    }
}
async function obtener_idiomas_formatos(valores_usuario){
    try {
        let { dominio_asignado } = valores_usuario;

        const datos_encontrar_dominio = {
            nombre: dominio_asignado,
            situacion: "activo"
        }

        const existe_dominio = await dominioDao.buscar_idiomas_formatos_dominio(datos_encontrar_dominio);

        if(existe_dominio){
            return respuesta_envio_api( true, "SUCCESS", "Se verifico correctamente", [ existe_dominio ]);
        }
        else{
            return respuesta_envio_api( false, "ERROR_NO_EXISTE_DOMINIO", "El dominio no existe", []);
        }
    } catch (err) {
        throw new Error(err);
    }
}
async function asignar_idiomas_formatos_datos(valores_datos, valores_usuario){
    try {
        const lsErrors = validar_asignar_idiomas_formatos_datos(valores_datos);
        if (lsErrors.length != 0) return respuesta_envio_api( false, "ERROR_CAMPOS_INVALIDOS", "Los campos ingresados son invalidos", []);
        
        let { _id, dominio_asignado } = valores_usuario;

        const datos_encontrar_dominio = {
            nombre: dominio_asignado,
            situacion: "activo"
        }

        const existe_dominio = await dominioDao.buscar_existe_dominio(datos_encontrar_dominio);

        if(existe_dominio){
            let { pais_codigo, idioma_codigo, moneda_codigo, unidad_peso_codigo, unidad_medida_codigo } = valores_datos;
            pais_codigo = pais_codigo.trim().toLowerCase();
            idioma_codigo = idioma_codigo.trim().toLowerCase();
            moneda_codigo = moneda_codigo.trim().toLowerCase();
            unidad_peso_codigo = unidad_peso_codigo.trim().toLowerCase();
            unidad_medida_codigo = unidad_medida_codigo.trim().toLowerCase();

            const datos_buscar_dominio = {
                _id: existe_dominio._id
            }
            const fecha_generada = new Date().toISOString();

            const datos_actualizar_dominio = {
                pais_codigo,
                idioma_codigo,
                moneda_codigo,
                unidad_peso_codigo,
                unidad_medida_codigo,

                usuario_modificacion: _id,
                fecha_modificacion: fecha_generada
            }

            const resultado_asignar_dominio = await dominioDao.actualizar_dominio(datos_buscar_dominio, datos_actualizar_dominio);

            if(resultado_asignar_dominio != false){
                return respuesta_envio_api( true, "SUCCESS", "Se proceso correctamente", []);
            }
            return respuesta_envio_api( false, "ERROR_ASIGNAR_DOMINIO", "No se logro asignar los valores al dominio", []);
        }
        else{
            return respuesta_envio_api( false, "ERROR_DOMINIO_INVALIDO", "El dominio no existe o esta desactivado", []);
        }
    } catch (err) {
        throw new Error(err);
    }
}

async function  asignar_billetera_movil(valores_datos, valores_usuario){
    try {
        const lsErrors = validar_asignar_billetera_movil(valores_datos);
        if (lsErrors.length != 0) return respuesta_envio_api( false, "ERROR_CAMPOS_INVALIDOS", "Los campos ingresados son invalidos", []);
        
        let { nombre } = valores_datos;

        nombre = nombre ? nombre.toLowerCase() : "";
        nombre = nombre.replace("www.", "");

        const datos_buscar = {
            nombre
        }

        const existe_dominio = await dominioDao.existe_dominio(datos_buscar);

        if(existe_dominio){
            const { monto_cobro, monto_fin, monto_porcentaje_venta, frecuencia, frecuencia_numero, pasarela } = valores_datos;
            const { _id } = valores_usuario;
            const fecha_generada = new Date().toISOString();

            const datos_asignar = {
                "billetera_movil.monto_cobro": monto_cobro,
                "billetera_movil.monto_fin": monto_fin,
                "billetera_movil.monto_porcentaje_venta": monto_porcentaje_venta,
                "billetera_movil.frecuencia": frecuencia,
                "billetera_movil.frecuencia_numero": frecuencia_numero,
                "billetera_movil.pasarela": pasarela,

                "billetera_movil.estado": "activo",

                usuario_modificacion: _id,
                fecha_modificacion: fecha_generada
            }

            const datos_buscar_dominio = {
                _id: existe_dominio._id
            }

            const resultado_asignar_dominio = await dominioDao.actualizar_dominio(datos_buscar_dominio, datos_asignar);

            if(resultado_asignar_dominio){
                return respuesta_envio_api( true, "SUCCESS", "Se realizo correctamente", []);
            }
            return respuesta_envio_api( false, "ERROR_ASIGNAR_DOMINIO", "No se logro procesar", []);
        }
        else{
            return respuesta_envio_api( false, "ERROR_EXISTE_DOMINIO", "El dominio ya existe", []);
        }
    } catch (err) {
        throw new Error(err);
    }
}
async function  generar_pagos_billetera_movil(){
    try {
        const datos_buscar = {
            tipo_pago: "prepago"
        }

        const existe_dominio = await dominioDao.buscar_dominio_billetera_movil(datos_buscar);

        for(var i= 0; i < existe_dominio.length; i++){
            const datos = existe_dominio[i];
            const { nombre, billetera_movil } = datos;
            const { monto_cobro, monto_alerta, monto_total, monto_pagado, monto_porcentaje_venta, frecuencia, frecuencia_numero, proximo_cobro } = billetera_movil;

            if(monto_total > monto_pagado){
                const fecha_generada = new Date().toISOString();
                if(proximo_cobro === fecha_generada){

                }
            }            
            const resultado_asignar_dominio = await dominioDao.actualizar_dominio(datos_buscar_dominio, datos_asignar);

            if(resultado_asignar_dominio){
                return respuesta_envio_api( true, "SUCCESS", "Se realizo correctamente", []);
            }
            return respuesta_envio_api( false, "ERROR_ASIGNAR_DOMINIO", "No se logro procesar", []);
        }
        return respuesta_envio_api( false, "ERROR_EXISTE_DOMINIO", "El dominio ya existe", []);
    } catch (err) {
        throw new Error(err);
    }
}
module.exports = {
    async asignar_dominio(req, res){
        try {
            const valores = req.body;

            const info = await asignar_dominio(valores);
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
    async validar_paginas_dominio(valores, req){
        try {
            const info = await validar_paginas_dominio(valores, req);
            return info;
        } catch (err) {
            throw new Error(err);
        }
    },

    async obtener_perfil(req, res){
        try {
            const valores_usuario = req.user;

            const info = await obtener_perfil(valores_usuario);
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
    async asignar_perfil_contacto(req, res){
        try {
            const valores_datos = req.body;
            const valores_usuario = req.user;

            const info = await asignar_perfil_contacto(valores_datos, valores_usuario);
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
    async asignar_perfil_tienda(req, res){
        try {
            const valores_datos = req.body;
            const valores_usuario = req.user;

            const info = await asignar_perfil_tienda(valores_datos, valores_usuario);
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
    async obtener_facturacion(req, res){
        try {
            const valores_usuario = req.user;

            const info = await obtener_facturacion(valores_usuario);
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
    async asignar_facturacion_datos(req, res){
        try {
            const valores_datos = req.body;
            const valores_usuario = req.user;

            const info = await asignar_facturacion_datos(valores_datos, valores_usuario);
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
    async asignar_facturacion_contacto(req, res){
        try {
            const valores_datos = req.body;
            const valores_usuario = req.user;

            const info = await asignar_facturacion_contacto(valores_datos, valores_usuario);
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
    async obtener_idiomas_formatos(req, res){
        try {
            const valores_usuario = req.user;

            const info = await obtener_idiomas_formatos(valores_usuario);
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
    async asignar_idiomas_formatos_datos(req, res){
        try {
            const valores_datos = req.body;
            const valores_usuario = req.user;

            const info = await asignar_idiomas_formatos_datos(valores_datos, valores_usuario);
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

    async asignar_billetera_movil(req, res){
        try {
            const valores_datos = req.body;
            const valores_usuario = req.user;

            const info = await asignar_billetera_movil(valores_datos, valores_usuario);
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
}