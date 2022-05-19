require('dotenv').config();

var express = require("express");
var helmet = require("helmet");
var mongoose = require("mongoose");
var cors = require("cors");
const formidableMiddleware = require('express-formidable');
// var validator = require('validator');

var Post = require("./models/Post");
var Reply = require("./models/Reply");

mongoose.connect('mongodb://127.0.0.1:27017/myboard',{
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

app.get('/get-posts', (req, res) => {
    // console.log(req.fields)
    Post.find({})
    .sort({ "_id": 1 })
    // .skip(request.fields.startFrom)
    // .limit(request.fields.limit)
    .exec(function (err, docs) {
        // docs are plain javascript objects instead of model instances
        console.log(docs);
        // send the response back as JSON
        res.json(docs);
    });
});

app.post('/make-post', (req, res) => {
    console.log(req.fields);

    // let { skip = 0, limit = 5, sort = 'desc' } = req.query;
    // skip = parseInt(skip) || 0;
    // limit = parseInt(limit) || 5;
  
    // skip = skip < 0 ? 0 : skip;
    // limit = Math.min(50, Math.max(1, limit));

    // console.log("fields",req.fields,"skip",skip,"limit",limit,"sort",sort);

    // var d = new Date;
    // var doc = new Reply(
    //     {
    //         content: req.fields.content,
    //         name: req.fields.name,
    //         reply_to: '628594640d17cb8f39bbbbbb',
    //         date: d.getTime()
    //     });
    // doc.save().then(savedDoc => {
    //     savedDoc === doc; // true
    //     console.log("saved!",savedDoc);
    //     res.json(true);
    // });

    var d = new Date;

    var doc = new Post(
        {
            content: req.fields.content,
            name: req.fields.name,
            date: d.getTime(),
        });

    if(req.fields.reply_to)
    {
        doc.reply_to = req.fields.reply_to;
    }

    doc.save().then(savedDoc => {
        savedDoc === doc; // true
        console.log("saved!",savedDoc);
        res.json(true);
    });

    // Comment.find({})
    //     .sort({ "_id": 1 })
    //     .skip(skip)
    //     .limit(limit)
    //     .exec(function (err, docs) {
    //         // docs are plain javascript objects instead of model instances
    //         console.log("docs",docs);
    //         // send the response back as JSON
    //         // var hey = 'Meow! 😹 🐈' + req.fields.content;
    //         res.json(docs);
    //     });

});

app.listen(process.env.PORT, function(){
    console.log("app started at http://127.0.0.1:"+process.env.PORT);
});