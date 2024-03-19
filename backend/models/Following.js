const mongoose = require("mongoose");

const followingModel = new mongoose.Schema({
    followingUserId : {type: mongoose.Schema.Types.ObjectId, ref: "User"}
})

module.exports = mongoose.model("Following", followingModel);