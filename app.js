require('express-async-errors')
require('dotenv').config();

const cors = require('cors');

const express = require('express');
const app = express();
const DBconnect = require('./MongoDB/dbconnection');
const movieRoutes = require('./routes/movieRoute')

const middlewareNotFound = require('./middleware/not-found-middleware')
const middlewareExceptionHandling = require('./middleware/exception-handling-middleware')

app.use(express.static('./public'));

const port = process.env.PORT;

app.use(cors());

app.use('/apime/movies', movieRoutes)

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