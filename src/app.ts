import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';

// Importa as rotas principais
import routes from './routes';

// Carrega variáveis de ambiente
dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.inicializarMiddlewares();
    this.inicializarRotas();
    this.inicializarTratamentoErros();
  }

  private inicializarMiddlewares(): void {
    // Segurança
    this.app.use(helmet());

    // CORS
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    }));

    // Compressão
    this.app.use(compression());

    // Parsing de JSON e URL encoded
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }
  }

  private inicializarRotas(): void {
    // Rota de verificação de saúde
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(StatusCodes.OK).json({ status: 'OK', timestamp: new Date() });
    });

    // Rotas da API
    this.app.use('/api', routes);
  }

  private inicializarTratamentoErros(): void {
    // Rota não encontrada (404)
    this.app.use((req: Request, res: Response) => {
      res.status(StatusCodes.NOT_FOUND).json({ erro: 'Rota não encontrada' });
    });

    // Tratamento de erros global
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error('Erro não tratado:', err);
      const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
      const mensagem = err.message || 'Erro interno do servidor';
      res.status(status).json({ erro: mensagem });
    });
  }
}

export default new App().app;