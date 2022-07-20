var express = require("express");
const Article = require("../models/articles");
var router = express.Router();
var Comment = require("../models/comments");
// likes
router.get("/:cmntId/likes", (req, res, next) => {
    let id = req.params.cmntId;
    Comment.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, comment) => {
        if (err) return next(err);
        res.redirect("/articles/" + comment.articleId);
    });
})

// unlike
router.get("/:cmntId/unlike", (req, res, next) => {
    let id = req.params.cmntId;
    Comment.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, comment) => {
        if (err) return next(err);
        res.redirect("/articles/" + comment.articleId);
    });
})

// update comment
router.get("/:cmntId/edit", (req, res, next) => {
    let id = req.params.cmntId;
    Comment.findById(id, (err, comment) => {
        if (err) return next(err);
        res.render("updateComment", { comment });
    })
})

// submit to update form
router.post("/:cmntId", (req, res, next) => {
    let id = req.params.cmntId;
    Comment.findByIdAndUpdate(id, req.body, (err, comment) => {
        if (err) return next(err);
        res.redirect("/articles/" + comment.articleId);
    })
})

// delete form
router.get("/:cmntId/delete", (req, res, next) => {
    let id = req.params.cmntId;
    console.log(id);
    Comment.findByIdAndDelete(id, (err, deletedComment) => {
        if (err) return next(err);
        Article.findByIdAndUpdate(deletedComment.articleId, { $pull: { comment: deletedComment.id } }, (err, article) => {
            if (err) return next(err);
            res.redirect("/articles/" + deletedComment.articleId);
            console.log(article);
        })
    })
});

module.exports = router;