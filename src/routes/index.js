const express = require("express")
const router = express.Router();

const marcasRouter = require("../components/marcas/routes");
const aniosRouter = require("../components/anios/routes");
const modelosRouter = require("../components/modelos/routes");
const tiposRouter = require("../components/tipos/routes");
const filesRouter = require("../components/files/routes");
const categoriasRouter = require("../components/categorias/routes");

router.use("/marcas", marcasRouter);
router.use("/anios", aniosRouter);
router.use("/modelos", modelosRouter);
router.use("/tipos", tiposRouter);
router.use("/files", filesRouter);
router.use("/categorias", categoriasRouter);


module.exports = router;
