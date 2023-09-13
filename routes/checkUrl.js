
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticate');
const controller = require('../controllers/checkUrl')


router.post('/createCheck', authenticateUser, controller.createCheck)
router.get('/getAllCheck', authenticateUser, controller.getAllCheck)
router.get('/getAllCheck/:id(\\d*)?', authenticateUser , controller.getAllCheckById)
router.get('/getAllCheck/:tags', authenticateUser, controller.getAllCheckByTag)
router.put('/updateCheck/:id(\\d*)?', authenticateUser , controller.updateCheck)
router.delete('/deleteCheck/:id(\\d*)?', authenticateUser , controller.deleteCheck)


 module.exports = router