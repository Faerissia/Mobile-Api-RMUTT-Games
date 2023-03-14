const express = require('express');
const path = require('path');
const app = express();
let bodyParser=require("body-parser");
let flash = require('express-flash');
const dbConnection = require('./util/db');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const fs = require('fs');

//routes variable
const uindex = require('./routes/userside/uindex');


app.use(fileUpload());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname,"assets")))
app.use(flash());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 2000 }
}))
app.use(function(req, res, next) {
  res.locals.username = req.session.username;
  res.locals.level = req.session.level;
  next();
});

app.use(bodyParser. text({type: '/'}));

app.get('/error404', function(req, res, next) {
    res.render('error');
})

app.use('/',uindex);


//Middleware
app.listen(3000, () => {
  console.log('Server running on port 3000')
})