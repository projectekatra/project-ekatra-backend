require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const ejs = require("ejs");
const urlHelper = require('./routes.js');

///////////////////////////////////////////////////////////

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

var whitelist = ['http://localhost:3000', 'http://localhost:8000', 'https://projectekatra.github.io', 'https://projectekatra.onrender.com'];
var corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      callback(null, true);
    }
    else if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.set('trust proxy', true)

// Working With Database (Updated)
mongoose.connect(process.env.DATABASE)
.then(() => {
  console.log("Database connection successful");
})
.catch((err) => {
  console.error("Database connection error:", err);
});

// Handling Routes
urlHelper.setRequestUrl(app);

// Listening to Port
let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

app.listen(port, function() {
    console.log("Server has started on port", port);
});
