

const express = require("express");
const { authRouter } = require("./auth/controller.js")
const { chatRouter } = require("./chat/controller.js")
const { workoutRouter } = require("./workout/controller.js")
const { productRouter } = require("./products/controller.js")



const mainRouter = express.Router();


mainRouter.use( "/auth", authRouter );
mainRouter.use( "/chat", chatRouter );
mainRouter.use( "/workout", workoutRouter );
mainRouter.use( "/products", productRouter );

// mainRouter.use( "/chat", chatRouter );

module.exports = { mainRouter } ;

