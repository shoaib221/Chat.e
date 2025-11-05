

const express = require("express");
const { authRouter } = require("./auth/controller.js")
const { chatRouter } = require("./chat/controller.js")



const mainRouter = express.Router();


mainRouter.use( "/auth", authRouter );
mainRouter.use( "/chat", chatRouter );


// mainRouter.use( "/chat", chatRouter );

module.exports = { mainRouter } ;

