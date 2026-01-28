const mongoose = require("mongoose");

const PrivateMessagesModel = new mongoose.Schema({
    coach_id : {type : String},
    user_id : {type : String},
    messages: [{
    from : {type : String},
    room : {type : String},
    name : {type : String},
    image : {type : String},
    message : { type: String },
    image_message : {type : String, default : null},
    created_at : { type: Date, default: Date.now }
    }]
})

module.exports = mongoose.model("MessagesPrivate", PrivateMessagesModel)