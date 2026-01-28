const PrivateMessagesModel = require('../models/PrivateMessage')
const messageHandler = (socket, io)=>{

    socket.on('messagePrivate', (data)=>{
        console.log(data);
        data.success = true;
        data.type = "Private";
        const room = data.from.localeCompare(data.room) < 0 ? `room-${data.from}-${data.room}` : `room-${data.room}-${data.from}`;
        socket.to(room).emit("messagePrivate", data);
        socket.emit('messagePrivate', data);
        const newPrivateMessage = new PrivateMessagesModel({
            coach_id : data.from,
            user_id : data.room,
            messages : [{
                from : data.from, 
                room: data.room,
                name : data.name ,
                 image : data.image,
                 message : data.message,
                image_message : data.image_message}]
        });
        PrivateMessagesModel.findOne({coach_id: data.from, user_id: data.room}).then((result) => {
            if(result){
                PrivateMessagesModel.findOneAndUpdate(
                    { coach_id: data.from, user_id: data.room },
                    { $push: { messages: [{
                        from : data.from, room: data.room,name : data.name ,image : data.image, message : data.message, image_message : data.image_message}] } }, 
                    { new: true, upsert: true }
                ).then((result) => {
                }).catch((err) => {
                    console.log("data error =>", err);
                });
            } else{
                PrivateMessagesModel.findOne({coach_id: data.room, user_id: data.from}).then((resultOne) => {
                    if(resultOne){
                        PrivateMessagesModel.findOneAndUpdate(
                            { coach_id: data.room, user_id: data.from },
                            { $push: { messages: [{
                                from : data.from, room: data.room,name : data.name ,image : data.image, message : data.message, image_message : data.image_message}] } }, 
                            { new: true, upsert: true }
                        ).then((resultOne) => {
                        }).catch((err) => {
                            console.log("data error =>", err);
                        });
                    }else{
                        newPrivateMessage.save().then(async(result) => {
                        }).catch((err) => {
                            console.log("data error =>", err);
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    })
}

module.exports = messageHandler