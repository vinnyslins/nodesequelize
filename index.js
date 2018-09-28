const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { User } = require('./app/models');
const MESSAGES = {
  serverError: 'Ocorreu um erro no servidor.',
  codeNotEntered: 'Código não informado.',
  badRequest: 'Corpo de requisição inválido.',
  userNotFound: 'Usuário não encontrado.',
  duplicatedEmail: 'E-mail já cadastrado.',
  deletedUser: 'Usuário excluído com sucesso.',
  notDeletedUser: 'Erro ao excluir usuário.'
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
      return res.status(404).json({ message: MESSAGES.userNotFound });
    }
    return res.json(user);
  }).catch(() => {
    return res.status(500).json({ message: MESSAGES.serverError });
  });
});

app.post('/users', (req, res) => {
  const user = req.body;
  if (!(user.name && user.email && user.password)) {
    return res.status(400).json({ message: MESSAGES.badRequest });
  }
  User.create(user).then(user => {
    return res.json(user);
  }).catch(error => {
    if (error.parent.errno === 1062) {
      return res.status(403).json({ message: MESSAGES.duplicatedEmail});
    }
    return res.status(500).json({ message: MESSAGES.serverError });
  });
});

app.patch('/users/:id', (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  if (!id) {
    return res.status(400).json({ message: MESSAGES.badRequest });
  }
  User.findById(id).then(user => {
    if (!user) {
      return res.status(404).json({ message: MESSAGES.userNotFound });
    }
    user.updateAttributes(changes).then(updatedUser => {
      res.json(updatedUser);
    }).catch(error => {
      if (error.parent.errno === 1062) {
        return res.status(403).json({ message: MESSAGES.duplicatedEmail});
      }
      res.status(500).json({ message: MESSAGES.serverError });
    });
  }).catch(error => {
    res.status(500).json({ message: MESSAGES.serverError });
  });
});

app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: MESSAGES.badRequest });
  }
  User.destroy({
    where: {
      id: id
    }
  }).then(status => {
    if (!status) {
      return res.json({ message: MESSAGES.notDeletedUser });
    }
    return res.json({ message: MESSAGES.deletedUser });
  }).catch(error => {
    return res.status(500).json({ message: MESSAGES.serverError });
  })
});

app.listen(3000);

