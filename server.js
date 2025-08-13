import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

// безопасность в браузере (несовпадение origin):
app.use(cors());

// парсинг body на сервере (из строки получаем json):
app.use(
  bodyParser.json({
    type(req) {
      return true;
    },
  })
);

// установка заголовков ответа:
app.use(function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// массив заметок (начальное значение):
const notes = [
  {
    id: 0,
    content:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur consequuntur ipsum voluptate asperiores! Doloremque quos similique odit corporis alias placeat eaque, consectetur optio aliquam dolorem quaerat illo perferendis eveniet voluptates?',
  },
];

let nextId = 1; // id заметки (начальное значение)

// проверка подключения к серверу:
app.get("/ping", async (req, res) => {
  res.status(204);
  res.end();
});

// обработка get-запроса:
app.get('/notes', (req, res) => {
  res.send(JSON.stringify(notes));
});

// обработка post-запроса:
app.post('/notes', (req, res) => {
  notes.push({ ...req.body, id: nextId++ });
  res.status(204);
  res.end();
});

// обработка delete-запроса с динамическим параметром id:
app.delete('/notes/:id', (req, res) => {
  const noteId = Number(req.params.id); // параметры берутся из url
  const index = notes.findIndex((o) => o.id === noteId);
  if (index !== -1) {
    notes.splice(index, 1);
  }
  res.status(204);
  res.end();
});

const port = process.env.PORT || 7070;

const bootstrap = async () => {
  try {
    app.listen(port, () =>
      console.log(`The server is running on http://localhost:${port}`)
    );
  } catch (error) {
    console.error(error);
  }
};

bootstrap();
