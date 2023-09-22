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