const express = require('express');
const carController = require('../controllers/carController');

const router = express.Router();

/* GET home page. */
router.get('/', carController.index);

module.exports = router;
