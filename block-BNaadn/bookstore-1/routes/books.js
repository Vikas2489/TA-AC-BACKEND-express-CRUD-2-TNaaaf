var express = require("express");
var router = express.Router();
var Book = require("../models/books");
var Author = require("../models/author");
var multer = require("multer");
var path = require("path");
var uploadsPath = path.join(__dirname, "../", "/public/uploads");


// multer to grab the image
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadsPath);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage })

// get book form
router.get("/new", (req, res, next) => {
    Author.find({}, (err, authors) => {
        if (err) return next(err);
        res.render("bookForm", { authors });
    });
})

// create book
router.post("/", upload.single("cover_image"), (req, res, next) => {
    req.body.cover_image = req.file.filename;
    // Author.findOneAndUpdate({name:req.body.author}, {$push: {bookId: }},)
    Author.find({ name: req.body.author }, (err, authorArr) => {
        if (err) return next(err);
        req.body.author = authorArr[0].id;
        Book.create(req.body, (err, book) => {
            if (err) return next(err);
            res.redirect("/books");
        });
    })
})

// single book detail
router.get("/:bookId", (req, res, next) => {
    let bookId = req.params.bookId;
    Book.findById(bookId).populate("author").exec((err, book) => {
        if (err) return next(err);
        console.log(book);
        res.render("bookDetail", { book });
    });
})

// all books list
router.get("/", (req, res, next) => {
    Book.find({}, (err, book) => {
        if (err) return next(err);
        res.render("listOfBooks", { book });
    });
});

module.exports = router;