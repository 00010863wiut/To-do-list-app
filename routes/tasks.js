const express = require('express')
const router = express.Router()
const fs = require("fs");

router.get('/', (req, res) => {
    fs.readFile("./data/tasks.json", (err, data) => {
        if (err) throw err;

        const tasks = JSON.parse(data);

        let task = tasks.filter((task) => !task.saved);

        res.render("tasks", { tasks: task });
    });
});

    router.get("/:id", (req, res) => {
        const id = req.params.id;
    
        fs.readFile("./data/tasks.json", (err, data) => {
            if (err) throw err;
    
            const tasks = JSON.parse(data);
    
            const task = tasks.filter((task) => task.id == id)[0];
    
            res.render("detail", { task: task });
        });
})


module.exports = router

