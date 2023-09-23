const test = require('node:test')
const assert = require('node:assert')
const deleteHandler = require('../delete')
const mock = require('../../mock')

test('valid body is provided', async (t) => {
    const mockDB = mock.newDB()
    const mockRes = mock.newRes()

    const mockReq = {
        params: { id: '2' },
    }

    mockDB.Task = {
        findOne: () => ({ id: '1' }),
        destroy: () => (null),
    }

    const r = await deleteHandler({
        db: mockDB,
    })(mockReq, mockRes)

    assert.equal(r.statusCode, 200, 'status code is different')
    assert.deepStrictEqual(r.body, {
        acknowledge: true
    }, "must contain exact same body for success")
})

test('id is not a number', async (t) => {
    const mockDB = mock.newDB()
    const mockRes = mock.newRes()

    const mockReq = {
        params: { id: 'asd' },
    }

    const r = await deleteHandler({
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
    }

    const error = new Error('exceptionMsg')
    mockDB.Task = {
        findOne: () => (Promise.reject(error)),
    }

    const r = await deleteHandler({
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
    }

    mockDB.Task = {
        findOne: () => (null),
    }

    const r = await deleteHandler({
        db: mockDB,
    })(mockReq, mockRes)

    assert.equal(r.statusCode, 404, 'status code is different')
    assert.deepStrictEqual(r.body, {
        error: "task not found"
    }, "must contain exact same body for not found")
})

test('db.Task.destroy throws an exception', async (t) => {
    const mockDB = mock.newDB()
    const mockRes = mock.newRes()

    const mockReq = {
        params: { id: '2' },
    }

    const error = new Error('exceptionMsg')
    mockDB.Task = {
        findOne: () => ({ id: '1' }),
        destroy: () => (Promise.reject(error)),
    }

    const r = await deleteHandler({
        db: mockDB,
    })(mockReq, mockRes)

    assert.equal(r.statusCode, 422, 'status code is different')
    assert.deepStrictEqual(r.body, {
        error
    }, "must contain exact same body for unprocessable entity")
})
