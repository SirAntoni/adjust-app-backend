const express = require("express");
const router = express.Router();

const controller = require("./controller");

//Años
router.get("/", controller.obtener_categorias);
// router.get("/:uuid", controller.obtener_tipo);
// router.post("/", controller.crear_tipo);
// router.put("/:uuid", controller.actualizar_tipo);
// router.delete("/:uuid", controller.eliminar_tipo);

module.exports = router;