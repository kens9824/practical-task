import * as express from "express";
import {  getRandomJoke

} from "../controllers/JokeController";
import { Auth } from "../middlewares/Auth";

let router = express.Router();

router.get("/", Auth, getRandomJoke);



export = router;
