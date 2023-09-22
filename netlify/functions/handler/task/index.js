const { Router } = require('express')
const DI = require('../dependencyInjection')
const create = require('./create')

const router = Router()
router.post('/', create(DI))
router.delete('/:id', create(DI))

module.exports = router
