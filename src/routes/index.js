const express = require("express")
const router = express.Router();

const domainsRouter = require("../components/domains/routes");
const transactions_router = require("../components/transactions/routes");
const plansRouter = require("../components/plans/routes");

router.use("/domains", domainsRouter);
router.use("/transactions", transactions_router);
router.use("/plans", plansRouter);

module.exports = router;
