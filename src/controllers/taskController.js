const taskService = require('../services/taskService')

const getTasks = async(req,res) =>{
    const userId = req.userId

    let sort = req.query.sort ?? 'created_at';
    let order = req.query.order ?? 'desc';

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
    const tasks = await taskService.getTasks(userId, sort, order, isDone, limit, offset);
    res.status(200).json(tasks);
};

const createTask = async(req, res) =>{
    const userId = req.userId;
    const {title} = req.body;
    const task = await taskService.createTask(userId, title);
    res.status(201).json(task);
};

const deleteTask = async(req, res, next) =>{
    try {    
        const userId = req.userId;
        const taskId = req.params.id;
        const task = await taskService.deleteTask(taskId, userId);
        if (!task) {
            return res.status(404).json({
                error: 'Задача не найдена'
            });
        }

        res.status(200).json(task);
    }
    catch (err) {
        next(err);
    }
}

const updateTask = async(req, res) =>{
    const userId = req.userId;
    const taskId = req.params.id;
    const {title, is_done} = req.body;
    const task = await taskService.updateTask(taskId, userId, title, is_done);
    if (!task) {
        return res.status(404).json({
            error: 'Задача не найдена'
        });
    }
    res.status(200).json(task);
}

module.exports = {
    getTasks, 
    createTask, 
    deleteTask,
    updateTask
};
