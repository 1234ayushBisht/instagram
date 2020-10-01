const express = require('express');
const { enusureAuthenticated } = require('../config/auth');
const User = require('../model/User');
const Post = require('../model/Post');

const router = express.Router();

router.put('/follow/:userId', enusureAuthenticated, (req, res) => {
    User.findOne({ userId: req.params.userId })
        .then(user => {
            if(!user) {
                res.status(404).json({ error: "User Not Found" })
            }
            else {
                if (user.followers.includes(req.user.userId)) {
                    User.updateOne({ userId: user.userId }, { $pull: { followers: req.user.userId } })
                        .then(() => {
                            User.updateOne({ userId: req.user.userId }, { $pull: { following: user.userId } })
                                .then(() => {
                                    User.findOne({ userId: user.userId })
                                        .then(new_user => res.json({ success: { message: "User Unfollowed Successfully", user: new_user } }))
                                }).catch(err => console.error(err))
                        }).catch(err => console.error(err))
                }
                else {
                    User.updateOne({ userId: user.userId }, { $push: { followers: req.user.userId } })
                        .then(() => {
                            User.updateOne({ userId: req.user.userId }, { $push: { following: user.userId } })
                                .then(() => {
                                    User.findOne({ userId: user.userId })
                                        .then(new_user => res.json({ success: { message: "User Followed Successfully", user: new_user } }))
                                }).catch(err => console.error(err))
                        }).catch(err => console.error(err))
                }
            }
        }).catch(err => console.error(err))
});


router.get('/get-user', enusureAuthenticated, (req, res) => {
    Post.find({ user: req.user.userId })
        .then(posts => res.json({ success: { user: req.user, posts: posts } }))
        .catch(err => console.error(err));
});

router.get('/get-profile/:userId', enusureAuthenticated, (req, res) => {
    User.findOne({ userId: req.params.userId })
        .then(user => {
            if(!user) {
                return res.status(404).json({ error: "User Not Found" })
            }
            Post.find({ user: user.userId })
                .then(posts => res.json({ success: { user: user, posts: posts } }))
                .catch(err => console.error(err));
        }).catch(err => console.error(err));
});

router.get('/get-search-result', enusureAuthenticated, (req, res) => {
    const query = req.query.query;

    if(query) {
        User.find({ userId : { $regex: query, $options: 'i' } },)
            .then(users => res.json({ success: users }))
            .catch(err => console.error(err));  
    }
});

router.post('/update-desc', enusureAuthenticated, (req, res) => {
    const desc = req.body.desc;

    User.updateOne({ _id: req.user._id }, { desc: desc })
        .then(() => {
            User.findById(req.user._id)
                .then(updated_user => {
                    res.json({
                        success: "Description Updated Successfully",
                        user: updated_user
                    })
                }).catch(err => console.error(err))
        }).catch(err => console.error(err))
});


const escapeRegex = (str) =>  {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const shuffle = (arr) => {
    const list = []
    const shuffled_list = []

    arr.forEach(item => {
        randomValue = Math.floor(100 * Math.random())
        list.push([randomValue , item])
    })

    let sorted_list = list.sort()

    sorted_list.forEach(item => shuffled_list.push(item[1]))
    
    return shuffled_list
}


module.exports = router;