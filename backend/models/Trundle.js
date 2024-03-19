const mongoose = require("mongoose");

const trundleModel = new mongoose.Schema({
    content : {type: String},
    video : {type: String, require : true},
    author : {type: mongoose.Schema.Types.ObjectId, ref : "User"},
    dateTrundle : {type: String},
    likes : [{type : mongoose.Schema.Types.ObjectId, ref:"User"}]
});
module.exports = mongoose.model("Trundle", trundleModel);
