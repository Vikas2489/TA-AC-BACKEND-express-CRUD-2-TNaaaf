var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Book = require("./books");

var authorSchema = new Schema({
    name: String,
    email: { type: String, required: true },
    country: String,
    books: [{ type: Schema.Types.ObjectId, ref: "Book" }]
}, { timestamps: true });

var Author = mongoose.model("Author", authorSchema);

module.exports = Author;