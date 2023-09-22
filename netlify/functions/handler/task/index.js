const { Router } = require('express')
const DI = require('../dependencyInjection')
const findPaged = require('./findPaged')
const create = require('./create')
const find = require('./find')
const deleteHandler = require('./delete')

const router = Router()
router.get('/', findPaged(DI))
router.post('/', create(DI))
router.get('/:id', find(DI))
router.delete('/:id', deleteHandler(DI))

module.exports = router
