import Joi from 'joi';
import { REGEX } from '../utils/constantes';

export const criarConsumidorSchema = Joi.object({
  nomeCompleto: Joi.string().max(250).required().messages({
    'string.empty': 'Nome completo é obrigatório',
    'string.max': 'Nome completo deve ter no máximo 250 caracteres'
  }),
  identificacao: Joi.string().pattern(REGEX.IDENTIFICACAO).required().messages({
    'string.empty': 'Identificação é obrigatória',
    'string.pattern.base': 'Identificação deve conter apenas números (9-12 dígitos)'
  }),
  nacionalidade: Joi.string().max(50).required().messages({
    'string.empty': 'Nacionalidade é obrigatória'
  }),
  naturalidade: Joi.string().max(100).required().messages({
    'string.empty': 'Naturalidade é obrigatória'
  }),
  estadoCivil: Joi.string().max(30).required().messages({
    'string.empty': 'Estado civil é obrigatório'
  }),
  dataNascimento: Joi.date().iso().optional().messages({
    'date.iso': 'Data de nascimento deve estar no formato ISO (YYYY-MM-DD)'
  }),
  telefone: Joi.string().pattern(REGEX.TELEFONE).required().messages({
    'string.empty': 'Telefone é obrigatório',
    'string.pattern.base': 'Telefone deve conter apenas números (9-12 dígitos)'
  }),
  bairro: Joi.string().max(100).required().messages({
    'string.empty': 'Bairro é obrigatório'
  }),
  rua: Joi.string().max(100).required().messages({
    'string.empty': 'Rua é obrigatória'
  }),
  genero: Joi.string().max(10).required().messages({
    'string.empty': 'Gênero é obrigatório'
  }),
  codigoFatura: Joi.string().pattern(REGEX.CODIGO_FATURA).optional().messages({
    'string.pattern.base': 'Código de fatura deve seguir o formato FAT-AAAA-NNNNNN'
  })
});

export const atualizarConsumidorSchema = Joi.object({
  nomeCompleto: Joi.string().max(250).optional(),
  identificacao: Joi.string().pattern(REGEX.IDENTIFICACAO).optional(),
  nacionalidade: Joi.string().max(50).optional(),
  naturalidade: Joi.string().max(100).optional(),
  estadoCivil: Joi.string().max(30).optional(),
  dataNascimento: Joi.date().iso().optional(),
  telefone: Joi.string().pattern(REGEX.TELEFONE).optional(),
  bairro: Joi.string().max(100).optional(),
  rua: Joi.string().max(100).optional(),
  genero: Joi.string().max(10).optional(),
  codigoFatura: Joi.string().pattern(REGEX.CODIGO_FATURA).optional()
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser enviado para atualização'
});