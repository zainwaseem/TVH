import express from "express";
const router = express.Router();
import {
  register,
  login,
  getALLUsers,
  logout,
  loggedIn,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userControllers.js";

import { isAuthenticated, isAuthorized } from "../middleware/auth.js";

router.post("/users", register);
router.post("/users/auth", login);
router.get("/users", isAuthenticated, isAuthorized("simple"), getALLUsers);
router.get("/users/:id", isAuthenticated, isAuthorized("simple"), getUser);
router.put("/users/:id", isAuthenticated, updateUser);
router.delete(
  "/users/:id",
  isAuthenticated,
  isAuthorized("simple"),
  deleteUser
);
// router.get("/users/loggedin", loggedIn);
router.get("/users/logout", logout);

export default router;
