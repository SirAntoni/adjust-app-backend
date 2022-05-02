const express = require("express");
const router = require("./routes");
const helmet = require("helmet");
const cors = require('cors');
require("./db.js");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "2kb" }));

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(helmet());

app.use("/", router);

module.exports = app;
