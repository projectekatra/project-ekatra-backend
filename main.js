//Packages//
require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const ejs=require("ejs");
const urlHelper = require('./routes.js');

///////////////////////////////////////////////////////////

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));

var whitelist = ['http://localhost:3000','http://localhost:8000/','https://projectekatra.herokuapp.com', 'https://projectekatra.github.io',"https://projectekatra.me"]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
//app.use(cors(corsOptions))
///////Working With Database/////////
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//////Handling Routes/////////
urlHelper.setRequestUrl(app);
/////Listening to Port//////////////
let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

app.listen(port, function() {
    console.log("Server has started.", port)
})
