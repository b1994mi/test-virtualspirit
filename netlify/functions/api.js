const express = require('express')
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const task = require('./handler/task')
const dotenv = require('dotenv')


dotenv.config()

const api = express()

api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: true }))

const router = express.Router()
router.get('/hello', (req, res) => res.json({ acknowledge: true }))

router.use('/tasks', task)

api.use('/api/v1', router)

exports.handler = serverless(api)
