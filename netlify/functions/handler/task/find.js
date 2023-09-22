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
        const id = req.params?.id

        let task
        try {
            task = await db.Task.findOne({ id })
        } catch (error) {
            return res.status(422).json({ error })
        }

        if (task === null) {
            return res.status(404).json({ error: "task not found" })
        }

        return res.status(200).json({ task })
    }
}
