const express = require("express");
const router = express.Router();

const  UserAuth = require('../middlewares/auth');

const controller = require("./controller");

router.post("/agregar", UserAuth, controller.agregar);
router.get("/listar-fechas", UserAuth, controller.listar_fechas);

module.exports = router;
