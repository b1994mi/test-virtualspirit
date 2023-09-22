const db = require('../../model')

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
module.exports = async (req, res) => {
    const task = db.Task.create({
        title: 'hardcoded',
        description: 'hardcoded',
        completed: false,
    })

    return res.status(200).json({
        task
    })
}
