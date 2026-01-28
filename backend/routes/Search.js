const express = require("express");
const {searchByNameUserOrContentPost} = require("../controllers/Search");
const {authentication} = require("../middleware/authentication");

const searchRouter = express.Router();

searchRouter.post("/v1", searchByNameUserOrContentPost);

module.exports = searchRouter;