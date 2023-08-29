const express = require('express');
const router = express.Router();

// getiing student controller
const studentController = require("../controller/student_controller");

// get requests with pre tag "/stdlist"
router.get('/', studentController.stdlist);

// post requests with pre tag "/stdlist"

router.post('/studentcreate', studentController.student);


module.exports = router;