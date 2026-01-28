const jwt = require("jsonwebtoken");

// This function checks if the user logged in
const authentication = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(403).json({
        success: false,
        message: `Forbidden`,
      });
    }
    const token = req.headers.authorization.split(" ").pop();

    jwt.verify(token, process.env.SECRET, (err, result) => {
      if (err) {
        res.status(403).json({
          code: 2,
          success: false,
          message: `The token is invalid or expired`,
        });
      } else {
        req.token = result;
        next();
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Server Error`,
      err: err.message,
    });
  }
};

const auth=(socket,next)=>{
  const headers = socket.handshake.headers
  if(!headers.token){
       next(new Error("invalid"))
  }else{
    const room = headers.user_id.localeCompare(headers.room) < 0 ? `room-${headers.user_id}-${headers.room}` : `room-${headers.room}-${headers.user_id}`;
    console.log(room);
    socket.join(room);
    socket.user = {token:headers.token,user_id:headers.user_id}
    next();
  }
}
module.exports = {authentication, auth};
