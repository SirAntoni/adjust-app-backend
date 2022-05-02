const express = require("express");
const router = express.Router();

const  UserAuth = require('../middlewares/auth');

const controller = require("./controller");

router.post("/registro", UserAuth, controller.asignar_dominio);

router.put("/billetera-movil", UserAuth, controller.asignar_billetera_movil);

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
