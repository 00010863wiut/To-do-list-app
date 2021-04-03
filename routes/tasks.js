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

router.get("/:id/saved", function (req, res) {
    fs.readFile("./data/tasks.json", (err, data) => {
        if (err) throw err;

        const id = req.params.id;
        const tasks = JSON.parse(data);
        let index = tasks.findIndex((e) => e.id == id);
        tasks[index].saved = true;
        let savedTasks = [];
        savedTasks = tasks.filter((task) => task.saved === true);

        fs.writeFile("./data/tasks.json", JSON.stringify(tasks), (err) => {
            if (err) throw err;

            res.render("saved", { tasks: savedTasks });
        });
    });
});

router.get("/:id/unsave", function (req, res) {
    const id = req.params.id;

    fs.readFile("./data/tasks.json", function (err, data) {
        if (err) throw err;

        const tasks = JSON.parse(data);
        let index = tasks.findIndex((e) => e.id == id);
        tasks[index].saved = false;
        let unsavedTasks = [];
        unsavedTasks = tasks.filter((task) => task.saved === false);

    fs.writeFile("./data/tasks.json", JSON.stringify(tasks), (err) => {
         if (err) throw err;

         res.render("tasks", { tasks: unsavedTasks });
        });
    });
});

route.get('/:id/delete', function (req, res) {
    fs.readFile("./data/tasks.json", function (err, data) {
        if (err) throw err;
        const id = req.params.id
        const tasks = JSON.parse(data)
        const index = tasks.findIndex((e) => e.id == id)
        tasks.splice(index, 1)

        fs.writeFile('./data/tasks.json', JSON.stringify(tasks), (err) => {
            if (err) throw err

            res.redirect('/tasks')

        })

    })
});

route.get('/:id/edit', (req, res) => {
    const id = req.params.id
    fs.readFile('./data/tasks.json', (err, data) => {
        if (err) throw err
        
        const tasks = JSON.parse(data)
        const task = tasks.filter(task => task.id == id)[0]
        res.render('edit', {task: task})
    })
})

app.post('/:id/edit', (req, res) => {
    const id = req.params.id

    const title = req.body.title
    const datetime = req.body.datetime
    const description = req.body.description

    fs.readFile('./data/tasks.json', (err, data) => {
        if (err) throw err

        const tasks = JSON.parse(data)
        const index = tasks.findIndex(task => task.id == id)

        tasks[index].title = title
        tasks[index].datetime = datetime
        tasks[index].description = description

        fs.writeFile('./data/tasks.json', JSON.stringify(tasks), err => {
         if (err) throw err
        })
        res.redirect('/tasks')
    })
})


module.exports = router

