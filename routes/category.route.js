const express = require('express')
const router = express.Router()
const uploadMulter = require('../middlewares/upload.js')
const validation = require('../middlewares/validation.js')
const {
    createCategory
} = require('../controllers/category.controllers')

router.post('/category', uploadMulter, validation, createCategory)

module.exports = router