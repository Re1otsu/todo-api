const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const auth = require('./routes/auth')
app.use('/auth', auth)

const tasks = require('./routes/tasks')
app.use('/tasks', tasks)

app.get('/', (req,res) => {
    res.json({message:'API работает'});
});

const PORT = process.env.PORT || 3000;

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, ()=> {
    console.log(`Сервер запущен на порту ${PORT}`);
});
