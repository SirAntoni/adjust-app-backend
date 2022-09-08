const dominioDao = require("./dao");
const controlador_transacion = require("../transactions/controller");

const { respuesta_envio_api } = require("../../utils/error");
const { validar_asignar_perfil_contacto, validar_asignar_perfil_tienda, validar_asignar_idiomas_formatos_datos, validar_asignar_facturacion_datos, validar_asignar_perfil_facturacion, validar_asignar_billetera_movil } = require("./validations");

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
async function buscar_dominio(valores){
    try {
        let { dominio } = valores;

        dominio = dominio ? dominio.toLowerCase() : "";
        dominio = dominio.replace("www.", "");
        const datos_encontrar_dominio = {
            nombre: dominio
        }

        const existe_dominio = await dominioDao.buscar_dominio(datos_encontrar_dominio);

        if(existe_dominio){
            return respuesta_envio_api( true, "SUCCESS", "Se verifico correctamente", existe_dominio);
        }
        else{
            return respuesta_envio_api( false, "ERROR_NO_EXISTE_DOMINIO", "No se logró encontrar al dominio", null);
        }
    } catch (err) {
        throw new Error(err);
    }
}
async function buscar_dominio_integracion(valores){
    try {
        let { dominio, campos } = valores;

        dominio = dominio ? dominio.toLowerCase() : "";
        dominio = dominio.replace("www.", "");
        const datos_encontrar_dominio = {
            nombre: dominio,
            situacion: ["activo", "parcial"]
        }

        const existe_dominio = await dominioDao.buscar_dominio_integracion(datos_encontrar_dominio, campos);

        if(existe_dominio){
            return respuesta_envio_api( true, "SUCCESS", "Se verifico correctamente", existe_dominio);
        }
        else{
            return respuesta_envio_api( false, "ERROR_NO_EXISTE_DOMINIO", "No se logró encontrar al dominio", null);
        }
    } catch (err) {
        throw new Error(err);
    }
}
async function obtener_paginas_dominio(valores){
    try {
        let { pagina, plan } = valores;

        const datos_encontrar_paginas = {
            plan
        }
        const resultado_obtener_paginas_ = await dominioDao.obtener_paginas_dominio(datos_encontrar_paginas);

        const ExistingTrack = resultado_obtener_paginas_.filter(key => key == pagina);

        if(ExistingTrack.length != 0){
            return respuesta_envio_api( true, "SUCCESS", "Se verifico correctamente", null);
        }
        return respuesta_envio_api( false, "ERROR_NO_EXISTE_PAGINA_VALIDA_PLAN", "No se logró encontrar al pagina valida", null);
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

        const existe_dominio = await dominioDao.existe_dominio_venta_dominio(datos_buscar);

        if(existe_dominio){
            const { monto_cobrar, monto_alerta, monto_porcentaje_venta, frecuencia, frecuencia_numero } = valores_datos;
            // const { _id } = valores_usuario;
            const fecha_generada = new Date();
            let nueva_fecha = new Date(fecha_generada);
            nueva_fecha = new Date(nueva_fecha.setHours(0, 0, 0, 0));
            let proximo_cobro;
            switch(frecuencia){
                case 'dias':
                    proximo_cobro = new Date(nueva_fecha.setDate(nueva_fecha.getDate() + frecuencia_numero));
                break;
                case 'semanas':
                    proximo_cobro = new Date(nueva_fecha.setDate(nueva_fecha.getDate() + frecuencia_numero*7));
                break;
                case 'meses':
                    proximo_cobro = new Date(nueva_fecha.setMonth(nueva_fecha.getMonth() + frecuencia_numero));
                break;
                case 'anos':
                    proximo_cobro = new Date(nueva_fecha.setFullYear(nueva_fecha.getFullYear() + frecuencia_numero));
                break;
                                        
            }
            const datos_asignar = {
                tipo_pago: "prepago",
                billetera_movil: {
                    monto_cobrar: monto_cobrar.toFixed(2),
                    saldo: 0.00,
                    //monto_pagado: 0.00,
                    monto_alerta: monto_alerta.toFixed(2),
                    monto_porcentaje_venta: (monto_porcentaje_venta/100).toFixed(2),
                    frecuencia: frecuencia,
                    frecuencia_numero: frecuencia_numero,
                    //"billetera_movil.pasarela": pasarela,
                    fecha_cobro_inicial: proximo_cobro.toISOString(),
                    proximo_cobro: proximo_cobro.toISOString()
                },

                //usuario_modificacion: _id,
                situacion: "activo",
                fecha_modificacion: fecha_generada.toISOString()
            }

            const datos_buscar_dominio = {
                nombre
            }

            const resultado_asignar_dominio = await dominioDao.actualizar_dominio(datos_buscar_dominio, datos_asignar);

            if(resultado_asignar_dominio){
                return respuesta_envio_api( true, "SUCCESS", "Se realizo correctamente", null);
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
async function actualizar_billetera_movil(valores_datos){
    try {
        let { nombre } = valores_datos;

        nombre = nombre ? nombre.toLowerCase() : "";
        nombre = nombre.replace("www.", "");

        const datos_buscar = {
            nombre
        }

        const existe_dominio = await dominioDao.existe_dominio_venta_dominio_venta_recurrente(datos_buscar);

        if(existe_dominio){
            const { saldo, frecuencia, frecuencia_numero } = existe_dominio.billetera_movil;
            // const { _id } = valores_usuario;
            const fecha_generada = new Date();
            let nueva_fecha = new Date(fecha_generada);
            nueva_fecha = new Date(nueva_fecha.setHours(0, 0, 0, 0));
            let proximo_cobro;
            switch(frecuencia){
                case 'dias':
                    proximo_cobro = new Date(nueva_fecha.setDate(nueva_fecha.getDate() + frecuencia_numero));
                break;
                case 'semanas':
                    proximo_cobro = new Date(nueva_fecha.setDate(nueva_fecha.getDate() + frecuencia_numero*7));
                break;
                case 'meses':
                    proximo_cobro = new Date(nueva_fecha.setMonth(nueva_fecha.getMonth() + frecuencia_numero));
                break;
                case 'anos':
                    proximo_cobro = new Date(nueva_fecha.setFullYear(nueva_fecha.getFullYear() + frecuencia_numero));
                break;
                                        
            }
            const datos_asignar = {
                "billetera_movil.proximo_cobro": proximo_cobro.toISOString(),
                fecha_modificacion: fecha_generada.toISOString()
            }
            const datos_buscar_dominio = {
                nombre
            }

            const resultado_asignar_dominio = await dominioDao.actualizar_dominio(datos_buscar_dominio, datos_asignar);
            return resultado_asignar_dominio;
        }
        else{
            return false;
        }
    } catch (err) {
        throw new Error(err);
    }
}
async function actualizar_billetera_movil_datos(valores_datos){
    try {
        let { nombre, monto, fecha_modificacion } = valores_datos;

        nombre = nombre ? nombre.toLowerCase() : "";
        nombre = nombre.replace("www.", "");

        const datos_buscar = {
            nombre
        }

        const existe_dominio = await dominioDao.existe_dominio_venta_dominio_venta_recurrente(datos_buscar);

        if(existe_dominio){
            const { saldo } = existe_dominio.billetera_movil;
            // const { _id } = valores_usuario;
            const saldo_actual = parseFloat(saldo) + parseFloat(monto);
            if(saldo_actual > 0){
                const datos_asignar = {
                    "billetera_movil.saldo": saldo_actual,
                    fecha_modificacion
                }
                const datos_buscar_dominio = {
                    nombre
                }
    
                const resultado_asignar_dominio = await dominioDao.actualizar_dominio(datos_buscar_dominio, datos_asignar);
                return resultado_asignar_dominio;
            }
            else{
                const datos_asignar = {
                    "billetera_movil.saldo": saldo_actual,
                    estado: "parcial",
                    fecha_modificacion
                }
                const datos_buscar_dominio = {
                    nombre
                }
    
                const resultado_asignar_dominio = await dominioDao.actualizar_dominio(datos_buscar_dominio, datos_asignar);
                return resultado_asignar_dominio;
            }
        }
        else{
            return false;
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
            const { nombre, moneda_codigo, billetera_movil } = datos;
            let { monto_cobrar, proximo_cobro } = billetera_movil;
            const fecha_generada = new Date();
            proximo_cobro = new Date(proximo_cobro);
            if(fecha_generada >= proximo_cobro){
                const datos_asignar_transaccion = {
                    origen : nombre,
                    dominio: nombre,

                    tipo_movimiento: "ingreso",
                    dominio: nombre,
                    motivo: "Cobro prepago",
                    observacion: "Cobro prepago de dominio",
                    moneda: moneda_codigo,
                    monto: monto_cobrar.toFixed(2)
                    //monto_tipo_cambio
                }
                const resultado_asignar_transaccion = await controlador_transacion.agregar_datos(datos_asignar_transaccion, null);
                if(resultado_asignar_transaccion){
                    const datos_actualizar = {
                        nombre,
                        //monto: monto_cobrar.toFixed(2)
                    }
                    const resultado_actualizar_billetera_movil = await actualizar_billetera_movil(datos_actualizar);
                    // if(resultado_actualizar_billetera_movil && monto_pagado >= monto_alerta){
                    //     const datos_email = {
                    //         correo,
                    //         dominio: nombre
                    //     }
                    //     const resultado_email = await userDao.enviar_correo_alerta_transaccion(datos_email);

                    //     // if(resultado_email != true){
                    //     //     return respuesta_envio_api( false, "ERROR_ASIGNAR_DOMINIO", "No se logro procesar", null);
                    //     // }
                    // }
                    // return respuesta_envio_api( true, "SUCCESS", "Se realizo correctamente", null);
                }
                // return respuesta_envio_api( false, "ERROR_ASIGNAR_DOMINIO", "No se logro procesar", null);
            }
        }
        return respuesta_envio_api( true, "SUCCESS", "Se realizo correctamente", null);
    } catch (err) {
        throw new Error(err);
    }
}
async function  generar_movimientos_comision_venta(valores_datos){
    try {
        let { dominio, observacion, monto} = valores_datos;
        const datos_buscar = {
            nombre: dominio
        }

        const existe_dominio = await dominioDao.buscar_dominio_movimiento(datos_buscar);

        if(existe_dominio){
            const { nombre, moneda_codigo, billetera_movil } = existe_dominio;
            const { monto_porcentaje_venta } = billetera_movil;
            monto = monto * monto_porcentaje_venta;
            const datos_asignar_transaccion = {
                origen : nombre,
                dominio: nombre,

                tipo_movimiento: "egreso",
                motivo: "Comision por venta",
                observacion,
                moneda: moneda_codigo,
                monto: monto.toFixed(2)
                //monto_tipo_cambio
            }
            const resultado_asignar_transaccion = await controlador_transacion.agregar_datos(datos_asignar_transaccion, null);
            if(resultado_asignar_transaccion){
                return respuesta_envio_api( true, "SUCCESS", "Se realizo correctamente", null);
            }
            return respuesta_envio_api( false, "ERROR_ASIGNAR_DOMINIO", "No se logro procesar", null);
        }
        return respuesta_envio_api( false, "ERROR_ASIGNAR_DOMINIO", "No se logro procesar", null);
    } catch (err) {
        throw new Error(err);
    }
}

async function existe_dominio(valores_datos){
    try {
        let { dominio } = valores_datos;
        const datos_buscar = {
            nombre: dominio
        }

        const existe_dominio = await dominioDao.existe_dominio(datos_buscar);

        if(existe_dominio){
            return respuesta_envio_api( true, "SUCCESS", "Se realizo correctamente", null);
        }
        return respuesta_envio_api( false, "ERROR_NO_EXISTE_DOMINIO", "No se logro procesar", null);
    } catch (err) {
        throw new Error(err);
    }
}
async function obtener_dominios(){
    try {
        let resultado_obtener_dominios = await dominioDao.obtener_dominios();
        return respuesta_envio_api( true, "SUCCESS", "Se realizo correctamente", resultado_obtener_dominios);
    } catch (err) {
        throw new Error(err);
    }
}
async function obtener_nombres_dominios(){
    try {
        let resultado_obtener_dominios = await dominioDao.obtener_nombres_dominios();
        resultado_obtener_dominios = resultado_obtener_dominios.map(value => value.nombre);
        return respuesta_envio_api( true, "SUCCESS", "Se realizo correctamente", resultado_obtener_dominios);
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
    async actualizar_billetera_movil_datos(valores_datos){
        try {
            const info = await actualizar_billetera_movil_datos(valores_datos);
            return info;
        } catch (err) {
            throw new Exception(err);
        }
    },
    async generar_pagos_billetera_movil(req, res){
        try {
            const valores_datos = req.body;

            const info = await generar_pagos_billetera_movil(valores_datos);
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
    async generar_movimientos_comision_venta(req, res){
        try {
            const valores_datos = req.body;

            const info = await generar_movimientos_comision_venta(valores_datos);
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

    async existe_dominio(req, res){
        try {
            const valores_datos = req.params;

            const info = await existe_dominio(valores_datos);
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
    async obtener_dominios(req, res){
        try {
            const info = await obtener_dominios();
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
    async obtener_nombres_dominios(req, res){
        try {
            const info = await obtener_nombres_dominios();
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
    async buscar_dominio(req, res){
        try {
            const valores_datos = req.body;

            const info = await buscar_dominio(valores_datos);
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
    async buscar_dominio_integracion(req, res){
        try {
            const valores_datos = req.body;

            const info = await buscar_dominio_integracion(valores_datos);
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
    async obtener_paginas_dominio(req, res){
        try {
            const valores_datos = req.body;

            const info = await obtener_paginas_dominio(valores_datos);
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