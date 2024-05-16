const guest = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader && authorizationHeader.split(' ')[1];

    if (token){
        return res.status(400).json({
            message: 'Only guests can access this resource.'
        });
    }

    next();
}

module.exports = guest;