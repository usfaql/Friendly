const mongoose = require("mongoose");

const commentModel = new mongoose.Schema({
  comment: { type: String, required: true },
  commenter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Comment", commentModel);
