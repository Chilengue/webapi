import { Consumidor, Usuario, Papel, Leitura, Fatura } from '../models';
import { DEFAULTS, PAPEIS_USUARIO, MENSAGENS_ERRO } from '../utils/constantes';
import { Op } from 'sequelize';
import sequelize from '../config/database';

class ConsumidorService {
  async criar(dados: any) {
    const existente = await Consumidor.findOne({
      where: {
        [Op.or]: [
          { identificacao: dados.identificacao },
          { codigoFatura: dados.codigoFatura }
        ]
      }
    });
    if (existente) {
      if (existente.identificacao === dados.identificacao) {
        throw new Error(MENSAGENS_ERRO.DUPLICADO('Identificação'));
      }
      if (existente.codigoFatura === dados.codigoFatura) {
        throw new Error(MENSAGENS_ERRO.DUPLICADO('Código de fatura'));
      }
    }

    const transaction = await sequelize.transaction();
    try {
      const consumidor = await Consumidor.create(dados, { transaction });

      const papelConsumidor = await Papel.findOne({ where: { nome: PAPEIS_USUARIO.CONSUMIDOR }, transaction });
      if (!papelConsumidor) throw new Error('Papel consumidor não encontrado');

      const usuario = await Usuario.create({
        nome: consumidor.nomeCompleto,
        nomeUsuario: consumidor.codigoFatura,
        senha: DEFAULTS.SENHA_PADRAO
      }, { transaction });

      await usuario.$set('papeis', [papelConsumidor], { transaction });
      await consumidor.$set('usuario', usuario, { transaction });

      await transaction.commit();
      return consumidor.reload({ include: ['usuario'] });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async listar(ativosApenas = false) {
    const where = ativosApenas ? { ativo: true } : {};
    return Consumidor.findAll({
      where,
      include: [
        { model: Usuario, as: 'usuario', attributes: { exclude: ['senha'] } },
        { model: Fatura, as: 'faturas', limit: 5, order: [['createdAt', 'DESC']] }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  async buscarPorId(id: number) {
    const consumidor = await Consumidor.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: { exclude: ['senha'] } },
        { model: Leitura, as: 'leituras', order: [['dataLeitura', 'DESC']] },
        { model: Fatura, as: 'faturas', order: [['dataEmissao', 'DESC']] }
      ]
    });
    if (!consumidor) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Consumidor'));
    return consumidor;
  }

  async buscarPorIdentificacao(identificacao: string) {
    return Consumidor.findOne({
      where: { identificacao },
      include: ['usuario']
    });
  }

  async buscarPorCodigoFatura(codigoFatura: string) {
    return Consumidor.findOne({
      where: { codigoFatura },
      include: ['usuario']
    });
  }

  async atualizar(id: number, dados: any) {
    const consumidor = await Consumidor.findByPk(id, { include: ['usuario'] });
    if (!consumidor) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Consumidor'));

    if (dados.identificacao && dados.identificacao !== consumidor.identificacao) {
      const existente = await Consumidor.findOne({ where: { identificacao: dados.identificacao } });
      if (existente) throw new Error(MENSAGENS_ERRO.DUPLICADO('Identificação'));
    }
    if (dados.codigoFatura && dados.codigoFatura !== consumidor.codigoFatura) {
      const existente = await Consumidor.findOne({ where: { codigoFatura: dados.codigoFatura } });
      if (existente) throw new Error(MENSAGENS_ERRO.DUPLICADO('Código de fatura'));
    }

    await consumidor.update(dados);
    if (consumidor.usuario && dados.nomeCompleto) {
      await consumidor.usuario.update({ nome: dados.nomeCompleto });
    }

    return consumidor.reload({ include: ['usuario'] });
  }

  async excluir(id: number) {
    const consumidor = await Consumidor.findByPk(id);
    if (!consumidor) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Consumidor'));
    await consumidor.update({ ativo: false });
  }

  async redefinirSenha(codigoFatura: string) {
    const consumidor = await Consumidor.findOne({
      where: { codigoFatura },
      include: ['usuario']
    });
    if (!consumidor || !consumidor.usuario) return false;

    consumidor.usuario.senha = DEFAULTS.SENHA_PADRAO;
    await consumidor.usuario.save();
    return true;
  }
}

export default new ConsumidorService();