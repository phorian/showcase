require('dotenv').config();
const express = require("express")
const rateLimit = require('express-rate-limit');
//const bodyParser = require('body-parser')
const app = express();
const PORT = process.env.PORT || 9999
const connectDB = require("./config/db");
const server = app.listen(PORT, () => console.log(`Server connected to port ${PORT}`));
const deleteStoreAndProductCron = require('./middleware/Cronservice');

//connecting the Database
connectDB();




/* 
Built-in middleware to handle urlencoded data
in other words, form data:
'content-type: application/x-www-form-urlencoded
*/

//error Handler
process.on("unhandledRejection", err => {
    console.log(`An error occuured: ${err.message}`)
    server.close(() => process.exit(1));
})

//Cron task
deleteStoreAndProductCron();
console.log('Cron started');

//Rate limit middleware

let limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP.'
});

app.use('/', limiter);

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

//json middleware
app.use(express.json());

app.use('/', require("./routes/authRouter"));
app.use('/', require("./routes/userRoute"));
app.use('/', require("./routes/categoriesRouter"));
app.use('/', require("./routes/storeRouter"));
app.use('/', require("./routes/productRoute"));
app.use('/', require("./routes/ratingRoute"));
app.use('/', require("./routes/addressRoute"));
app.use('/', require("./routes/cartRouter"));
app.use('/', require("./routes/orderRouter"));