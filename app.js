const express = require('express')
const app = express()

const fs = require('fs')
const { Validator } = require('node-input-validator');

app.set('view engine', 'pug')

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', (req, res) => {
    const title = req.body.title
    const description = req.body.description
    const datetime = req.body.datetime

    //input validation with library NIV
    const v = new Validator(req.body, {
        title: 'required|minLength:5',
        description: 'maxLength:100',
        datetime: 'required'
    });

    v.check().then((matched) => {
        if (!matched) {
            res.status(422).render('create', { error: v.errors.title.message });
            // res.status(422).send(v.errors);
        } else {
            fs.readFile('./data/tasks.json', function (err, data) {
                if (err) throw err

                const tasks = JSON.parse(data)


                tasks.push({
                    id: id(),
                    title: title,
                    datetime: datetime,
                    description: description,
                })

                fs.writeFile('./data/tasks.json', JSON.stringify(tasks), err => {
                    if (err) throw err

                    res.render('create', { success: true })
                })
            })
        }
    });
})

app.listen(8000, err => {
    if (err) console.log(err)

    console.log('Server is running on port 8000..')
})


function id() {
    return '_' + Math.random().toString(36).substr(2, 9);
}