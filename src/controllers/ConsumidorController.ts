import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ConsumidorService from '../services/ConsumidorService';
import { MENSAGENS_ERRO } from '../utils/constantes';

class ConsumidorController {
  async index(req: Request, res: Response): Promise<Response> {
    try {
      const ativos = req.query.ativos === 'true';
      const consumidores = await ConsumidorService.listar(ativos);
      return res.status(StatusCodes.OK).json(consumidores);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const consumidor = await ConsumidorService.buscarPorId(Number(id));
      return res.status(StatusCodes.OK).json(consumidor);
    } catch (error: any) {
      return res.status(StatusCodes.NOT_FOUND).json({ erro: error.message });
    }
  }

  async showPorCodigoFatura(req: Request, res: Response): Promise<Response> {
    try {
      const { codigoFatura } = req.params;
      const consumidor = await ConsumidorService.buscarPorCodigoFatura(codigoFatura);
      if (!consumidor) {
        return res.status(StatusCodes.NOT_FOUND).json({ erro: MENSAGENS_ERRO.NAO_ENCONTRADO('Consumidor') });
      }
      return res.status(StatusCodes.OK).json(consumidor);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }

  async store(req: Request, res: Response): Promise<Response> {
    try {
      const consumidor = await ConsumidorService.criar(req.body);
      return res.status(StatusCodes.CREATED).json(consumidor);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erro: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const consumidor = await ConsumidorService.atualizar(Number(id), req.body);
      return res.status(StatusCodes.OK).json(consumidor);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erro: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await ConsumidorService.excluir(Number(id));
      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erro: error.message });
    }
  }

  async resetSenha(req: Request, res: Response): Promise<Response> {
    try {
      const { codigoFatura } = req.params;
      const resultado = await ConsumidorService.redefinirSenha(codigoFatura);
      if (!resultado) {
        return res.status(StatusCodes.NOT_FOUND).json({ erro: MENSAGENS_ERRO.NAO_ENCONTRADO('Consumidor') });
      }
      return res.status(StatusCodes.OK).json({ mensagem: 'Senha redefinida com sucesso' });
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }
}

export default new ConsumidorController();