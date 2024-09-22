const express = require('express');
const {
    getAllProxies,
    AddProxy,
    getProxy,
    updateProxy,
    deleteProxy
} = require('../controllers/proxyController')

const router = express.Router();

router
    .route('/')
    .get(getAllProxies)
    .post(AddProxy);

router
    .route('/:host')
    .get(getProxy)
    .put(updateProxy)
    .delete(deleteProxy);

module.exports = router;