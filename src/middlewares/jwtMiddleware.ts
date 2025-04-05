import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// Define a custom payload type
interface MyJwtPayload extends JwtPayload {
  userId: string; // or userId if that's what you use in the token
}

const SECRET_KEY = process.env.JWT_SECRET!;

export const authenticateJWT: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as MyJwtPayload;

    if (!decoded.userId) {
      console.log('no token');
      
      return res.status(403).json({ message: 'Token missing user ID' });

    }

    (req as AuthenticatedRequest).user = { id: decoded.userId  };

    next();
  } catch (err) {
    console.error("JWT Error:", err);
    console.log('no token fouund error');

    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
