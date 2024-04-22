require('dotenv').config();
const express = require("express")
const rateLimit = require('express-rate-limit');
//const bodyParser = require('body-parser')
const app = express();
const PORT = process.env.PORT || 9999
const connectDB = require("./showcase-auth-service/config/db");
const server = app.listen(PORT, () => console.log(`Server connected to port ${PORT}`))

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

app.use('/', require("./showcase-auth-service/routes/authRouter"));
app.use('/', require("./showcase-auth-service/routes/userRoute"));