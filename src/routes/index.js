const express = require("express")
const router = express.Router();

const enterprisesRouter = require("../components/enterprises/routes");

router.use("/enterprises", enterprisesRouter);

module.exports = router;
