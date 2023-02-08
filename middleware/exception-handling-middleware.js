const exceptionHandler = (err, req, res, next) => {
    let exception = {
        statusCode: err.code || 500,
        message: err.message || 'Oops! Something went wrong. The application has encountered an unknown error.'
    }

    if(err.name === 'CastError'){
        exception.statusCode = 404
        exception.message = `The object with id ${err.value} is not found`
    }

   return res.status(exception.statusCode).json({success:false, msg:exception.message})
}

module.exports = exceptionHandler