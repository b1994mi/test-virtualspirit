/**
 * A simple helper to get limit & offset for SQL from page & size query param
 * @param {number} page
 * @param {number} size
 * @typedef {Object} LimOff
 * @property {number | null} limit nullable to omit from generated SQL by sequelize
 * @property {number | null} offset nullable to omit from generated SQL by sequelize
 * @returns {LimOff} A simple object consists of limit & offset for SQL
 */
function GetLimitOffset(page, size) {
    let limit = size, offset = 0

    if (!page || !size || page <= 0 || size <= 0) {
        limit = null
        offset = null
        return { limit, offset }
    }

    offset = (page - 1) * size
    return { limit, offset }
}

module.exports = {
    GetLimitOffset
}
