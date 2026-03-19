import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';

interface TokenPayload {
  id: number;
  nomeUsuario: string;
  papeis: string[];
}

declare global {
  namespace Express {
    interface Request {
      usuarioId?: number;
      usuarioPapeis?: string[];
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, authConfig.secret) as TokenPayload;
    req.usuarioId = decoded.id;
    req.usuarioPapeis = decoded.papeis;
    return next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuarioPapeis) {
      return res.status(403).json({ erro: 'Acesso negado' });
    }
    const hasRole = req.usuarioPapeis.some(role => roles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ erro: 'Permissões insuficientes' });
    }
    next();
  };
};