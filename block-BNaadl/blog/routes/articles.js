var express = require('express');
var router = express.Router();
var Article = require("../models/articles");

/* GET article form. */
router.get('/new', (req, res, next) => {
    res.render("articleForm");
});

// POST article form
router.post("/", (req, res, next) => {
    Article.create(req.body, (err, article) => {
        if (err) {
            next(err);
        } else {
            res.redirect("/articles");
        }
    })
})

// GET all Articles
router.get("/", (req, res, next) => {
    Article.find({}, (err, article) => {
        if (err) {
            next(err);
        } else {
            res.render("listArticles", { article: article });
        }
    })
});

// GET Single Article Details
router.get("/:id", (req, res, next) => {
    Article.findById(req.params.id, function(err, article) {
        if (err) return next(err);
        res.render("articleDetail.ejs", { article: article });
    })
});

//get filled form for updating 
router.get("/:id/edit", (req, res, next) => {
    let id = req.params.id;
    Article.findById(id, (err, updatedArticle) => {
        if (err) return next(err);
        res.render("updateForm", { article: updatedArticle });
    });
})

// update form
router.post("/:id", (req, res) => {
    let id = req.params.id;
    Article.findByIdAndUpdate(id, req.body, (err, updatedArticle) => {
        if (err) return next(err);
        res.redirect("/articles/" + id);
    });
})


// Delete Single Article
router.get("/:id/delete", (req, res, next) => {
    let id = req.params.id;
    Article.findByIdAndDelete(id, (err, deletedArticle) => {
        if (err) next(err);
        res.redirect("/articles");
    });
})


module.exports = router;