import taskService from '../services/taskService';
import {Request, Response, NextFunction} from 'express';

const getTasks = async(req: Request, res: Response, next: NextFunction) =>{
    try{
        const userId = req.userId
        if(!userId){
            return res.status(401).json({error: 'Не авторизован'});
        }

        let sort = String(req.query.sort ?? 'created_at');
        let order = String(req.query.order ?? 'desc');

        const allowedSortFields = ['created_at', 'title', 'is_done'];
        const allowedOrderValues = ['asc', 'desc'];

        if (!allowedSortFields.includes(sort)) {
            sort = 'created_at';
        }

        if(!allowedOrderValues.includes(order)) {
            order = 'desc';
        }

        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const offset = (page - 1) * limit;

        const isDone = req.query.is_done !== undefined 
                ? req.query.is_done === 'true'
                : undefined;
        const tasks = await taskService.getTasks(userId, sort as 'created_at' | 'title' | 'is_done', order as 'asc' | 'desc', isDone, limit, offset);
        res.status(200).json(tasks);
    }
    catch(err){
        console.log(err);
        next(err);
    }
};

const createTask = async(req: Request, res: Response, next: NextFunction) =>{
    try{
        const userId = req.userId;
        if(!userId){
            return res.status(401).json({error: 'Не авторизован'});
        }
        const {title} = req.body;
        const task = await taskService.createTask(userId, title);
        res.status(201).json(task);
    }
    catch(err){
        console.log(err);
        next(err);
    }
};

const deleteTask = async(req: Request, res: Response, next: NextFunction) =>{
    try {    
        const userId = req.userId;
        if(!userId){
            return res.status(401).json({error: 'Не авторизован'});
        }
        const taskId = Number(req.params.id);
        const task = await taskService.deleteTask(taskId, userId);
        if (!task) {
            return res.status(404).json({
                error: 'Задача не найдена'
            });
        }

        res.status(200).json(task);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

const updateTask = async(req: Request, res: Response, next: NextFunction) =>{
    try{
        const userId = req.userId;
        if(!userId){
            return res.status(401).json({error: 'Не авторизован'});
        }
        const taskId = Number(req.params.id);
        const {title, is_done} = req.body;
        const task = await taskService.updateTask(taskId, userId, title, is_done);
        if (!task) {
            return res.status(404).json({
                error: 'Задача не найдена'
            });
        }
        res.status(200).json(task);
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

export default {
    getTasks, 
    createTask, 
    deleteTask,
    updateTask
};
