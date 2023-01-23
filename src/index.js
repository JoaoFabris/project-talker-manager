const express = require('express');

const fs = require('fs').promises;

const path = require('path');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const talkerPath = path.resolve(__dirname, './talker.json');

const readFile = async () => {
  try {
    const data = await fs.readFile(talkerPath);
    return JSON.parse(data);
  } catch (error) {
    console.log(error.message);
  }
};

// não remova esse endpoint, e para o avaliador funcionar!!
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  try {
    const talker = await readFile();
    return res.status(HTTP_OK_STATUS).json(talker);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log('Online');
});

module.exports = app;
