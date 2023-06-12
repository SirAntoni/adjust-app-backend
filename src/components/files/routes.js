const express = require("express");
const router = express.Router();

const controller = require("./controller");

//imagenes
router.get("/:name", controller.obtener_imagen);
router.post("/", controller.subir_imagen);

module.exports = router;