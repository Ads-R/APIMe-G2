const express = require('express');
const app = express();
const DBconnect = require('./MongoDB/dbconnection');
require('dotenv').config();

const port = 3500;

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