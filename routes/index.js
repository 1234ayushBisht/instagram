const express = require('express');
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const { enusureAuthenticated } = require('../config/auth');

const router = express.Router();


router.post('/signup', (req, res) => {
    const { name, userId, email, password, DOB } = req.body.userData;
    const image = req.body.image

    if (!name || !userId || !email || !password || !DOB) {
        res.json({ error: "Please Fill in all fields" })
    }
    else if (password.length < 6) {
        res.json({ error: "Enter six or more digit as your password" })
    }                      
    else if (image === '') {
        res.json({ error: "Please Upload A Valid Profile Image" })
    }
    else {
        User.findOne({ userId: userId })
            .then((user) => {
                if (user) {
                    res.json({ error: `UserID ${userId} Already Exists try to login` })
                } else {
                    User.findOne({ email: email })
                        .then((user_email) => {
                            if (user_email) {
                                res.json({ error: `Entered Email Already Exists try to login` })
                            }
                            else {
                                const newUser = new User({
                                    name,
                                    userId,
                                    email,
                                    password,
                                    DOB,
                                    followers: [],
                                    following: [],
                                    tags: [],
                                    desc: " "
                                });

                                bcrypt.genSalt(10, (err, salt) => {
                                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                                        if (err) throw err;
                                        else{
                                            newUser.password = hash;
                                            
                                            newUser.save()
                                            .then((user) => {
                                                res.json({ success: `You are registered Successfully as ${user.name}.` })
                                            }).catch((err) => {
                                                console.error(err);
                                            });
                                        }
                                    });
                                });
                            }
                        }).catch((err) => {
                            console.error(err);
                        });

                }
            }).catch((err) => {
                console.error(err);
            });
    }

});

router.post('/login', (req, res) => {
    const { userId, password } = req.body;

    if(!userId || !password) {
        res.json({ error: "Please fill in all fields" });
    } else {
        User.findOne({ userId: userId })
            .then(user => {
                if(!user) {
                    res.json({ error: "Invalid UserID or Password" });
                } else  {
                    bcrypt.compare(password, user.password)
                        .then(isMatch => {
                            if(isMatch) {
                                const payload = {
                                    id: user._id,
                                    name: user.name
                                }

                                jwt.sign(payload, JWT_SECRET, { expiresIn:  31556926 }, (err, token) => {
                                    res.json({ success: true, token: "Bearer" + token })
                                })
                            } else {
                                res.json({ error: "Invalid UserID or Password" });
                            }
                        }).catch(err => console.error(err))
                }
            }).catch(err => console.error(err))
    }

});

module.exports = router;