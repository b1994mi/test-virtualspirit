const express = require('express')
const serverless = require('serverless-http')
const task = require('./handler/task')

const api = express()

const router = express.Router()
router.get('/hello', (req, res) => res.json({ acknowledge: true }))

router.use('/tasks', task)

api.use('/api/v1', router)

exports.handler = serverless(api)
