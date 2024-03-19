const userModel = require("../models/Users");
const postModel = require("../models/Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = (req, res) => {
  const {
    firstName,
    lastName,
    image,
    dateBrith,
    phoneNumber,
    country,
    gender,
    email,
    password,
  } = req.body;
  const user = new userModel({
    firstName,
    lastName,
    image,
    dateBrith,
    phoneNumber,
    country,
    gender,
    email,
    password,
  });

  user
    .save()
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Account Created Successfully",
        author: result,
      });
    })
    .catch((err) => {
      if (err.keyPattern) {
            return res.status(409).json({
                success: false,
                message: `The email already exists`,
        });
      }
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

const login = (req, res) =>{
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  userModel.findOne({email}).then(async (result) => {
    if(!result){
      return res.status(403).json({
        success: false,
        message: `The email doesn't exist or The password you’ve entered is incorrect`,
      });
    }

    try {
      const valid = await bcrypt.compare(password, result.password);
      if(!valid){
        return res.status(403).json({
          success: false,
          message: `The email doesn't exist or The password you’ve entered is incorrect`,
        });
      }

      const payload = {
        userId: result._id,
        author: result.firstName,
        country: result.country,
      }

      const options = {
        expiresIn : "6h"
      };

      const token = jwt.sign(payload, process.env.SECRET, options);

      res.status(200).json({
        success: true,
          message: `Valid login credentials`,
          token: token,
          userId: result._id
      });

    } catch (error) {
      throw new Error(error.message);
    }
  }).catch((err) => {
    res.status(500).json({
      success: false,
      message: `Server Error`,
      err: err.message,
    });
  });
};

const getUserById = (req, res)=>{
  const id = req.params.id;

  userModel.findById(id).then((result) => {
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `The User with id => ${result} not found`,
      });
    }
    res.status(200).json({
      success: true,
      message: `The User ${result} `,
      user: result,
    });
  }).catch((err) => {
    res.status(500).json({
      success: false,
      message: `Server Error`,
      err: err.message,
    });
  });
}

const updateDataUserById = (req,res)=>{
  const id = req.params.id;

  userModel.findByIdAndUpdate({_id: id}, req.body).then((result) => {
    if(!result){
      return res.status(404).json({
        success: false,
        message: `The User with id => ${id} not found`,
      });
    }

    res.status(201).json({
      success: true,
      message: `User updated`,
      user: result,
    });
  }).catch((err) => {
    if (err.keyPattern) {
      return res.status(409).json({
          success: false,
          message: `The email already exists`,
  });
}
    res.status(500).json({
      success: false,
      message: `Server Error`,
      err: err.message,
    });
  });
}

const followingUser = (req,res)=>{
  const {myId, userId} = req.params;
  userModel.findById({_id: myId}).then(async(result) => {
    console.log("Result =>", result.following.includes(userId));
    if(result.following.includes(userId)){
      await userModel.updateOne({_id:myId}, {$pull : {following: userId}}).then((result) => {
        userModel.updateOne({_id:userId}, {$pull : {follower: myId}}).then((resultEnd) => {
          res.status(201).json({
            success : true,
            message: `Remove Follow`,
            result : result
          })
        }).catch((err) => {
          res.status(500).json({
            success : false,
            message : `Server Error`,
            err: err.message
        });
        });
      }).catch((err) => {
        res.status(500).json({
          success : false,
          message : `Server Error`,
          err: err.message
      });
      });
    }else{
      await userModel.updateOne({_id:myId}, {$push : {following: userId}}).then((result) => {
        userModel.updateOne({_id:userId}, {$push : {follower: myId}}).then((resultEnd) => {
          res.status(201).json({
            success : true,
            message: `Follow Add`,
            result : result
          })
        }).catch((err) => {
          res.status(500).json({
            success : false,
            message : `Server Error`,
            err: err.message
        });
        });
      }).catch((err) => {
        res.status(500).json({
          success : false,
          message : `Server Error`,
          err: err.message
      });
      });
    }
  }).catch((err) => {
    res.status(500).json({
      success : false,
      message : `Server Error`,
      err: err.message
  });
  });

}

const getAllUser = (req,res)=>{

  userModel.find().populate("posts").then((result) => {
    res.status(201).json({
      success : true,
      message: `All User`,
      Users : result
    })
  }).catch((err) => {
    
  });
}

const getPostByFollowing = async (req,res)=>{
  const idUser = req.token.userId;
  try {
    const user = await userModel.findById(req.params.id);
    const followingIds = user.following;
    followingIds.push(idUser);
    
    const postsPromises = followingIds.map((followingId) => {
      return postModel.find({ author: followingId }).populate("author");
    });

    
    const postsArrays = await Promise.all(postsPromises);

    const allPosts = [].concat(...postsArrays.flat());

  
    
    res.status(200).json({
      success: true,
      message: `All posts by the people you are following`,
      posts: allPosts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Server Error`,
      error: err.message,
    });
  }
}

module.exports = {
    register,
    login,
    getUserById,
    updateDataUserById,
    followingUser,
    getAllUser,
    getPostByFollowing
  };
  