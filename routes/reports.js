
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticate');
const controller = require('../controllers/reports')

router.get('/getAllReport', authenticateUser , controller.getAllReport)
router.get('/getAllReport/:id(\\d*)?', authenticateUser , controller.getAllReportById)
router.get('/getAllReport/:tags?', authenticateUser ,  controller.getAllReportByTag)



 module.exports = router