const express = require("express");
const { register, login, getUserById,updateDataUserById, followingUser, getAllUser,getPostByFollowing} = require("../controllers/Users");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const usersRouter = express.Router();


usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.get("/:id",authentication, getUserById);
usersRouter.put("/:id",authentication, updateDataUserById);
usersRouter.get("/:myId/:userId", authentication, followingUser);
usersRouter.get("/", authentication, getAllUser);
usersRouter.get("/follow/user/:id", authentication, getPostByFollowing);
module.exports = usersRouter;