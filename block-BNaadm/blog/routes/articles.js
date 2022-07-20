var express = require('express');
var router = express.Router();
var Article = require("../models/articles");
var Comment = require("../models/comments");

/* GET article form. */
router.get('/new', (req, res, next) => {
    res.render("articleForm");
});

// POST article form
router.post("/", (req, res, next) => {
    req.body.tags = req.body.tags.trim().split(",");
    console.log(req.body.tags, typeof req.body.tags, );
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
    let id = req.params.id;
    Article.findById(id).populate("comment").exec((err, article) => {
        if (err) return next(err);
        res.render("articleDetail", { article });
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
    req.body.tags = req.body.tags.trim().split(",");
    let id = req.params.id;
    Article.findByIdAndUpdate(id, req.body, (err, updatedArticle) => {
        if (err) return next(err);
        res.redirect("/articles/" + id);
    });
})

// likes 
router.get("/:id/likes", (req, res, next) => {
        let id = req.params.id;
        Article.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, article) => {
            if (err) return next(err);
            res.redirect("/articles/" + id);
        })
    })
    // unlike
router.get("/:id/unlike", (req, res, next) => {
    let id = req.params.id;
    Article.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, article) => {
        if (err) return next(err);
        res.redirect("/articles/" + id);
    })
})


// Delete Single Article
router.get("/:id/delete", (req, res, next) => {
    let id = req.params.id;
    Article.findByIdAndDelete(id, (err, deletedArticle) => {
        if (err) next(err);
        Comment.deleteMany({ articleId: deletedArticle.id }, (err, comment) => {
            if (err) return next(err);
            res.redirect("/articles");
        })
    });
})

// Display comment box
router.post("/:id/comments", (req, res, next) => {
    let id = req.params.id;
    req.body.articleId = id;
    Comment.create(req.body, (err, comment) => {
        if (err) return next(err);
        Article.findByIdAndUpdate(id, { $push: { comment: comment.id } }, (err, article) => {
            if (err) return next(err);
            res.redirect("/articles/" + id);
        });
    });
})

module.exports = router;