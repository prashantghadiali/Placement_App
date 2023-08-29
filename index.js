const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const port = 3001;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require("express-session");
// const passport = require("passport");
// const passportLocal = require("./config/passport_local_stratagy");



// Used express.urlencoded with extended option
app.use(express.urlencoded({ extended: true }));
// app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// use express router
app.use('/', require('./routes'));

// set up the view engine
app.set('views', path.join(__dirname, 'views'));
// we use ejs engine
app.set('view engine', 'ejs');



app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);    //if there is any error on server
    }

    console.log(`Server is running on port: ${port}`);
});
