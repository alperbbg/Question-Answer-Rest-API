const mongoose = require('mongoose');

const connectDatabase = () => {

    mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        .then(() => {
            console.log("MongoDB connection successful")
        })
        .catch(err => {
            console.log(err);
        })
};


module.exports = connectDatabase;