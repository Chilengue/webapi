import Joi from 'joi';
import { TIPOS_LEITURA } from '../utils/constantes';

export const criarLeituraSchema = Joi.object({
  consumidorId: Joi.number().integer().positive().required().messages({
    'number.base': 'ID do consumidor deve ser um número',
    'number.integer': 'ID do consumidor deve ser um número inteiro',
    'number.positive': 'ID do consumidor deve ser positivo',
    'any.required': 'ID do consumidor é obrigatório'
  }),
  leituraAtual: Joi.number().integer().min(0).required().messages({
    'number.base': 'Leitura atual deve ser um número',
    'number.integer': 'Leitura atual deve ser um número inteiro',
    'number.min': 'Leitura atual não pode ser negativa',
    'any.required': 'Leitura atual é obrigatória'
  }),
  dataLeitura: Joi.date().iso().optional().messages({
    'date.iso': 'Data da leitura deve estar no formato ISO (YYYY-MM-DD)'
  }),
  tipoLeitura: Joi.string().valid(...Object.values(TIPOS_LEITURA)).default('REAL').messages({
    'any.only': `Tipo de leitura deve ser um dos valores: ${Object.values(TIPOS_LEITURA).join(', ')}`
  }),
  leituristaId: Joi.number().integer().positive().optional().messages({
    'number.base': 'ID do leiturista deve ser um número',
    'number.integer': 'ID do leiturista deve ser um número inteiro',
    'number.positive': 'ID do leiturista deve ser positivo'
  })
});

export const atualizarLeituraSchema = Joi.object({
  leituraAtual: Joi.number().integer().min(0).optional(),
  dataLeitura: Joi.date().iso().optional(),
  tipoLeitura: Joi.string().valid(...Object.values(TIPOS_LEITURA)).optional(),
  leituristaId: Joi.number().integer().positive().optional()
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser enviado para atualização'
});