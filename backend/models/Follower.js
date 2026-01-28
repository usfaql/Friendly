const mongoose = require("mongoose");

const followerModel = new mongoose.Schema({
    followerUserId : {type: mongoose.Schema.Types.ObjectId, ref: "User"}
})

module.exports = mongoose.model("Follower", followerModel);