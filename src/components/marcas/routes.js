const express = require("express");
const router = express.Router();

const controller = require("./controller");

//Marcas
router.get("/", controller.obtener_marcas);
router.get("/:uuid", controller.obtener_marca);
router.post("/", controller.crear_marca);
router.put("/:uuid", controller.actualizar_marca);
router.delete("/:uuid", controller.eliminar_marca);

module.exports = router;