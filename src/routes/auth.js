const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/pool');
const jwt = require('jsonwebtoken');

const router = express.Router();


router.post('/register', async(req,res) => {
    try {
        const {email, password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const result = await pool.query('INSERT INTO users (email, password_hash) VALUES($1, $2) RETURNING id, email', [email, passwordHash]);
        res.status(201).json(result.rows[0]);
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'Ошибка сервера'});
    }
})

router.post('/login', async(req,res)=> {
    try{
        const{email, password} = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0 ){
            return res.status(404).json({error:'Пользователь не найден'});
        }
            const user = result.rows[0];
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if(isPasswordValid == false){
                return res.status(401).json({error:'Неправильный пароль'})
            }
            
            const token = jwt.sign(
                {userId: user.id},
                process.env.JWT_SECRET,
                {expiresIn: '24h'}
            );            
            res.status(200).json({token});

    }catch(err){
        console.log(err)
        res.status(500).json({error:'Ошибка сервера'});
    }
})

module.exports = router;