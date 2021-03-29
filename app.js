const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('Hello')
})

app.listen(8080, err => {
    if (err) console.log(err)

    console.log('Server is running on port 8080..')
})