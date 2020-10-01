const express = require('express');
const mongoose = require('mongoose');
const { mongoURI } = require('./config/keys');
const passport = require('passport');
const http = require('http');

const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('connected', () => console.log("MonogoDB Connected..."));
mongoose.connection.on('error', (err) => console.error(err));

app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/api', require('./routes/index'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/post', require('./routes/post'));
app.use('/api/tag', require('./routes/tag'));


const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV == "production") {
    app.use(express.static("first-react-app/build"))
    const path = require("path")
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, "client", "build", "index.html")))
}

app.listen(PORT, () => console.log(`Server Started at port ${PORT}`));