const test = require('node:test')
const assert = require('node:assert')
const create = require('../create')
const mock = require('../../mock')

test('valid body is provided', async (t) => {
    const mockDB = mock.newDB()
    const mockRes = mock.newRes()

    const mockReq = {
        body: {
            title: 'asd',
            description: 'asd',
        }
    }

    const task = { id: '1' }
    mockDB.Task = {
        create: () => (task),
    }

    const r = await create({
        db: mockDB,
    })(mockReq, mockRes)

    assert.equal(r.statusCode, 200, 'status code is different')
    assert.deepStrictEqual(r.body, {
        task
    }, "must contain exact same body for success")
})

test('title is not present in body', async (t) => {
    const mockDB = mock.newDB()
    const mockRes = mock.newRes()

    const mockReq = {
        params: { id: '2' },
        body: {
            description: 'asd',
        }
    }

    const r = await create({
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
        }
    }

    const r = await create({
        db: mockDB,
    })(mockReq, mockRes)

    assert.equal(r.statusCode, 400, 'status code is different')
    assert.deepStrictEqual(r.body, {
        error: 'description must be present and must be a string'
    }, "must contain exact same body for bad request")
})

test('db.Task.create throws an exception', async (t) => {
    const mockDB = mock.newDB()
    const mockRes = mock.newRes()

    const mockReq = {
        params: { id: '2' },
        body: {
            title: 'asd',
            description: 'asd',
        }
    }

    const error = new Error('exceptionMsg')
    mockDB.Task = {
        create: () => (Promise.reject(error)),
    }

    const r = await create({
        db: mockDB,
    })(mockReq, mockRes)

    assert.equal(r.statusCode, 422, 'status code is different')
    assert.deepStrictEqual(r.body, {
        error
    }, "must contain exact same body for unprocessable entity")
})
