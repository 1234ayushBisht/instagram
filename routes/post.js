const express = require('express');
const { enusureAuthenticated } = require('../config/auth');
const User = require('../model/User');
const Post = require('../model/Post');


const router = express.Router();

router.post('/add', enusureAuthenticated, (req, res) => {
    const mediaURL = req.body.mediaURL;
    const desc = req.body.desc;

    if (!mediaURL || !desc) {
        return res.json({ error: "Please Add File and description" })
    }
    const newPost = new Post({
        user: req.user.userId,
        desc: desc,
        mediaURL: mediaURL,
        likes: [],
        comments: []
    })

    newPost.save()
        .then(post => {
            res.json({ success: "Post Posted successfully", post: post })
        }).catch(err => console.error(err))
});

router.put('/comment/:id', enusureAuthenticated, (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            if (!post) {
                res.status(404).json({ error: "Post Not found" })
            } else {
                if (!req.body.comment) {
                    return res.json({ error: "Please Add A comment" })
                }
                Post.updateOne({ _id: post._id }, { $push: { comments: [[req.user.userId, req.body.comment]] } })
                    .then(() => {
                        Post.findOne({ _id: req.params.id })
                            .then(updated_post => res.json({ success: { message: "Comment Added Successfully", post: updated_post } }))
                            .catch(err => console.error(err));
                    }).catch(err => console.error(err));
            }
        }).catch(err => console.error(err));
});

router.put('/like/:id', enusureAuthenticated, (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            if (!post) {
                res.status(404).json({ error: "Post Not found" })
            } else {
                if (post.likes.includes(req.user.userId)) {
                    Post.updateOne({ _id: post._id }, { $pull: { likes: req.user.userId } })
                        .then(() => {
                            Post.findOne({ _id: req.params.id })
                                .then(updated_post => res.json({ success: { message: "Post Unliked Successfully", post: updated_post } }))
                                .catch(err => console.error(err));
                        })
                        .catch(err => console.error(err));
                } else {
                    Post.updateOne({ _id: post._id }, { $push: { likes: req.user.userId } })
                        .then(() => {
                            Post.findOne({ _id: req.params.id })
                                .then(updated_post => res.json({ success: { message: "Post Liked Successfully", post: updated_post } }))
                                .catch(err => console.error(err));
                        })
                        .catch(err => console.error(err));
                }
            }
        }).catch(err => console.error(err));
});

router.get('/get-post/:id', enusureAuthenticated, (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            if (!post) {
                res.status(404).json({ error: "Post Not found" })
            }
            res.json({ success: { post: post } })
        }).catch(err => console.error(err));
});

router.get('/getPosts', enusureAuthenticated, (req, res) => {
    Post.find({ user: { $in: [...req.user.following, req.user.userId] } })
        .then(posts => {
            res.json({ success: posts })
        }).catch(err => console.error(err))
});

router.delete('/delete/:id', enusureAuthenticated, (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            if (!post) {
                res.json({ error: "Post Not found" })
            }
            Post.deleteOne({ _id: req.params.id })
                .then(() => res.json({ success: "Post Deleted Successfully." }))
                .catch(err => console.error(err))
        }).catch(err => console.error(err))
});

router.get('/getLikedPost', enusureAuthenticated, (req, res) => {
    Post.find({ likes: { $in: [req.user.userId] } })
        .then(posts => {
            res.json({ success: posts })
        }).catch(err => console.error(err))
});


module.exports = router; 