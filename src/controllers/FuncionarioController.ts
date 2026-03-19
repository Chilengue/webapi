import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import FuncionarioService from '../services/FuncionarioService';

class FuncionarioController {
  async index(req: Request, res: Response): Promise<Response> {
    try {
      const funcionarios = await FuncionarioService.listar();
      return res.status(StatusCodes.OK).json(funcionarios);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const funcionario = await FuncionarioService.buscarPorId(Number(id));
      return res.status(StatusCodes.OK).json(funcionario);
    } catch (error: any) {
      return res.status(StatusCodes.NOT_FOUND).json({ erro: error.message });
    }
  }

  async store(req: Request, res: Response): Promise<Response> {
    try {
      const funcionario = await FuncionarioService.criar(req.body);
      return res.status(StatusCodes.CREATED).json(funcionario);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erro: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const funcionario = await FuncionarioService.atualizar(Number(id), req.body);
      return res.status(StatusCodes.OK).json(funcionario);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erro: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await FuncionarioService.excluir(Number(id));
      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erro: error.message });
    }
  }
}

export default new FuncionarioController();