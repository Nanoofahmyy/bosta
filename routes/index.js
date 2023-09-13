const express = require('express');
const router = express.Router();

const user = require('./users')
router.use('/user', user)

const checkUrl = require('./checkUrl')
router.use('/checkUrl', checkUrl)

const report = require('./reports')
router.use('/report', report)




module.exports = router