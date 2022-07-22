var express = require("express");
var router = express.Router();
var Author = require("../models/author");

// author form
router.get("/new", (req, res, next) => {
    res.render("authorForm");
})

// creating author by post
router.post("/", (req, res, next) => {
    Author.create(req.body, (err, author) => {
        if (err) return next(err);
        res.redirect("/authors");
    });
});

//list of Author
router.get("/", (req, res, next) => {
    Author.find({}, (err, authors) => {
        if (err) return next(err);
        res.render("listOfAuthor", { authors });
    })
});

// get single Author detail
router.get("/:id", (req, res, next) => {
    let id = req.params.id;
    Author.findById(id, (err, author) => {
        if (err) return next(err);
        res.render("authorDetail", { author });
    })
})

// get author's form to update
router.get("/:id/edit", (req, res, next) => {
    let id = req.params.id;
    Author.findById(id, (err, author) => {
        if (err) return next(err);
        res.render("updateAuthor", { author });
    })
})

// update the author form
router.post("/:id", (req, res, next) => {
    let id = req.params.id;
    Author.findByIdAndUpdate(id, req.body, (err, author) => {
        if (err) return next(err);
        res.redirect("/authors/" + id);
    })
})

// delete an author
router.get("/:id/delete", (req, res, next) => {
    let id = req.params.id;
    Author.findByIdAndDelete(id, (err, author) => {
        if (err) return next(err);
        res.redirect("/authors");
    })
})

module.exports = router;