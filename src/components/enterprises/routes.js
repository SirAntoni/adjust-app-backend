const express = require("express");
const router = express.Router();

const  UserAuth = require('../middlewares/auth');
const  system_auth = require('../middlewares/auth-public');

const controller = require("./controller");

router.get("/", controller.obtener_empresas);
router.post("/", UserAuth, controller.crear_empresa);

module.exports = router;