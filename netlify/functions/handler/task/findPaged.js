const { GetLimitOffset } = require('../helper')

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
        const page = parseInt(req?.query?.page) || 0
        const size = parseInt(req?.query?.size) || 0
        const completedReq = req?.query?.completed
        const sortReq = req?.query?.sort

        /** @type {import('sequelize').WhereOptions} */
        const where = {}

        if (completedReq) {
            where.completed = completedReq === 'true'
        }

        /** @type {string[][] | null} */
        let order = null
        // for now, I only implement sort by updatedAt descending
        if (sortReq === 'updated-desc') {
            order = [['updatedAt', 'DESC']]
        }

        let tasks
        try {
            const { limit, offset } = GetLimitOffset(page, size)
            tasks = await db.Task.findAll({
                where,
                limit,
                offset,
                order,
            })
        } catch (error) {
            return res.status(422).json({ error })
        }

        return res.status(200).json({
            data: tasks,
            page,
            size,
            total: await db.Task.count({ where }),
        })
    }
}
