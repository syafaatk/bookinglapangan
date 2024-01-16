// controllers/HomeController.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home/home'); // Assuming you set up your views directory properly
});

router.get('/detail', (req, res) => {
    res.render('home/homedetail'); // Assuming you set up your views directory properly
});


module.exports = router;
