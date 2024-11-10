import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: 'User Not Authenticated',
                success: false,
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid Token",
                success: false,
            });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token Expired',
                success: false,
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Invalid Token',
                success: false,
            });
        }

        console.log(error);
        return res.status(500).json({
            message: 'Server Error',
            success: false,
        });
    }
};

export default isAuthenticated;