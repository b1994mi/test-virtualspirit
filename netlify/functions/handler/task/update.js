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

        const {
            title,
            description,
            completed,
        } = req.body

        if (!title || typeof title !== 'string') {
            return res.status(400).json({
                error: 'title must be present and must be a string'
            })
        }

        if (!description || typeof description !== 'string') {
            return res.status(400).json({
                error: 'description must be present and must be a string'
            })
        }

        if (typeof completed !== 'boolean' && typeof completed !== 'undefined') {
            return res.status(400).json({
                error: 'completed must be boolean'
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
            await db.Task.update({
                title,
                description,
                completed,
            }, {
                where: { id },
            })
        } catch (error) {
            return res.status(422).json({ error })
        }

        return res.status(200).json({ acknowledge: true })
    }
}
