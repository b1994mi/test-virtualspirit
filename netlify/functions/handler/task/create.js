/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
module.exports = async (req, res) => {
    const pgdsn = process.env.PG_DSN
    return res.status(200).json({
        pgdsn
    })
}
