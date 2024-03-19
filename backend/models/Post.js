const mongoose = require("mongoose");

const postModel = new mongoose.Schema({
    content : {type: String},
    image : {type: String},
    author : {type: mongoose.Schema.Types.ObjectId, ref : "User"},
    datePost : {type: String},
    likes : [{type : mongoose.Schema.Types.ObjectId, ref:"User"}],
    comments : [{type: mongoose.Schema.Types.ObjectId, ref:"Comment"}]
})

module.exports = mongoose.model("Posts", postModel);
