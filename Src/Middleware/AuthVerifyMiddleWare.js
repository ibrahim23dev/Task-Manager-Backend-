const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['token'];

    if (!token) {
        return res.status(401).json({ status: 'unauthorized' });
    }

    jwt.verify(token, 'SecretKey123456789', (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(401).json({ status: 'unauthorized' });
        }

        const email = decoded.data;
        req.headers.email = email;
        next();
    });
};
