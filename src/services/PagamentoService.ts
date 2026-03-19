import { Pagamento, Fatura, Usuario } from '../models';
import sequelize from '../config/database';
import { METODOS_PAGAMENTO, STATUS_PAGAMENTO, STATUS_FATURA, MENSAGENS_ERRO } from '../utils/constantes';

class PagamentoService {
  async processar(dados: {
    faturaId: number;
    valor?: number;
    metodoPagamento: string;
    numeroReferencia?: string;
    caixaId: number;
    observacoes?: string;
  }) {
    const fatura = await Fatura.findByPk(dados.faturaId);
    if (!fatura) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Fatura'));

    const caixa = await Usuario.findByPk(dados.caixaId);
    if (!caixa) throw new Error('Caixa não encontrado');

    const valorPagamento = dados.valor || fatura.saldoDevedor;

    if (valorPagamento <= 0) throw new Error('Valor do pagamento deve ser positivo');
    if (valorPagamento > fatura.saldoDevedor) throw new Error(MENSAGENS_ERRO.PAGAMENTO_EXCEDE_SALDO);

    const transaction = await sequelize.transaction();
    try {
      const pagamento = await Pagamento.create({
        faturaId: dados.faturaId,
        valor: valorPagamento,
        metodoPagamento: dados.metodoPagamento,
        numeroReferencia: dados.numeroReferencia,
        caixaId: dados.caixaId,
        observacoes: dados.observacoes,
        status: STATUS_PAGAMENTO.CONCLUIDO
      }, { transaction });

      const novoValorPago = fatura.valorPago + valorPagamento;
      const novoSaldoDevedor = fatura.valorTotal - novoValorPago;
      const statusFatura = novoSaldoDevedor <= 0 ? STATUS_FATURA.PAGA : fatura.status;

      await fatura.update({
        valorPago: novoValorPago,
        saldoDevedor: novoSaldoDevedor,
        status: statusFatura,
        dataPagamento: novoSaldoDevedor <= 0 ? new Date() : null,
        metodoPagamento: dados.metodoPagamento,
        numeroReferencia: dados.numeroReferencia || fatura.numeroReferencia
      }, { transaction });

      await transaction.commit();
      return pagamento.reload({ include: ['fatura', 'caixa'] });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async listar(pagina: number = 1, limite: number = 10) {
    const { count, rows } = await Pagamento.findAndCountAll({
      include: ['fatura', 'caixa'],
      order: [['dataPagamento', 'DESC']],
      limit: limite,
      offset: (pagina - 1) * limite,
      distinct: true
    });

    return {
      dados: rows,
      total: count,
      pagina,
      limite
    };
  }

  async buscarPorId(id: number) {
    const pagamento = await Pagamento.findByPk(id, {
      include: ['fatura', 'caixa']
    });
    if (!pagamento) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Pagamento'));
    return pagamento;
  }

  /**
   * Busca todos os pagamentos de uma fatura específica
   * @param faturaId ID da fatura
   */
  async buscarPorFatura(faturaId: number) {
    return Pagamento.findAll({
      where: { faturaId },
      include: ['caixa'],
      order: [['dataPagamento', 'DESC']]
    });
  }

  async estornar(id: number, caixaId: number, motivo?: string) {
    const pagamento = await Pagamento.findByPk(id, {
      include: ['fatura']
    });
    if (!pagamento) throw new Error(MENSAGENS_ERRO.NAO_ENCONTRADO('Pagamento'));
    if (pagamento.status !== STATUS_PAGAMENTO.CONCLUIDO) {
      throw new Error('Apenas pagamentos concluídos podem ser estornados');
    }

    const fatura = pagamento.fatura;

    const transaction = await sequelize.transaction();
    try {
      await pagamento.update({
        status: STATUS_PAGAMENTO.ESTORNADO,
        observacoes: (pagamento.observacoes || '') + ` | Estornado: ${motivo || 'Sem motivo'}`
      }, { transaction });

      const novoValorPago = fatura.valorPago - pagamento.valor;
      const novoSaldoDevedor = fatura.valorTotal - novoValorPago;
      const statusFatura = novoSaldoDevedor <= 0 ? STATUS_FATURA.PAGA : (novoSaldoDevedor < fatura.valorTotal ? STATUS_FATURA.PENDENTE : fatura.status);

      await fatura.update({
        valorPago: novoValorPago,
        saldoDevedor: novoSaldoDevedor,
        status: statusFatura
      }, { transaction });

      await transaction.commit();
      return pagamento;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new PagamentoService();