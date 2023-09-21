import express from "express"

const app = express()

app.get('/', (req, res) => {
    return res.status(200).json({ acknowledge: true })
})

const port = 5000
app.listen(port, () => {
    console.log(`Server running at server => ${port}`);
})
