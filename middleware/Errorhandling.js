// errorMiddleware.js
const codes= require("../codes")

exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  let statusCode = codes.internalerror;
  let errorMessage = codes.internalerror;

  if (err.name === 'ValidationError') {
    statusCode = codes.badrequest;
    errorMessage = err.message;
  } else if (err.name === 'MongoError' && err.code === codes.mongoerror) {
    statusCode = codes.conflict;
    errorMessage = codes.userexists;
  }
  
  res.status(statusCode).json({ message: errorMessage });
};
