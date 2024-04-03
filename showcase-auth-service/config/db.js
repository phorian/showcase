const Mongoose = require("mongoose")
const localDB = 'mongodb://localhost/node-mongodb'
const connectDB = async () => {
    await Mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    connectDB.on('connected', function(){
        console.log('database is connected successfully');
    });
    connectDB.on('disconnected', function(){
        console.log('database is disconnected successfully');
    });
    connectDB.on('error', console.error.bind(console,'connection error:'));

}

module.exports = connectDB