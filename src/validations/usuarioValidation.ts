import Joi from 'joi';

export const criarUsuarioSchema = Joi.object({
  nome: Joi.string().max(100).required().messages({
    'string.empty': 'Nome é obrigatório',
    'string.max': 'Nome deve ter no máximo 100 caracteres'
  }),
  nomeUsuario: Joi.string().max(50).required().messages({
    'string.empty': 'Nome de usuário é obrigatório',
    'string.max': 'Nome de usuário deve ter no máximo 50 caracteres'
  }),
  senha: Joi.string().min(6).required().messages({
    'string.empty': 'Senha é obrigatória',
    'string.min': 'Senha deve ter no mínimo 6 caracteres'
  }),
  papelId: Joi.number().integer().positive().required().messages({
    'number.base': 'ID do papel deve ser um número',
    'number.integer': 'ID do papel deve ser um número inteiro',
    'number.positive': 'ID do papel deve ser positivo'
  })
});

export const atualizarUsuarioSchema = Joi.object({
  nome: Joi.string().max(100).optional(),
  senha: Joi.string().min(6).optional(),
  papelId: Joi.number().integer().positive().optional()
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser enviado para atualização'
});