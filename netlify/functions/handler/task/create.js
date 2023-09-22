/**
 * @typedef {import('../dependencyInjection')} DI
 * @param {DI} param0
 */
module.exports = ({ db }) => {
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    return async (req, res) => {
        const {
            title,
            description,
            completed,
        } = req.body

        let task
        try {
            task = await db.Task.create({
                title,
                description,
                completed
            })
        } catch (error) {
            return res.status(422).json({ error })
        }

        return res.status(200).json({ task })
    }
}
