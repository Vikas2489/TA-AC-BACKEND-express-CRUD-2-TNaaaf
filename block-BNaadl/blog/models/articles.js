var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title: String,
    description: String,
    tags: [String],
    author: String,
    likes: Number
}, { timestamps: true });


var Article = mongoose.model("Article", articleSchema);

module.exports = Article;