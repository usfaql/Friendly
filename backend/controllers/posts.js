const postModel = require("../models/Post");
const userModel = require("../models/Users");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyCYj7agxninbQcoLIQ130oy9Lcy5bGiV8c",
  authDomain: "frindly-d4395.firebaseapp.com",
  projectId: "frindly-d4395",
  storageBucket: "frindly-d4395.appspot.com",
  messagingSenderId: "55025000747",
  appId: "1:55025000747:web:946b40b554b337149c256e",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage();

function formatDate(date) {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return day + "/" + month + "/" + year + " " + hours + ":" + minutes;
}


 
const createPost = (req, res) => {
  let now = new Date();
  let formattedDate = formatDate(now);
  const { content,image, author } = req.body;
  // console.log("Image Path =====>", image);
  // console.log("from BE req:",content,image, author);
    const newPost = new postModel({
      content,
      image,
      author,
      datePost: formattedDate,
    });
   newPost
      .save()
      .then( async(result) => {
        console.log("result Create Post ==>", result);
      await userModel.updateOne({_id: author},{$push : {posts: result._id}}).populate("author").then((results) => {
        res.status(201).json({
          success: true,
          message: "Post Created Successfully",
          data: result,
        });
      }).catch((err) => {
        
      });
        // console.log(result);
        
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: `Server Error` + err.message,
          err: err,
        });
      });

};
 
const getAllPosts = (req, res) => {
  const userId = req.token.userId;
  postModel
    .find()
    .populate({
      path:"comments",
      populate : 
        {
          path:"commenter"
        }
      
    })
    .populate("author")
    .then((posts) => {
      if (posts.length) {
        res.status(200).json({
          success: true,
          message: `All the Posts`,
          userId: userId,
          posts: posts,
        });
      } else {
        res.status(200).json({
          success: false,
          message: `No Posts Yet`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

const getAllPostByAuthor = (req, res) => {
  let authorId = req.params.author;
  postModel
    .find({ author: authorId })
    .populate({
      path:"comments",
      populate : 
        {
          path:"commenter"
        }
      
    })
    .populate("author")
    .then((posts) => {
      if (!posts) {
        return res.status(404).json({
          success: false,
          message: `The author: ${authorId} has no Posts`,
        });
      }
      res.status(200).json({
        success: true,
        message: `All the Posts for the author: ${authorId}`,
        posts: posts,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

const getPostById = (req, res) => {
  let idPost = req.params.id;
  postModel
    .findById(idPost)
    .populate("likes")
    .populate({
      path:"comments",
      populate : 
        {
          path:"commenter"
        }
      
    })
    .populate("author")
    .exec()
    .then((post) => {
      if (!post) {
        return res.status(404).json({
          success: false,
          message: `The Post with id => ${idPost} not found`,
        });
      }
      res.status(200).json({
        success: true,
        message: `The Post ${idPost} `,
        post: post,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

const updatePostById = (req, res) => {
  const postId = req.params.id;
  postModel
    .findByIdAndUpdate({ _id: postId }, req.body)
    .then((newPost) => {
      if (!newPost) {
        return res.status(404).json({
          success: false,
          message: `The Post with id => ${postId} not found`,
        });
      }
      res.status(201).json({
        success: true,
        message: `Post updated`,
        post: newPost,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};

const deletePostById = (req, res) => {
  const idPost = req.params.id;
  const idUser = req.params.iduser;
  postModel
    .findByIdAndDelete(idPost)
    .then((post) => {
      if (!post) {
        return res.status(404).json({
          success: false,
          message: `The Post with id => ${idPost} not found`,
        });
      }
      
      res.status(200).json({
        success: true,
        message: `Post deleted`,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error`,
        err: err.message,
      });
    });
};
module.exports = {
  createPost,
  getAllPosts,
  getAllPostByAuthor,
  getPostById,
  updatePostById,
  deletePostById,
}
