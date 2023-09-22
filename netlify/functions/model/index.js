const { Sequelize, DataTypes } = require('sequelize')
const pg = require('pg')

const sequelize = new Sequelize(process.env.PG_DSN, {
    benchmark: true,
    logging: (s, t) => { console.log(`${s} [${t}ms]`) },
    pool: { max: 2, min: 0, idle: 2 },
    define: { underscored: true },
    dialectModule: pg,
})

const db = {
    sequelize,
    Task: require('./Task')(sequelize, DataTypes),
}

Object.entries(db).forEach(([, m]) => {
    if (m.associate) {
        m.associate(db)
    }
})

module.exports = db
