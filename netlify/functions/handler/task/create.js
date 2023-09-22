/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
module.exports = async (req, res) => {
    return res.status(200).json({
        data: [
            "hello darkness my old friend",
            "I've come to talk with you again",
            "because a vision sofly creeping",
            "left it's seeds while I was sleeping",
            "and the vision that was planted in my brain",
            "still remains",
            "within the sound of silence",
        ]
    })
}
