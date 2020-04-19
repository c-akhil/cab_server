const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cabservices = require('./routes/cabservices');
const port = 3000;
app.use(function (req, res, next) {
    console.log(req.url)
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cabdb', { useNewUrlParser: true }, function (err) {
    if (err) {
        console.error('Error occurred while connecting to mongo db', err);
    } else {
        console.log('Successfully connected to MongoDB');
    }
});

app.get('/getListOfCarsNearBy', (req, res) => {
    console.log("getListOfCarsNearBy-reqBody-->", req.query);
    cabservices.getListOfCarsNearBy({ ...req.query }, res);
});

app.post('/bookCab', (req, res) => {
    console.log("bookCab-reqBody-->", req.body);
    cabservices.bookNearByCab({ ...req.body }, res);
});

app.post('/endRide', (req, res) => {
    console.log("endRide-reqBody-->", req.body);
    cabservices.endRide({ ...req.body }, res);
});

app.listen(port, () => console.log(`cab server listening on port ${port}!`))