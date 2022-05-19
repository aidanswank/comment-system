const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    content: String,
    name: String,
    date: Date,
    reply_to: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Post', PostSchema); 