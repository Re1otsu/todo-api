const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const asyncHandler = require('../middleware/asyncHandler');
const Joi = require('joi');
const taskController = require('../controllers/taskController');


const taskSchema = Joi.object({
    title: Joi.string().min(1).max(255).required()
});

const updateTaskSchema = Joi.object({
    title: Joi.string().min(1).max(255),
    is_done: Joi.boolean()
}).min(1);

const router = express.Router();

router.get('/', auth, asyncHandler(taskController.getTasks));

router.post('/', auth, validate(taskSchema), asyncHandler(taskController.createTask));

router.delete('/:id', auth, asyncHandler(taskController.deleteTask));

router.patch('/:id', auth,validate(updateTaskSchema), asyncHandler(taskController.updateTask));

module.exports = router;