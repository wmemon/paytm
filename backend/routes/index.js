const express = require("express");
const { userRouter } = require("./user");
const accountRouter = require("./account");

const MainRouter = express.Router();
MainRouter.use("/user", userRouter);
MainRouter.use("/account", accountRouter);
module.exports = {MainRouter};