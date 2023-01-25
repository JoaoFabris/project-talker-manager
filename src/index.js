const express = require('express');

const fs = require('fs').promises;

const path = require('path');

const tokenGenerator = require('./utilits/tokenGenerator');
const verifyEmail = require('./utilits/middlewares/emailValidation');
const verifyPassword = require('./utilits/middlewares/passwordValidation');
const verifyAuthorization = require('./utilits/middlewares/newTalkerValidation');
const nameValidation = require('./utilits/middlewares/nameValidation');
const talkValidation = require('./utilits/middlewares/talkValidation');
const rateValidation = require('./utilits/middlewares/rateValidation');
const ageValidation = require('./utilits/middlewares/ageValidation');
const verifyRate2 = require('./utilits/middlewares/rateValidation2');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar!!
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

const talkerPath = path.resolve(__dirname, './talker.json');

const readFile = async () => {
  try {
    const data = await fs.readFile(talkerPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log(error.message);
  }
};

app.get('/talker', async (req, res) => {
  try {
    const talker = await readFile();
    return res.status(HTTP_OK_STATUS).json(talker);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

app.get('/talker/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readFile();
    const findId = data.find((each) => each.id === Number(id));
    return res.status(HTTP_OK_STATUS).json(findId);
  } catch (error) {
    return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
  }
});

app.post('/login', verifyEmail, verifyPassword, (req, res) => {
    const token = tokenGenerator();
    return res.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker', verifyAuthorization, nameValidation, ageValidation, 
talkValidation, verifyRate2, rateValidation,
  async (req, res) => {
  const { name, age, talk } = req.body;
  const data = await readFile();
  const id = data.length + 1;
  const newTalker = {
    id,
    name,
    age,
    talk,
  };
  const newData = JSON.stringify([...data, newTalker], null, 2);
  await fs.writeFile(talkerPath, newData);
  return res.status(201).json(newTalker);
});

app.put('/talker/:id', verifyAuthorization, nameValidation, ageValidation, 
talkValidation, verifyRate2, rateValidation, async (req, res) => {
  try {
    const data = await readFile();
    const { id } = req.params;
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const getId = data.find((each) => each.id === Number(id));
    getId.name = name;
    getId.age = age;
    getId.talk.watchedAt = watchedAt;
    getId.talk.rate = rate;
    const editData = JSON.stringify(data);
    await fs.writeFile(talkerPath, editData);
    return res.status(200).json(getId);
  } catch (error) {
    res.status(500).send({ message: 'ID not found' });
  }
});

module.exports = app;
