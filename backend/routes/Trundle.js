const express = require("express");
const {
    createTrundle,
    getAllTrundle,
    getAllTrundleByAuthor,
    getTrundleById,
    deleteTrundleById
} = require("../controllers/Trundle");
const {createLike, createLikeForTrundle} = require("../controllers/likes");
const authentication = require("../middleware/authentication");

const trundleRouter = express.Router();

trundleRouter.post("/create", authentication ,createTrundle);
trundleRouter.get("/",authentication, getAllTrundle);
trundleRouter.get("/search_1/:author",authentication, getAllTrundleByAuthor);
trundleRouter.get("/search_2/:id",authentication, getTrundleById);
trundleRouter.delete("/trundle/:id/:iduser",authentication, deleteTrundleById);

trundleRouter.get("/:id/like", authentication, createLikeForTrundle);

module.exports = trundleRouter;