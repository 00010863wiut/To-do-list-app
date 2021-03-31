const express = require("express");
const app = express();

const fs = require("fs");
const { Validator } = require("node-input-validator");

app.set("view engine", "pug");

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/create", (req, res) => {
    res.render("create");
});

app.post("/create", (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const datetime = req.body.datetime;

    //input validation with library NIV
    const v = new Validator(req.body, {
        title: "required|minLength:5",
        description: "maxLength:100",
        datetime: "required",
    });

    v.check().then((matched) => {
        if (!matched) {
            res.status(422).render("create", { error: v.errors.title.message });
            // res.status(422).send(v.errors);
        } else {
            fs.readFile("./data/tasks.json", function (err, data) {
                if (err) throw err;

                const tasks = JSON.parse(data);

                tasks.push({
                    id: id(),
                    title: title,
                    datetime: datetime,
                    description: description,
                });

                fs.writeFile("./data/tasks.json", JSON.stringify(tasks), (err) => {
                    if (err) throw err;

                    res.render("create", { success: true });
                });
            });
        }
    });
});

app.get("/tasks", (req, res) => {
    fs.readFile("./data/tasks.json", (err, data) => {
        if (err) throw err;

        const tasks = JSON.parse(data);

        let task = tasks.filter((task) => !task.saved);

        res.render("tasks", { tasks: task });
    });
});

app.get("/tasks/:id", (req, res) => {
    const id = req.params.id;

    fs.readFile("./data/tasks.json", (err, data) => {
        if (err) throw err;

        const tasks = JSON.parse(data);

        const task = tasks.filter((task) => task.id == id)[0];

        res.render("detail", { task: task });
    });
});

// app.delete('/tasks/:id/delete', function(req, res) {

//     const id = req.params.id
//     const tasks = JSON.parse(data)
//     const index = tasks.findIndex((e) => e.id == id)
//     tasks.splice(index, 1)

//  fs.writeFile('./data/tasks.json', JSON.stringify(tasks), (err) => {
//    if (err) throw err

//     res.render('tasks', { tasks: tasks})
//  })

// })

//archive

app.get("/tasks/:id/saved", function (req, res) {
    fs.readFile("./data/tasks.json", (err, data) => {
        if (err) throw err;

        const id = req.params.id;
        const tasks = JSON.parse(data);
        let index = tasks.findIndex((e) => e.id == id);
        tasks[index].saved = true;
        let savedTasks = [];
        savedTasks = tasks.filter((task) => task.saved === true);
        res.render("saved", { tasks: savedTasks });

        fs.writeFile("./data/tasks.json", JSON.stringify(tasks), (err) => {
            if (err) throw err;

            res.render("saved", { tasks: savedTasks });
        });
    });
});

app.get("/tasks/:id/unsave", function (req, res) {
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

app.get("/saved", (req, res) => {
    fs.readFile("./data/tasks.json", (err, data) => {
        if (err) throw err;

        const tasks = JSON.parse(data);
        let savedTasks = [];
        savedTasks = tasks.filter((task) => task.saved === true);

        fs.writeFile("./data/tasks.json", JSON.stringify(tasks), (err) => {
            if (err) throw err;
            res.render("saved", { tasks: savedTasks });
        });
    });
});

app.listen(8200, (err) => {
    if (err) console.log(err);

    console.log("Server is running on port 8200..");
});

function id() {
    return "_" + Math.random().toString(36).substr(2, 9);
}
