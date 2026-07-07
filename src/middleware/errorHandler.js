const errorHandler = (err, req, res, next)=>{
    console.error(err);
    res.status(500).json({
        error: 'Ошибка сервера'
    });
}

module.exports = errorHandler;