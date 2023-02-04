const mongoose = require('mongoose');

const DBconnect = (url) => {
    mongoose.set('strictQuery', false)
    return mongoose.connect(url).then(console.log('Connected to DB'));
};

module.exports = DBconnect;