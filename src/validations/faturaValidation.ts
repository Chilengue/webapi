import Joi from 'joi';
import { STATUS_FATURA, METODOS_PAGAMENTO } from '../utils/constantes';

export const gerarFaturaSchema = Joi.object({
  leituraAtual: Joi.number().integer().positive().required().messages({
    'number.base': 'Leitura atual deve ser um número',
    'number.integer': 'Leitura atual deve ser um número inteiro',
    'number.positive': 'Leitura atual deve ser positiva',
    'any.required': 'Leitura atual é obrigatória'
  }),
  dataLeitura: Joi.date().iso().optional().messages({
    'date.iso': 'Data da leitura deve estar no formato ISO (YYYY-MM-DD)'
  })
});

export const atualizarFaturaSchema = Joi.object({
  status: Joi.string().valid(...Object.values(STATUS_FATURA)).optional().messages({
    'any.only': `Status deve ser um dos valores: ${Object.values(STATUS_FATURA).join(', ')}`
  }),
  valorPago: Joi.number().precision(2).positive().optional().messages({
    'number.base': 'Valor pago deve ser um número',
    'number.precision': 'Valor pago deve ter no máximo 2 casas decimais',
    'number.positive': 'Valor pago deve ser positivo'
  }),
  metodoPagamento: Joi.string().valid(...Object.values(METODOS_PAGAMENTO)).optional().messages({
    'any.only': `Método de pagamento deve ser um dos valores: ${Object.values(METODOS_PAGAMENTO).join(', ')}`
  }),
  numeroReferencia: Joi.string().max(100).optional()
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser enviado para atualização'
});