const { TODO } = require("./in-memory-db");
const { v4: uuidv4 } = require('uuid');


module.exports.insert = (req, res) => {
    const date = new Date()
    const body = req.body;

    body.id = uuidv4();
    body.done = false;
    body.updated_at = date;
    body.created_at = date;

    TODO.push(body);
    console.log("Add task.", body);

    res.status(200).json({ message: 'Success' });
}

module.exports.update = (req, res) => {
    let item = TODO.find(c => c.id === req.body.id);
    if (item) {
        item.done = !item.done;
        item.updated_at = new Date();
        console.log("Task updated.", item);
    } else {
        console.log("Task not found")
    }
    res.status(200).json({ message: 'Success' });
}

module.exports.getAll = (req, res) => {
    res.status(200).json(TODO);
}