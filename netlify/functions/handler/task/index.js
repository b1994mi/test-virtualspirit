const { Router } = require('express')
const create = require('./create')

const router = Router()
router.post('/', create);

module.exports = router
