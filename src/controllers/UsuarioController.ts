import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UsuarioService from '../services/UsuarioService';
import { MENSAGENS_ERRO } from '../utils/constantes';

class UsuarioController {
  async index(req: Request, res: Response) {
    try {
      const usuarios = await UsuarioService.listar();
      return res.json(usuarios);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = await UsuarioService.buscarPorId(Number(id));
      return res.json(usuario);
    } catch (error: any) {
      return res.status(StatusCodes.NOT_FOUND).json({ erro: error.message });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const usuario = await UsuarioService.criar(req.body);
      return res.status(StatusCodes.CREATED).json(usuario);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erro: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = await UsuarioService.atualizar(Number(id), req.body);
      return res.json(usuario);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erro: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await UsuarioService.excluir(Number(id));
      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error: any) {
      return res.status(StatusCodes.NOT_FOUND).json({ erro: error.message });
    }
  }

  async buscarPorNomeUsuario(req: Request, res: Response) {
    try {
      const { nomeUsuario } = req.query;
      const usuario = await UsuarioService.buscarPorNomeUsuario(String(nomeUsuario));
      if (!usuario) {
        return res.status(StatusCodes.NOT_FOUND).json({ erro: MENSAGENS_ERRO.NAO_ENCONTRADO('Usuário') });
      }
      return res.json(usuario);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ erro: error.message });
    }
  }
}

export default new UsuarioController();