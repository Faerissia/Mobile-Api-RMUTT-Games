const express = require('express');
const path = require('path');
const app = express();
let bodyParser=require("body-parser");
const dbConnection = require('./util/db');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const fs = require('fs');

//routes variable
const uindex = require('./routes/userside/uindex');
app.use("/assets",express.static('Sport-management-of-RMUTT-Games/assets'));

app.use(fileUpload());
app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: false }))
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


app.use('/',uindex);


//Middleware
app.listen(3030, () => {
  console.log('Server running on port 3030')
})