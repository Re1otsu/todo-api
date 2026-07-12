import pool from '../db/pool';

const getTasks = async(userId: number, sort: 'created_at' | 'title' | 'is_done', order: 'desc' | 'asc', isDone: boolean | undefined, limit: number, offset: number) => {
    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const params: (number | boolean)[] = [userId];

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

const createTask = async(userId: number, title: string) =>{
    const result = await pool.query('INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING id, title', [userId, title])
    return result.rows[0];
}

const deleteTask = async(taskId: number, userId: number) =>{
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id, title', [taskId, userId]);
    if (result.rows.length === 0){
        return null;
    }   
    return result.rows[0]; 
}

const updateTask = async (taskId: number,userId: number, title: string | undefined, is_done: boolean| undefined) =>{
    const result = await pool.query('UPDATE tasks SET title = COALESCE($1, title), is_done = COALESCE($2, is_done) WHERE id = $3 AND user_id = $4 RETURNING id, title, is_done', [title ?? null, is_done ?? null, taskId, userId]);
    if(result.rows.length === 0){
        return null;
    }
    return result.rows[0];
}

export default {
    getTasks,
    createTask,
    deleteTask,
    updateTask
}