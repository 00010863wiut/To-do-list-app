const express = require('express')
const router = express.Router()
const fs = require("fs");

router.get('/v1/tasks', (req, res) => {

    fs.readFile("./data/tasks.json", (err, data) => {
        if (err) throw err;

        const tasks = JSON.parse(data);
        res.json(tasks)
    });
});

router.get('/v1/tasks/fetch', (req, res) => {
res.render('fetch')
    });

module.exports = router