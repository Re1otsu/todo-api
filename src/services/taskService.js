const pool = require('../db/pool').default;

const getTasks = async(userId, sort, order, isDone, limit, offset) => {
    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const params = [userId];

    if (isDone !== undefined) {
        params.push(isDone);
        query += ` AND is_done = $${params.length}`;
    }

    query += ` ORDER BY ${sort} ${order} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    console.log('Query:', query);
    console.log('Params:', params);

    const result = await pool.query(query, params);
    return result.rows;
}

const createTask = async(userId, title) =>{
    const result = await pool.query('INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING id, title', [userId, title])
    return result.rows[0];
}

const deleteTask = async(taskId, userId) =>{
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id, title', [taskId, userId]);
    if (result.rows.length === 0){
        return null;
    }   
    return result.rows[0]; 
}

const updateTask = async (taskId,userId, title, is_done) =>{
    const result = await pool.query('UPDATE tasks SET title = COALESCE($1, title), is_done = COALESCE($2, is_done) WHERE id = $3 AND user_id = $4 RETURNING id, title, is_done', [title ?? null, is_done ?? null, taskId, userId]);
    if(result.rows.length === 0){
        return null;
    }
    return result.rows[0];
}

module.exports = {
    getTasks,
    createTask,
    deleteTask,
    updateTask
}