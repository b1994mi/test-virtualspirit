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

        let task
        try {
            task = await db.Task.create({
                title,
                description,
                // it is assumed that in the requirement
                // `completed` column is always false on create
                // and can only be changed in update endpoint
                completed: false,
            })
        } catch (error) {
            return res.status(422).json({ error })
        }

        return res.status(200).json({ task })
    }
}
