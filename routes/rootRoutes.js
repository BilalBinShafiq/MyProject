const express = require('express');
const { getROot, postRoot } = require('../controllers/rootController')

const router = express.Router();

router
    .route('/')
    .get(getROot)
    .post(postRoot);

module.exports = router;