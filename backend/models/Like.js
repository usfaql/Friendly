const mongoose = require("mongoose");

const likeModel = new mongoose.Schema({
    admirer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
})

module.exports = mongoose.model("Like", likeModel);
