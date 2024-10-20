const jwt = require('jsonwebtoken');

// Verificar el token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

// Verificar el rol del usuario
const verifyRole = (roles) => {
    return (req, res, next) => {
        // Verificar si el rol del usuario está en la lista de roles permitidos
        if (req.user && roles.includes(req.user.role)) {
            next();
        } else {
            return res.status(403).json({ message: "Acceso denegago" });
        }
    }; 
};

module.exports = { authenticateToken, verifyRole };
