const test = require('node:test')
const assert = require('node:assert')
const update = require('../update')
const mock = require('../../mock')

// NOTE: for testing with local DB and checking the generated SQL by sequelize;
// you need to change `skip` to `false` for this test to run;
// you also might want to use the debugger to check values line by line.
test('ONLY FOR LOCAL TESTING', { skip: true }, async (t) => {
    // some imports is done here so that they won't be loaded if this test is not run
    require('dotenv').config() // load all variables from .env
    const { Sequelize, DataTypes } = require('sequelize')
    const pg = require('pg')

    const sequelize = new Sequelize(process.env.PG_DSN, {
        benchmark: true,
        logging: (s, t) => { console.log(`${s} [${t}ms]`) },
        pool: { max: 1, min: 0, idle: 1 },
        define: { underscored: true },
        dialectModule: pg,
    })

    const db = {
        sequelize,
        Task: require('../../../model/Task')(sequelize, DataTypes),
    }

    const mockRes = mock.newRes()
    const mockReq = {
        params: { id: '10' },
        body: {
            title: 'asdasd',
            description: 1,
            completed: false,
        }
    }

    const r = await update({ db })(mockReq, mockRes)
    console.log(JSON.stringify(r))
})

test('valid body is provided', async (t) => {
    const mockDB = mock.newDB()
    const mockRes = mock.newRes()

    const mockReq = {
        params: { id: '2' },
        body: {
            title: 'asd',
            description: 'asd',
            completed: true,
        }
    }

    mockDB.Task = {
        findOne: () => ({ id: '1' }),
        update: () => (null),
    }

    const r = await update({
        db: mockDB,
    })(mockReq, mockRes)

    assert.equal(r.statusCode, 200, 'status code is different')
    assert.deepStrictEqual(r.body, {
        acknowledge: true
    }, "must contain exact same body for success")
})

test('title is not present in body', async (t) => {
    const mockDB = mock.newDB()
    const mockRes = mock.newRes()

    const mockReq = {
        params: { id: '2' },
        body: {
            description: 'asd',
            completed: true,
        }
    }

    const r = await update({
        db: mockDB,
    })(mockReq, mockRes)

    assert.equal(r.statusCode, 400, 'status code is different')
    assert.deepStrictEqual(r.body, {
        error: 'title must be present and must be a string'
    }, "must contain exact same body for bad request")
})

test('description is not present in body', async (t) => {
    const mockDB = mock.newDB()
    const mockRes = mock.newRes()

    const mockReq = {
        params: { id: '2' },
        body: {
            title: 'asd',
            completed: true,
        }
    }

    const r = await update({
        db: mockDB,
    })(mockReq, mockRes)

    assert.equal(r.statusCode, 400, 'status code is different')
    assert.deepStrictEqual(r.body, {
        error: 'description must be present and must be a string'
    }, "must contain exact same body for bad request")
})

test('completed is not a boolean', async (t) => {
    const mockDB = mock.newDB()
    const mockRes = mock.newRes()

    const mockReq = {
        params: { id: '2' },
        body: {
            title: 'asd',
            description: 'asd',
            completed: "true",
        }
    }

    const r = await update({
        db: mockDB,
    })(mockReq, mockRes)

    assert.equal(r.statusCode, 400, 'status code is different')
    assert.deepStrictEqual(r.body, {
        error: 'completed must be boolean'
    }, "must contain exact same body for bad request")
})

test('id is not a number', async (t) => {
    const mockDB = mock.newDB()
    const mockRes = mock.newRes()

    const mockReq = {
        params: { id: 'asd' },
        body: {
            title: 'asd',
            description: 'asd',
            completed: "true",
        }
    }

    const r = await update({
        db: mockDB,
    })(mockReq, mockRes)

    assert.equal(r.statusCode, 400, 'status code is different')
    assert.deepStrictEqual(r.body, {
        error: 'id in URL path is not a number'
    }, "must contain exact same body for bad request")
})

test('db.Task.findOne throws an exception', async (t) => {
    const mockDB = mock.newDB()
    const mockRes = mock.newRes()

    const mockReq = {
        params: { id: '2' },
        body: {
            title: 'asd',
            description: 'asd',
            completed: true,
        }
    }

    const error = new Error('exceptionMsg')
    mockDB.Task = {
        findOne: () => (Promise.reject(error)),
    }

    const r = await update({
        db: mockDB,
    })(mockReq, mockRes)

    assert.equal(r.statusCode, 422, 'status code is different')
    assert.deepStrictEqual(r.body, {
        error
    }, "must contain exact same body for unprocessable entity")
})

test('task not found', async (t) => {
    const mockDB = mock.newDB()
    const mockRes = mock.newRes()

    const mockReq = {
        params: { id: '2' },
        body: {
            title: 'asd',
            description: 'asd',
            completed: true,
        }
    }

    mockDB.Task = {
        findOne: () => (null),
    }

    const r = await update({
        db: mockDB,
    })(mockReq, mockRes)

    assert.equal(r.statusCode, 404, 'status code is different')
    assert.deepStrictEqual(r.body, {
        error: "task not found"
    }, "must contain exact same body for not found")
})

test('db.Task.update throws an exception', async (t) => {
    const mockDB = mock.newDB()
    const mockRes = mock.newRes()

    const mockReq = {
        params: { id: '2' },
        body: {
            title: 'asd',
            description: 'asd',
            completed: true,
        }
    }

    const error = new Error('exceptionMsg')
    mockDB.Task = {
        findOne: () => ({ id: '1' }),
        update: () => (Promise.reject(error)),
    }

    const r = await update({
        db: mockDB,
    })(mockReq, mockRes)

    assert.equal(r.statusCode, 422, 'status code is different')
    assert.deepStrictEqual(r.body, {
        error
    }, "must contain exact same body for unprocessable entity")
})
