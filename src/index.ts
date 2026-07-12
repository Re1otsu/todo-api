import 'dotenv/config';
import express, {Request, Response} from 'express';
import auth from './routes/auth';
import tasks from './routes/tasks';
import errorHandler from './middleware/errorHandler';

const app = express();
app.use(express.json());

app.use('/auth', auth)

app.use('/tasks', tasks)

app.get('/', (req:Request, res: Response) => {
    res.json({message:'API работает'});
});

const PORT = process.env.PORT || 3000;
app.use(errorHandler);

app.listen(PORT, ()=> {
    console.log(`Сервер запущен на порту ${PORT}`);
});
