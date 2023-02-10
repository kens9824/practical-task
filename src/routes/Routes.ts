import * as express from "express";
import usersRouter from "./usersRoutes";
import jokeRouter from "./jokeRoutes";

let router = express.Router();

router.use("/user", usersRouter);
router.use("/random-joke", jokeRouter);


export = router;