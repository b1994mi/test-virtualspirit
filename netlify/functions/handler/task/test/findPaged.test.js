const test = require('node:test')
const assert = require('node:assert')
const findPaged = require('../findPaged')
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
        query: {
            page: '1',
            size: '2',
            completed: 'true',
            sort: 'updated-desc',
        }
    }

    const r = await findPaged({ db })(mockReq, mockRes)
    console.log(JSON.stringify(r))
})

test('valid query params are provided', async (t) => {
    const mockDB = mock.newDB()
    const mockRes = mock.newRes()

    const page = 1, size = 2
    const mockReq = {
        params: { id: '2' },
        query: {
            page,
            size,
            completed: 'true',
            sort: 'updated-desc',
        }
    }

    const data = { id: '1' }, total = 1
    mockDB.Task = {
        findAll: () => (data),
        count: () => total,
    }

    const r = await findPaged({
        db: mockDB,
    })(mockReq, mockRes)

    assert.equal(r.statusCode, 200, 'status code is different')
    assert.deepStrictEqual(r.body, {
        data,
        page,
        size,
        total,
    }, "must contain exact same body for success")
})

test('no query param provided', async (t) => {
    const mockDB = mock.newDB()
    const mockRes = mock.newRes()

    const mockReq = {
        params: { id: '2' },
        query: {}
    }

    const data = { id: '1' }, total = 1
    mockDB.Task = {
        findAll: () => (data),
        count: () => total,
    }

    const r = await findPaged({
        db: mockDB,
    })(mockReq, mockRes)

    assert.equal(r.statusCode, 200, 'status code is different')
    assert.deepStrictEqual(r.body, {
        data,
        page: 0,
        size: 0,
        total,
    }, "must contain exact same body for success")
})

test('db.Task.findAll throws an exception', async (t) => {
    const mockDB = mock.newDB()
    const mockRes = mock.newRes()

    const page = 1, size = 2
    const mockReq = {
        params: { id: '2' },
        query: {
            page,
            size,
            completed: 'true',
            sort: 'updated-desc',
        }
    }

    const error = new Error('exceptionMsg')
    mockDB.Task = {
        findAll: () => (Promise.reject(error)),
        count: () => total,
    }

    const r = await findPaged({
        db: mockDB,
    })(mockReq, mockRes)

    assert.equal(r.statusCode, 422, 'status code is different')
    assert.deepStrictEqual(r.body, {
        error
    }, "must contain exact same body unprocessable entity")
})
