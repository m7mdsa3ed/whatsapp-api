const express = require('express');
const router = express.Router()
const MainController = require('../app/Http/Controllers/MainController');
const HomeController = require('../app/Http/Controllers/HomeController');
const Authentication = require('../app/Http/Middlewares/Authentication');
const AuthenticationController = require('../app/Http/Controllers/AuthenticationController');


router.get('/', HomeController.index)
router.get('/jobs', Authentication, HomeController.getJobs)
router.post('/delete-job', Authentication, HomeController.deleteJob)

router.post('/generate', AuthenticationController.generate)

router.post('/connect', Authentication, MainController.connect)
router.get('/render/qr/:name', MainController.renderQR)
router.get('/connections', Authentication, MainController.connections)
router.get('/get-messages', Authentication, MainController.getMessages)
router.post('/send-message', Authentication, MainController.sendMessage)
router.post('/schedule-message', Authentication, MainController.scheduleMessage)
router.get('/get-quotes', Authentication, MainController.getQuotes)
router.post('/save-quote', Authentication, MainController.saveQuote)
router.post('/delete-quote', Authentication, MainController.deleteQuote)
router.get('/random-quote', Authentication, MainController.getRandomQuote)
router.post('/daily-quote', Authentication, MainController.dailyQuote)
router.post('/reset-queue', Authentication, MainController.resetQueue)

module.exports = router;
