const express = require("express");
const router = express.Router();

const  UserAuth = require('../middlewares/auth');
const  system_auth = require('../middlewares/auth-public');

const controller = require("./controller");

router.get("/", controller.obtener_clientes_candidatos);
//router.post("/", UserAuth, controller.crear_cliente_candidato);
router.post("/", controller.crear_cliente_candidato);

module.exports = router;