const express = require('express');
const cors = require('cors');
const { insert, update, getAll } = require('./todo-service');

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.route('/api/todo').post(insert);
app.route('/api/todo').get(getAll);
app.route('/api/todo').patch(update);

const HOST = 'localhost';
const PORT = 9000;

const httpServer = app.listen(PORT, HOST, () => {
    console.log("HTTP Server running at http://" + HOST + ":" + PORT);
});
