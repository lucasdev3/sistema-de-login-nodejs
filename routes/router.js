const express = require('express');
const router = express.Router();


const authController = require('../controllers/authController')

// router para as views
router.get('/', authController.isAuthenticated, (req, res) => {

    res.render('index', {user: req.user});
});

router.get('/login', (req, res) => {
    res.render('login', {alert: false});
});

router.get('/register', (req, res) => {
    res.render('register');
});

// router para os metodos do controlador 

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

module.exports = router;