

import express from "express";
import { authRouter } from "./auth/controller.js";
import { testRouter } from "./test/controller.js";
import { chatRouter } from "./chat/route.js";

export const mainRouter = express.Router();




mainRouter.use("/auth", authRouter);
mainRouter.use("/test", testRouter);
mainRouter.use("/chat", chatRouter );  // chat.e
mainRouter.use((req, res) => {
    res.status(404).json({
        error: "Invalid route"
    });
});


// mainRouter.use( "/chat", chatRouter );




