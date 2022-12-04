const express = require('express');
const router = express.Router()
const MainController = require('../app/Http/Controllers/MainController');
const HomeController = require('../app/Http/Controllers/HomeController');
const Authentication = require('../app/Http/Middlewares/Authentication');

router.get('/', HomeController.index)

router.post('/connect', Authentication, MainController.connect)
router.get('/render/qr/:name', MainController.renderQR)
router.post('/connections', Authentication, MainController.connections)
router.post('/send-message', Authentication, MainController.sendMessage)

module.exports = router;
