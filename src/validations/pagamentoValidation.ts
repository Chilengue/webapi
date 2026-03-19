import Joi from 'joi';
import { METODOS_PAGAMENTO } from '../utils/constantes';

export const processarPagamentoSchema = Joi.object({
  faturaId: Joi.number().integer().positive().required().messages({
    'number.base': 'ID da fatura deve ser um número',
    'number.integer': 'ID da fatura deve ser um número inteiro',
    'number.positive': 'ID da fatura deve ser positivo',
    'any.required': 'ID da fatura é obrigatório'
  }),
  valor: Joi.number().precision(2).positive().optional().messages({
    'number.base': 'Valor deve ser um número',
    'number.precision': 'Valor deve ter no máximo 2 casas decimais',
    'number.positive': 'Valor deve ser positivo'
  }),
  metodoPagamento: Joi.string().valid(...Object.values(METODOS_PAGAMENTO)).required().messages({
    'any.only': `Método de pagamento deve ser um dos valores: ${Object.values(METODOS_PAGAMENTO).join(', ')}`,
    'any.required': 'Método de pagamento é obrigatório'
  }),
  numeroReferencia: Joi.string().max(100).optional().messages({
    'string.max': 'Número de referência deve ter no máximo 100 caracteres'
  }),
  observacoes: Joi.string().max(500).optional().messages({
    'string.max': 'Observações devem ter no máximo 500 caracteres'
  })
});