function newDB() {
    const mockDB = {
        sequelize: {
            // NOTE: this can be used for mocking trx
            // transaction: function () {
            //     return {
            //         commit: function () { },
            //         rollback: function () { },
            //     }
            // },
        },
    }

    return mockDB
}

function newRes() {
    const mockRes = {
        statusCode: 0,
        body: {},
        status: function (e) {
            this.statusCode = e
            return this
        },
        json: function (e) {
            this.body = e
            return this
        }
    }

    return mockRes
}

// NOTE: a function that returns new Object makes
// better intellisense rather than using Class
module.exports = {
    newDB,
    newRes,
}
