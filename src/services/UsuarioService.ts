import { Usuario, Papel } from '../models';
import { MENSAGENS_ERRO } from '../utils/constantes';
import sequelize from '../config/database';
import { CriarUsuarioDTO, AtualizarUsuarioDTO, UsuarioResponseDTO } from '../dtos/UsuarioDTO';

class UsuarioService {
  async criar(dados: CriarUsuarioDTO): Promise<UsuarioResponseDTO> {
    const transaction = await sequelize.transaction();
    try {
      const existe = await Usuario.findOne({ where: { nomeUsuario: dados.nomeUsuario } });
      if (existe) {
        throw new Error(MENSAGENS_ERRO.DUPLICADO('Nome de usuário'));
      }

      const papel = await Papel.findByPk(dados.papelId, { transaction });
      if (!papel) {
        throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Papel'));
      }

      const usuario = await Usuario.create({
        nome: dados.nome,
        nomeUsuario: dados.nomeUsuario,
        senha: dados.senha
      }, { transaction });

      await usuario.$set('papeis', [papel], { transaction });

      await transaction.commit();
      const usuarioCompleto = await usuario.reload({ include: ['papeis'] });
      return this.formatarResposta(usuarioCompleto);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async listar(): Promise<UsuarioResponseDTO[]> {
    const usuarios = await Usuario.findAll({
      include: ['papeis'],
      attributes: { exclude: ['senha'] },
      order: [['dataCriacao', 'DESC']]
    });
    return usuarios.map(u => this.formatarResposta(u));
  }

  async buscarPorId(id: number): Promise<UsuarioResponseDTO> {
    const usuario = await Usuario.findByPk(id, {
      include: ['papeis'],
      attributes: { exclude: ['senha'] }
    });
    if (!usuario) {
      throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Usuário'));
    }
    return this.formatarResposta(usuario);
  }

  async buscarPorNomeUsuario(nomeUsuario: string): Promise<UsuarioResponseDTO | null> {
    const usuario = await Usuario.findOne({
      where: { nomeUsuario },
      include: ['papeis'],
      attributes: { exclude: ['senha'] }
    });
    return usuario ? this.formatarResposta(usuario) : null;
  }

  async atualizar(id: number, dados: AtualizarUsuarioDTO): Promise<UsuarioResponseDTO> {
    const usuario = await Usuario.findByPk(id, { include: ['papeis'] });
    if (!usuario) {
      throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Usuário'));
    }

    const transaction = await sequelize.transaction();
    try {
      if (dados.nome) usuario.nome = dados.nome;
      if (dados.senha) usuario.senha = dados.senha; // será hasheada no hook?
      // O hook @BeforeUpdate não hasheia, então precisamos hashear manualmente se for alterar senha.
      // Para simplificar, vamos assumir que a senha já vem hasheada ou usamos hook.
      // Mas o modelo não tem hook @BeforeUpdate para hash, então faremos manualmente.
      if (dados.senha) {
        const { hashSenha } = require('../utils/helpers');
        usuario.senha = await hashSenha(dados.senha);
      }
      await usuario.save({ transaction });

      if (dados.papelId) {
        const papel = await Papel.findByPk(dados.papelId, { transaction });
        if (!papel) {
          throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Papel'));
        }
        await usuario.$set('papeis', [papel], { transaction });
      }

      await transaction.commit();
      const usuarioAtualizado = await usuario.reload({ include: ['papeis'] });
      return this.formatarResposta(usuarioAtualizado);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async excluir(id: number): Promise<void> {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Usuário'));
    }
    await usuario.destroy();
  }

  private formatarResposta(usuario: Usuario): UsuarioResponseDTO {
    return {
      id: usuario.id,
      nome: usuario.nome,
      nomeUsuario: usuario.nomeUsuario,
      dataCriacao: usuario.dataCriacao,
      papeis: usuario.papeis?.map(p => ({ id: p.id, nome: p.nome })) || []
    };
  }
}

export default new UsuarioService();