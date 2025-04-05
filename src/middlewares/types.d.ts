// types.d.ts
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; // Define the user property with JwtPayload type
    }
  }
}

interface JwtPayloadWithId extends jwt.JwtPayload {
  userId: string;
}

