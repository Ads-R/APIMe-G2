const exceptionHandler = (err, req, res, next) => {
    let exception = {
        statusCode: err.code || 500,
        message: err.message || 'Oops! Something went wrong. The application has encountered an unknown error.'
    }

    if(err.name === 'CastError'){
        exception.statusCode = 404
        exception.message = `The object with id ${err.value} is not found`
    }
    if(err.code && err.code==11000){
        exception.statusCode = 400
        if(Object.keys(err.keyValue) == 'movie,user'){
            exception.message = 'Each user is allowed only 1 review per movie';
        }
        else{
            exception.message = `${Object.keys(err.keyValue)} already exists. Please enter a unique value`
        }
    }

   return res.status(exception.statusCode).json({success:false, msg:exception.message})
}

module.exports = exceptionHandler