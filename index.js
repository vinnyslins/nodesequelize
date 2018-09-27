const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { User } = require('./app/models');
const MESSAGES = {
  serverError: 'Ocorreu um erro no servidor.',
  codeNotEntered: 'Código não informado.'
}

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/users', (req, res) => {
  User.findAll().then(users => {
    return res.json(users);
  }).catch(() => {
    return res.status(500).json({ message: MESSAGES.serverError });
  });
});

app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: MESSAGES.codeNotEntered });
  }
  User.findById(id).then(user => {
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    return res.json(user);
  }).catch(() => {
    return res.status(500).json({ message: MESSAGES.serverError });
  });
});

app.post('/users', async (req, res) => {
	const user = await User.create(req.body);
	res.json(user);
});

app.patch('/users/:id', (req, res) => {});

app.delete('/users/:id', (req, res) => {});

app.listen(3000);

