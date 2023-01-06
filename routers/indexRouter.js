const express = require("express");
const indexRouter = express.Router();
const indexController = require("../controllers/IndexController");

indexRouter.get("/", indexController.Index);
indexRouter.get("/about");

module.exports = indexRouter;