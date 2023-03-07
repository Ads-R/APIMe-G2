const exceptionHandler = (error, req, res, next) => {
    let exception = {
        statusCode: error.code || 500,
        message: error.message || 'Oops! Something went wrong. The application has encountered an unknown error.'
    }

    if(error.name === 'CastError'){
        exception.statusCode = 404
        exception.message = `The object with id ${error.value} is not found`
    }
    if(error.code && error.code==11000){
        exception.statusCode = 400
        if(Object.keys(error.keyValue) == 'movie,user'){
            exception.message = 'Each user is allowed only 1 review per movie';
        }
        else{
            exception.message = `${Object.keys(error.keyValue)} already exists. Please enter a unique value`
        }
    }
    if(error.name === 'ValidationError'){
        exception.statusCode = 400
        exception.message = Object.values(error.errors).map((x) => x.message).join('\n')
    }

   return res.status(exception.statusCode).json({success:false, msg:exception.message})
}

module.exports = exceptionHandler