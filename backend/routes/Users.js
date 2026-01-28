const express = require("express");
const { 
    register, 
    login, 
    getUserById,
    updateDataUserById, 
    followingUser, 
    getAllUser,
    getPostByFollowing, 
    getFollowingUser,
    getMessageByPrivate,
    getFollowerUser,
    updateStatusOnline} = require("../controllers/Users");
const {authentication, auth} = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const usersRouter = express.Router();


usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.get("/:id",authentication, getUserById);
usersRouter.put("/:id",authentication, updateDataUserById);
usersRouter.get("/:myId/:userId", authentication, followingUser);
usersRouter.get("/", authentication, getAllUser);
usersRouter.get("/follow/user/:id", authentication, getPostByFollowing);
usersRouter.get('/message/:coach_id/:user_id',authentication,getMessageByPrivate);
usersRouter.put('/:id/status', authentication,updateStatusOnline);
module.exports = usersRouter;
