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

        if (!parseInt(id)) {
            return res.status(400).json({
                error: 'id in URL path is not a number'
            })
        }

        let task
        try {
            task = await db.Task.findOne({ where: { id } })
        } catch (error) {
            return res.status(422).json({ error })
        }

        if (task === null) {
            return res.status(404).json({ error: "task not found" })
        }

        try {
            await db.Task.destroy({ where: { id } })
        } catch (error) {
            return res.status(422).json({ error })
        }

        return res.status(200).json({ acknowledge: true })
    }
}
