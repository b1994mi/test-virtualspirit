const { Router } = require('express')
const DI = require('../dependencyInjection')
const findPaged = require('./findPaged')
const create = require('./create')
const find = require('./find')
const update = require('./update')
const updateCompleted = require('./updateCompleted')
const deleteHandler = require('./delete')

const router = Router()
router.get('/', findPaged(DI))
router.post('/', create(DI))
router.get('/:id', find(DI))
router.put('/:id', update(DI))
router.patch('/:id', updateCompleted(DI))
router.delete('/:id', deleteHandler(DI))

module.exports = router
