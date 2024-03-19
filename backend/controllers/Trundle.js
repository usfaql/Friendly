const trundleModel = require("../models/Trundle");
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
  console.log("hours ==>", hours);
  return day + "/" + month + "/" + year + " " + hours + ":" + minutes;
}

const createTrundle = (req, res) => {
  let now = new Date();
  let formattedDate = formatDate(now);
  const { content, video, author } = req.body;
  // console.log("Image Path =====>", image);
  // console.log("from BE req:",content,image, author);
  const newTrundle = new trundleModel({
    content,
    video,
    author,
    dateTrundle: formattedDate,
  });
  newTrundle
    .save()
    .then(async (result) => {
      res.status(201).json({
        success: true,
        message: "Trundle Created Successfully",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server Error` + err.message,
        err: err,
      });
    });
};

const getAllTrundle = (req, res) => {
  const userId = req.token.userId;
  trundleModel
    .find()
    .populate("author")
    .then((trundle) => {
      if (trundle.length) {
        res.status(200).json({
          success: true,
          message: `All the Trundle`,
          userId: userId,
          trundle: trundle,
        });
      } else {
        res.status(200).json({
          success: false,
          message: `No Trundle Yet`,
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

const getAllTrundleByAuthor = (req, res) => {
  let authorId = req.params.author;
  trundleModel
    .find({ author: authorId })
    .populate("author")
    .then((trundle) => {
      if (!trundle) {
        return res.status(404).json({
          success: false,
          message: `The author: ${authorId} has no Trundle`,
        });
      }
      res.status(200).json({
        success: true,
        message: `All the Trundle for the author: ${authorId}`,
        trundle: trundle,
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

const getTrundleById = (req, res) => {
  let idTrundle = req.params.id;
  trundleModel
    .findById(idTrundle)
    .populate("likes")
    .populate({
      path: "comments",
      populate: {
        path: "commenter",
      },
    })
    .populate("author")
    .exec()
    .then((trundle) => {
      if (!trundle) {
        return res.status(404).json({
          success: false,
          message: `The trundle with id => ${idTrundle} not found`,
        });
      }
      res.status(200).json({
        success: true,
        message: `The trundle ${idTrundle} `,
        trundle: trundle,
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

const deleteTrundleById = (req, res) => {
  const idTrundle = req.params.id;
  const idUser = req.params.iduser;
  trundleModel
    .findByIdAndDelete(idTrundle)
    .then((trundle) => {
      if (!trundle) {
        return res.status(404).json({
          success: false,
          message: `The trundle with id => ${idTrundle} not found`,
        });
      }

      res.status(200).json({
        success: true,
        message: `trundle deleted`,
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
  createTrundle,
  getAllTrundle,
  getAllTrundleByAuthor,
  getTrundleById,
  deleteTrundleById,
};
