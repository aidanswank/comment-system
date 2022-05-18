require('dotenv').config();

var express = require("express");
var helmet = require("helmet");
var mongoose = require("mongoose");
var cors = require("cors");
const formidableMiddleware = require('express-formidable');

mongoose.connect('mongodb://127.0.0.1:27017/auth_demo_app',{
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.log(err));

var app = express();

app.set("view engine","ejs");

app.use(express.static(__dirname + '/public'));

app.use(cors());
app.use(formidableMiddleware());

app.get("/",function(req, res){
    res.render("home"); 
});

app.post('/hey', (req, res) => {
    console.log(req.fields);
    // var hey = 'Meow! 😹 🐈' + req.fields.content;
    res.json({
        message: 'Meow! 😹 🐈'
    });
});

app.listen(process.env.PORT, function(){
    console.log("app started at http://127.0.0.1:"+process.env.PORT);
});