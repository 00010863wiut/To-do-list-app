const fs = require("fs");
class TasksRepo {
    constructor() {
        this.tasks = []
        this.path = './data/tasks.json'

        fs.readFile(this.path, (err, data) => {
            if (err) throw err
            this.tasks = JSON.parse(data);
        })
    }
    create(task, callback) {
        task.id = this.generateId()
        this.tasks.push(task)
        this.updateFile(callback)
    }

    generateId() {
        return "_" + Math.random().toString(36).substr(2, 9);
    }

    updateFile(callback) {
        fs.writeFile(this.path, JSON.stringify(this.tasks), callback)
    }
    
    getById(id) {
		return this.tasks.filter(task => task.id === id)[0]
	}
}

module.exports = TasksRepo