const express = require('express');
const path = require('path');
const app = express();
let bodyParser=require("body-parser");
const dbConnection = require('./util/db');
const fileUpload = require('express-fileupload');
const fs = require('fs');

//routes variable
const uindex = require('./routes/userside/uindex');



app.use(fileUpload());

app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname,"assets")))


app.use('/',uindex);


//Middleware
app.listen(3030, () => {
  console.log('Server running on port 3030')
})