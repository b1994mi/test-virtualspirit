const express = require('express')
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const cors = require('cors')
const task = require('./handler/task')
const dotenv = require('dotenv')

// load all environment variables
dotenv.config()

// instantiate the main express app
const api = express()

// register middlewares
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: true }))
api.use(cors())

// register handlers
const router = express.Router()
router.use('/tasks', task)

// register the routes
api.use('/api/v1', router)

// NOTE: according to express documentation, these special middleware
// must be the last to be registered for handling page/route not found
api.use((req, res, next) => {
    res.status(404).json({ message: "Sorry can't find that!" })
})

// and for handling unexpected error
api.use((err, req, res, next) => {
    res.status(500).send({
        error: 'Ooops, internal server error, my bad',
    })
})

// export as a serverless function
exports.handler = serverless(api)
