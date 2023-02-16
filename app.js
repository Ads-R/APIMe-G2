require('express-async-errors')
require('dotenv').config();

const cors = require('cors');

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const DBconnect = require('./MongoDB/dbconnection');

//import routes
const movieRoutes = require('./routes/movieRoute')
const userRoutes = require('./routes/userRoute')

const middlewareNotFound = require('./middleware/not-found-middleware')
const middlewareExceptionHandling = require('./middleware/exception-handling-middleware')

app.use(express.static('./public'));

const port = process.env.PORT;

app.use(express.json())
app.use(cookieParser(process.env.TOKEN_SECRET))
app.use(fileUpload({limits:{fileSize: 1024 * 512}}))

app.use(cors());

//use routes
app.use('/apime/movies', movieRoutes)
app.use('/apime/user', userRoutes)

app.use(middlewareNotFound)
app.use(middlewareExceptionHandling)

const initialize = async () => {
    try{
        await DBconnect(process.env.DB_URI);
        app.listen(port, ()=>{
            console.log(`Listening on port ${port}`);
        });
    }
    catch(error){
        console.log(error);
    }
};
initialize();