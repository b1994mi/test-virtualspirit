const { Router } = require('express')
const DI = require('../dependencyInjection')
const create = require('./create')

const router = Router()
router.post('/', create(DI));

module.exports = router
