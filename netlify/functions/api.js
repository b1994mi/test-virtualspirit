const express = require('express')
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const task = require('./handler/task')
const dotenv = require('dotenv')

// load all environment variables
dotenv.config()

// instantiate the main express app
const api = express()

// register middlewares
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: true }))

// register handlers
const router = express.Router()
router.use('/tasks', task)

// register the routes
api.use('/api/v1', router)

// export as a serverless function
exports.handler = serverless(api)
