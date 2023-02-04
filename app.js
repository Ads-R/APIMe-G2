require('express-async-errors')
require('dotenv').config();

const cors = require('cors');

const express = require('express');
const app = express();
const DBconnect = require('./MongoDB/dbconnection');
const movieRoutes = require('./routes/movieRoute')

app.use(express.static('./public'));

const port = process.env.PORT;

app.use(cors());

app.use('/apime/movies', movieRoutes)

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