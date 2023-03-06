import * as express from "express";
import {
  createUser,
  Login,
  getProfileDetails,
  logout,
  getAccessToken
} from "../controllers/usersController";
import { Auth } from "./../middlewares/Auth";

let router = express.Router();

// router.get("/", Auth, updateUser);
router.get("/logout", Auth, logout);

router.post("/signup",  createUser);
router.post("/login", Login);
router.post("/newtoken", getAccessToken);

router.get("/me", Auth, getProfileDetails);


export = router;
