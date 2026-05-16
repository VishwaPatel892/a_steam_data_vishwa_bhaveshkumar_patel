const express = require("express");
const gameRoutes = require("./game.routes");

const router = express.Router();

router.use("/games", gameRoutes);

module.exports = router;
