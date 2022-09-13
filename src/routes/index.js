const express = require("express")
const router = express.Router();

const enterprisesRouter = require("../components/enterprises/routes");
const candidatesClientsRouter = require("../components/candidate_clients/routes");

router.use("/enterprises", enterprisesRouter);
router.use("/candidate_clients", candidatesClientsRouter);

module.exports = router;
