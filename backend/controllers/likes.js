const likesModel = require("../models/Like");
const postModel = require("../models/Post");
const trundleModel = require("../models/Trundle");

const createLike = (req,res)=>{
    const id = req.params.id;
    const admirer = req.token.userId;

    const newLike = new likesModel({
        admirer
    });
    
    newLike.save().then( (result) => {
        postModel.findById(
            { _id: id}
        ).then( async (result) => {
            console.log("Result => " , result.likes.includes(admirer));
            if(result.likes.includes(admirer)){
              await postModel.updateOne({ _id: id}, {$pull : {likes:admirer}});
              res.status(201).json({
                success : true,
                message: `Remove Like`,
                like : result
            });
            } else{
                 await postModel.updateOne({ _id: id}, {$push : {likes:admirer}});
                 res.status(201).json({
                    success : true,
                    message: `Like Added`,
                    like : result
                });
            }
           
        }).catch((err) => {
            res.status(500).json({
                success : false,
                message : `Server Error`,
                err: err.message
            });
        });
    }).catch((err) => {
        res.status(500).json({
            success: false,
            message: `Server Error`,
            err: err.message
        });
    });
}


const createLikeForTrundle = (req,res)=>{
    const id = req.params.id;
    const admirer = req.token.userId;

    const newLike = new likesModel({
        admirer
    });
    
    newLike.save().then( (result) => {
        trundleModel.findById(
            { _id: id}
        ).then( async (result) => {
            console.log("Result => " , result.likes.includes(admirer));
            if(result.likes.includes(admirer)){
              await trundleModel.updateOne({ _id: id}, {$pull : {likes:admirer}});
              res.status(201).json({
                success : true,
                message: `Remove Like`,
                like : result
            });
            } else{
                 await trundleModel.updateOne({ _id: id}, {$push : {likes:admirer}});
                 res.status(201).json({
                    success : true,
                    message: `Like Added`,
                    like : result
                });
            }
           
        }).catch((err) => {
            res.status(500).json({
                success : false,
                message : `Server Error`,
                err: err.message
            });
        });
    }).catch((err) => {
        res.status(500).json({
            success: false,
            message: `Server Error`,
            err: err.message
        });
    });
}

module.exports = {
    createLike,
    createLikeForTrundle
}