const express = require("express");
const app = express();

const fs = require("fs");
const { Validator } = require("node-input-validator");

app.set("view engine", "pug");

const tasks = require('./routes/tasks.js')
app.use('/tasks', tasks)

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.render("home");
});

app.route('/create')
    .get((req, res) => {
        res.render("create");
    })
    .post((req, res) => {
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
                // for (let key in errors) {
                //     console.log(key, error[key]);
                //   }
                res.status(422).render("create", { error: v.errors.title.message });
               
                // res.status(422).send(v.errors);
            } else {
                fs.readFile("./data/tasks.json", function (err, data) {
                    if (err) throw err;
                    console.log('2')

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

app.get('/tasks/:id/delete', function (req, res) {
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

app.get("/saved", (req, res) => {
    fs.readFile("./data/tasks.json", (err, data) => {
        if (err) throw err;

        const tasks = JSON.parse(data);
        let savedTasks = [];
        savedTasks = tasks.filter((task) => task.saved === true);

        res.render("saved", { tasks: savedTasks });
    });
});

app.get("/api/v1/tasks", (req, res) => {
    fs.readFile("./data/tasks.json", (err, data) => {
        if (err) throw err;

        const tasks = JSON.parse(data);
        res.json(tasks)
    });
})

app.listen(8200, (err) => {
    if (err) console.log(err);

    console.log("Server is running on port 8200..");
});

function id() {
    return "_" + Math.random().toString(36).substr(2, 9);
}
