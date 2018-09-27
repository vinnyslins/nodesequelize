const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { User } = require('./app/models');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/users', (req, res) => {});

app.get('/users/:id', (req, res) => {});

app.post('/users', async (req, res) => {
	const user = await User.create(req.body);
	res.json(user);
});

app.patch('/users/:id', (req, res) => {});

app.delete('/users/:id', (req, res) => {});

app.listen(3000);

