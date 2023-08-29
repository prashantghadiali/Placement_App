const express = require('express');
const router = express.Router();

// getiing employee controller
const employeeController = require('../controller/employee_controller');


// get request with pre route "/emp"
router.get('/signin', employeeController.signIn);

router.get('/signup', employeeController.signUp);

router.get('/emppage', employeeController.empPage);

router.get('/csvdownload', employeeController.csvdown);


// post Requests with pre route "/emp"

router.post('/empreg', employeeController.makeSession);

router.post('/create', employeeController.create);

router.post('/update', employeeController.updateStudent);

module.exports = router;


