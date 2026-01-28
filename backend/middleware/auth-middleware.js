const jwt = require('jsonwebtoken');


module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : (req.cookies && req.cookies.accessToken);

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET || 'JWT_SECRET');
        req.user = payload;

        await User.findByIdAndUpdate(payload.id, {
            lastActive: new Date()
        });
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}; 