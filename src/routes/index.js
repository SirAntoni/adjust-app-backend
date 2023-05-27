const express = require("express")
const router = express.Router();

const apiRouter = require("../components/api/routes");

router.use("/api", apiRouter);

module.exports = router;
