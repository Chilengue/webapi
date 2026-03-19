import { Consumidor, Fatura, Pagamento } from '../models';
import { Op, fn, col } from 'sequelize';
import { STATUS_FATURA, STATUS_PAGAMENTO } from '../utils/constantes';

class DashboardService {
  async resumo() {
    const totalConsumidores = await Consumidor.count();
    const consumidoresAtivos = await Consumidor.count({ where: { ativo: true } });

    const faturasPendentes = await Fatura.count({ where: { status: STATUS_FATURA.PENDENTE } });
    const faturasVencidas = await Fatura.count({ where: { status: STATUS_FATURA.VENCIDA } });
    const faturasPagas = await Fatura.count({ where: { status: STATUS_FATURA.PAGA } });

    const valorPendente = await Fatura.sum('saldoDevedor', {
      where: { status: STATUS_FATURA.PENDENTE }
    }) || 0;
    const valorVencido = await Fatura.sum('saldoDevedor', {
      where: { status: STATUS_FATURA.VENCIDA }
    }) || 0;

    // Receita de hoje
    const hoje = new Date();
    const inicioDoDia = new Date(hoje.setHours(0, 0, 0, 0));
    const fimDoDia = new Date(hoje.setHours(23, 59, 59, 999));

    const receitaHoje = await Pagamento.sum('valor', {
      where: {
        dataPagamento: { [Op.between]: [inicioDoDia, fimDoDia] },
        status: STATUS_PAGAMENTO.CONCLUIDO
      }
    }) || 0;

    const pagamentosHoje = await Pagamento.count({
      where: {
        dataPagamento: { [Op.between]: [inicioDoDia, fimDoDia] },
        status: STATUS_PAGAMENTO.CONCLUIDO
      }
    });

    return {
      totalConsumidores,
      consumidoresAtivos,
      faturasPendentes,
      faturasVencidas,
      faturasPagas,
      valorPendente,
      valorVencido,
      receitaHoje,
      pagamentosHoje,
      data: hoje.toISOString().split('T')[0]
    };
  }

  async receitaPorMetodoPagamento(dataInicio: string, dataFim: string) {
    const pagamentos = await Pagamento.findAll({
      where: {
        dataPagamento: { [Op.between]: [dataInicio, dataFim] },
        status: STATUS_PAGAMENTO.CONCLUIDO
      },
      attributes: [
        'metodoPagamento',
        [fn('SUM', col('valor')), 'total']
      ],
      group: ['metodoPagamento'],
      raw: true
    });

    const resultado: Record<string, number> = {};
    (pagamentos as any[]).forEach(p => {
      resultado[p.metodoPagamento] = parseFloat(p.total) || 0;
    });
    return resultado;
  }

  async receitaMensal(ano: number) {
    const pagamentos = await Pagamento.findAll({
      where: {
        dataPagamento: {
          [Op.between]: [`${ano}-01-01`, `${ano}-12-31`]
        },
        status: STATUS_PAGAMENTO.CONCLUIDO
      },
      attributes: [
        [fn('EXTRACT', 'MONTH FROM "data_pagamento"'), 'mes'],
        [fn('SUM', col('valor')), 'total']
      ],
      group: [fn('EXTRACT', 'MONTH FROM "data_pagamento"')],
      raw: true
    });

    const mensal: Record<string, number> = {};
    for (let m = 1; m <= 12; m++) {
      const chave = `${ano}-${String(m).padStart(2, '0')}`;
      mensal[chave] = 0;
    }

    (pagamentos as any[]).forEach(p => {
      const mes = Math.floor(p.mes);
      const chave = `${ano}-${String(mes).padStart(2, '0')}`;
      mensal[chave] = parseFloat(p.total) || 0;
    });

    return mensal;
  }
}

export default new DashboardService();