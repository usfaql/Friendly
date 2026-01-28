const commentsModel = require("../models/comments");
const postsModel = require("../models/Post");

// This function creates a new comment for a specific article
const createNewComment = (req, res) => {
  const id = req.params.id;
  const { comment } = req.body;
  const commenter = req.token.userId;
  const newComment = new commentsModel({
    comment,
    commenter,
  });
  newComment
    .save()
    .then((result) => {
        postsModel
        .findByIdAndUpdate(
          { _id: id },
          { $push: { comments: result._id } },
          { new: true }
        )
        .then(() => {
          res.status(201).json({
            success: true,
            message: `Comment added`,
            comment: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
            message: `Server Error`,
            err: err.message,
          });
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

const getCommentById = (req, res)=>{
  const idComment = req.params.id;

  commentsModel.findById({_id:idComment}).populate("commenter").then((result) => {
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `The Comment with id => ${idComment} not found`,
      });
    }
    res.status(200).json({
      success: true,
      message: `The Comment ${idComment} `,
      comment: result,
    });
  })
  .catch((err) => {
    res.status(500).json({
      success: false,
      message: `Server Error`,
      err: err.message,
    });
  });
}

module.exports = {
  createNewComment,
  getCommentById,
};
