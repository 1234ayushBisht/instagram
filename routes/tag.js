const express = require('express');
const { enusureAuthenticated } = require('../config/auth');
const User = require('../model/User');
const Post = require('../model/Post');

const router = express.Router();


router.get('/tagPost/:tag', enusureAuthenticated, (req, res) => {
    let tag_posts = [];
    
    Post.find()
        .then(posts => {
            posts.forEach(post => {
                if (post.desc.split(" ").includes(`#${req.params.tag}`) || post.desc.split(" ").includes(`\n#${req.params.tag}`)) {
                    tag_posts.push(post)
                }
            });

            User.find({ tags: { $in: [req.params.tag] } })
                .then(users => res.json({ success: { posts: tag_posts, followers: users } })).catch(err => console.error(err))
        }).catch(err => console.error(err))
});

router.get('/follow/:tag', enusureAuthenticated, (req, res) => {
    if (req.user.tags.includes(req.params.tag)) {
        User.updateOne({ _id: req.user._id }, { $pull: { tags: req.params.tag } })
            .then(() => {
                User.findOne({ _id: req.user._id })
                    .then(user => {
                        User.find({ tags: { $in: [req.params.tag] } })
                            .then(all_users => {
                                res.json({ success: { message: `Succussfully unfollowing #${req.params.tag}.`, user: user, tag_followers: { users: all_users, len: all_users.length } } })
                            }).catch(err => console.error(err))
                    }).catch(err => console.error(err))
            })
            .catch(err => console.error(err))
    } else {
        User.updateOne({ _id: req.user._id }, { $push: { tags: req.params.tag } })
        .then(() => {
            User.findOne({ _id: req.user._id })
                .then(user => {
                    User.find({ tags: { $in: [req.params.tag] } })
                        .then(all_users => {
                            res.json({ success: { message: `Succussfully following #${req.params.tag}.`, user: user, tag_followers: { users: all_users, len: all_users.length } } })
                        }).catch(err => console.error(err))
                }).catch(err => console.error(err))
        })
        .catch(err => console.error(err))
    }
        
});

module.exports = router; 