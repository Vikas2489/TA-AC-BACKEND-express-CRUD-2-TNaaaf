var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Author = require("./author");

var bookSchema = new Schema({
    title: { type: String, required: true },
    summary: { type: String, required: true },
    pages: { type: Number },
    publication: { type: String },
    cover_image: String,
    category: [String],
    author: { type: Schema.Types.ObjectId, required: true, ref: "Author" }
}, { timestamps: true });

var Book = mongoose.model("Book", bookSchema);

module.exports = Book;