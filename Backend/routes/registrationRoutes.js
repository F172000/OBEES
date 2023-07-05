const express = require('express');

////Import controller
const registrationController =require('../controllers/registrationController')

const router = express.Router();



router.post('/login',registrationController.doLogin);



module.exports = router;