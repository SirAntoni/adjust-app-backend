const express = require("express");
const router = express.Router();

const  UserAuth = require('../middlewares/auth');
const  system_auth = require('../middlewares/auth-public');

const controller = require("./controller");

router.get("/", controller.obtener_dominios);
router.post("/registro", UserAuth, controller.asignar_dominio);
router.get("/existe/:dominio", controller.existe_dominio);
router.get("/obtener/nombres", controller.obtener_nombres_dominios);

router.post("/dominio/buscar", controller.buscar_dominio);
router.post("/dominio/buscar-integracion", system_auth, controller.buscar_dominio_integracion);
router.post("/dominio/paginas", controller.obtener_paginas_dominio);
router.put("/", UserAuth, controller.asignar_estado_dominio);

router.put("/billetera-movil", UserAuth, controller.asignar_billetera_movil);
router.get("/billetera-movil/pagos", controller.generar_pagos_billetera_movil);

router.put("/movimientos/comision", controller.generar_movimientos_comision_venta);

router.get("/perfil/obtener", UserAuth, controller.obtener_perfil);

router.put("/perfil/contacto", UserAuth, controller.asignar_perfil_contacto);
router.put("/perfil/tienda", UserAuth, controller.asignar_perfil_tienda);

router.get("/facturacion/obtener", UserAuth, controller.obtener_facturacion);

router.put("/facturacion/datos", UserAuth, controller.asignar_facturacion_datos);
router.put("/facturacion/contacto", UserAuth, controller.asignar_facturacion_contacto);

router.get("/idiomas-formatos/obtener", UserAuth, controller.obtener_idiomas_formatos);

router.put("/idiomas-formatos/datos", UserAuth, controller.asignar_idiomas_formatos_datos);
//router.put("/idiomas-formatos/opciones", UserAuth, controller.asignar_idiomas_formatos_opciones);

module.exports = router;
