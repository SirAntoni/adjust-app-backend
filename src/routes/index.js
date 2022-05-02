const express = require("express")
const router = express.Router();

const domainsRouter = require("../components/domains/routes");

router.use("/domains", domainsRouter);

module.exports = router;
