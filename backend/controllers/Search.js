const userModel = require("../models/Users");
const postModel = require("../models/Post");
const { model, default: mongoose } = require("mongoose");

const searchByNameUserOrContentPost = (req, res)=>{
    const {valueSearch} = req.body;
   const firstname = new RegExp(valueSearch, 'i');
    userModel.find({firstName : firstname}).then((result) => {
        if(!result.length){
              userModel.find({lastName: firstname}).then((result) => {
                if(!result.length){
                    postModel.find({content: firstname}).populate("author").then((result) => {
                        res.status(201).json({
                            success : true,
                            message : `the Post With Content => ${firstname}`,
                            type: "post",
                            user : result
                        })
                    }).catch((err) => {
                        
                    });
                }else{
                    res.status(201).json({
                    success : true,
                    message : `the User With LastName => ${firstname}`,
                    type: "user",
                    user : result
                })
                }
                
              }).catch((err) => {
                
              });
        }else{
            res.status(201).json({
                success : true,
                message : `the User With FirstName => ${firstname}`,
                type: "user",
                user : result
            })
        }
        
    }).catch((err) => {
        res.status(500).json({
            success: false,
            message: `Server Error`,
            err: err.message,
          });
    });
}

module.exports = {
    searchByNameUserOrContentPost,
}