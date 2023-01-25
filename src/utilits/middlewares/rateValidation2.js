const verifyRate2 = (req, res, next) => {
    const { talk: { rate } } = req.body;
    if (!rate && rate !== 0) {
        return res.status(400)
        .json({ message: 'O campo "rate" é obrigatório' });
    }
    next();
    };
    
module.exports = verifyRate2;