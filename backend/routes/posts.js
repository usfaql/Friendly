const express = require("express");
const {createPost, getAllPosts, getAllPostByAuthor, getPostById, updatePostById, deletePostById} = require("../controllers/posts");
const {createLike} = require("../controllers/likes");
const {createNewComment, getCommentById} = require("../controllers/comments");
const {authentication} = require("../middleware/authentication");
const authorization = require("../middleware/authorization");

const postsRouter = express.Router();

postsRouter.post("/create", authentication ,createPost);
postsRouter.get("/",authentication, getAllPosts);
postsRouter.get("/search_1/:author",authentication, getAllPostByAuthor);
postsRouter.get("/search_2/:id",authentication, getPostById);
postsRouter.put("/:id",authentication, updatePostById);
postsRouter.delete("/:id/:iduser",authentication, deletePostById);

postsRouter.get("/:id/like", authentication, createLike);
postsRouter.post("/:id/comment", authentication, createNewComment);
postsRouter.get("/comment/:id", authentication, getCommentById);


module.exports = postsRouter;