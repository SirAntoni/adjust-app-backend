const express = require("express");
const router = express.Router();

const controller = require("./controller");

//Años
router.get("/", controller.obtener_anios);
router.get("/:uuid", controller.obtener_anio);
router.post("/", controller.crear_anio);
router.put("/:uuid", controller.actualizar_anio);
router.delete("/:uuid", controller.eliminar_anio);

module.exports = router;