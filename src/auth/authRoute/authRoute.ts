import { Request, Response } from 'express';
import { verifyRefreshToken, generateAccessToken } from '../../middlewares/jwt';

export const refreshToken = (req: Request, res: Response): void => {
  const token = req.cookies.refreshToken;

  if (!token) {
     res.status(401).json({ message: 'No refresh token provided' });
     return
  }

  const decoded = verifyRefreshToken(token);
  if (!decoded) {
     res.status(403).json({ message: 'Invalid refresh token' });
     return
  }

  const newAccessToken = generateAccessToken(decoded.userId);
  res.status(200).json({ accessToken: newAccessToken });
};
