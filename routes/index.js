const express = require('express');
const router = express.Router()
const MainController = require('../app/Http/Controllers/MainController');
const HomeController = require('../app/Http/Controllers/HomeController');
const Authentication = require('../app/Http/Middlewares/Authentication');
const AuthenticationController = require('../app/Http/Controllers/AuthenticationController');


router.get('/', HomeController.index)
router.get('/jobs', Authentication, HomeController.getJobs)

router.post('/generate', AuthenticationController.generate)

router.post('/connect', Authentication, MainController.connect)
router.get('/render/qr/:name', MainController.renderQR)
router.get('/connections', Authentication, MainController.connections)
router.post('/send-message', Authentication, MainController.sendMessage)
router.post('/schedule-message', Authentication, MainController.scheduleMessage)

module.exports = router;
