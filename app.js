require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const uri = process.env.MONGO_STR;
mongoose.connect(uri)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

app.use(cors());
app.use(cors({ origin: '*' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const User_Router = require('./api/v1/routes/user');
app.use('/users', User_Router);

const Pets_Router = require('./api/v1/routes/pets');
app.use('/pets', Pets_Router);

app.get('/resetpass', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'resetpassword.html'));
});

module.exports = app;
