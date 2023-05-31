const express = require("express");
const router = express.Router();

const controller = require("./controller");

//Años
router.get("/", controller.obtener_modelos);
router.get("/:uuid", controller.obtener_modelo);
router.post("/", controller.crear_modelo);
router.put("/:uuid", controller.actualizar_modelo);
router.delete("/:uuid", controller.eliminar_modelo);

module.exports = router;