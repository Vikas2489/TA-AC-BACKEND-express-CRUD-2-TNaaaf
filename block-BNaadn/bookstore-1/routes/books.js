var express = require("express");
var router = express.Router();
var Book = require("../models/books");
var Author = require("../models/author");
var multer = require("multer");
var fs = require("fs");
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
});

// create book
router.post("/", upload.single("cover_image"), (req, res, next) => {
    req.body.cover_image = req.file.filename;
    Author.find({ name: req.body.author }, (err, authorArr) => {
        if (err) return next(err);
        req.body.author = authorArr[0].id;
        Book.create(req.body, (err, book) => {
            if (err) return next(err);
            // Author.findOneAndUpdate({ name: book.author }, { $push: { books: book.id } }, (err, author) => {
            //     if (err) return next(err);
            //     res.redirect("/books");
            // })
            let authorId = book.author;
            Author.findByIdAndUpdate(authorId, { $push: { books: book.id } }, (err, author) => {
                if (err) return next(err);
                res.redirect("/books");
            })
        });
    });
});

// single book detail
router.get("/:bookId", (req, res, next) => {
    let bookId = req.params.bookId;
    Book.findById(bookId).populate("author").exec((err, book) => {
        if (err) return next(err);
        console.log(book);
        res.render("bookDetail", { book });
    });
});

// all books list
router.get("/", (req, res, next) => {
    Book.find({}, (err, book) => {
        if (err) return next(err);
        res.render("listOfBooks", { book });
    });
});


// get book's filled form to update
router.get("/:id/edit", (req, res, next) => {
    let id = req.params.id;
    Book.findById(id, (err, book) => {
        if (err) return next(err);
        console.log(book);
        res.render("updateBookForm", { book });
    })
})

// update book
router.post("/:id", upload.single("cover_image"), (req, res, next) => {
    let id = req.params.id;
    req.body.cover_image = req.file.filename;
    Book.findByIdAndUpdate(id, req.body, (err, book) => {
        if (err) return next(err);
        res.redirect("/books/" + id);
    })
})

// delete a book
router.get("/:id/delete", (req, res, next) => {
    let id = req.params.id;
    Book.findByIdAndDelete(id, (err, deletedBook) => {
        if (err) return next(err);
        fs.unlink(path.join(__dirname, "../", "public/uploads/", deletedBook.cover_image), (err) => {
            if (err) console.log(err);
            console.log(deletedBook);
            res.redirect("/books");
        })

    })
})

module.exports = router;