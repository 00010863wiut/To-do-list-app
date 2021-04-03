const express = require("express");
const app = express();

const fs = require("fs");
const { Validator } = require("node-input-validator");

app.set("view engine", "pug");

const tasks = require('./routes/tasks.js')
app.use('/tasks', tasks)

const api = require('./routes/api.js')
app.use('/api', api)

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
                for (let key in v.errors) {
                    // console.log(key, error[key]);
                res.status(422).render("create", { error: v.errors[key].message });
               }
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

app.get("/saved", (req, res) => {
    fs.readFile("./data/tasks.json", (err, data) => {
        if (err) throw err;

        const tasks = JSON.parse(data);
        let savedTasks = [];
        savedTasks = tasks.filter((task) => task.saved === true);

        res.render("saved", { tasks: savedTasks });
    });
});

var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });

function id() {
    return "_" + Math.random().toString(36).substr(2, 9);
}
