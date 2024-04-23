const Mongoose = require("mongoose")
//const localDB = "mongodb://127.0.0.1"
const connectDB = async () => {
    await Mongoose.connect(process.env.DATABASE_URI, /*{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }*/)
   /* connectDB.on('connected', function(){
        console.log('database is connected successfully');
    });
    connectDB.on('disconnected', function(){
        console.log('database is disconnected successfully');
    });
    connectDB.on('error', console.error.bind(console,'connection error:'));*/

}

module.exports = connectDB