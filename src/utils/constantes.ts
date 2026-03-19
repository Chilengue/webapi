// Status de fatura
export const STATUS_FATURA = {
  PENDENTE: 'PENDENTE',
  PAGA: 'PAGA',
  VENCIDA: 'VENCIDA',
  CANCELADA: 'CANCELADA'
} as const;

// Métodos de pagamento
export const METODOS_PAGAMENTO = {
  DINHEIRO: 'DINHEIRO',
  MULTICAIXA: 'MULTICAIXA',
  TRANSFERENCIA: 'TRANSFERENCIA',
  CHEQUE: 'CHEQUE'
} as const;

// Tipos de leitura
export const TIPOS_LEITURA = {
  REAL: 'REAL',
  ESTIMADA: 'ESTIMADA'
} as const;

// Status de pagamento
export const STATUS_PAGAMENTO = {
  CONCLUIDO: 'CONCLUIDO',
  ESTORNADO: 'ESTORNADO',
  CANCELADO: 'CANCELADO'
} as const;

// Papéis de usuário
export const PAPEIS_USUARIO = {
  ADMIN: 'ADMIN',
  CAIXA: 'CAIXA',
  MEDIADOR: 'MEDIADOR',
  CONSUMIDOR: 'CONSUMIDOR'
} as const;

// Valores padrão
export const DEFAULTS = {
  CONSUMO_MINIMO: 5,      // m³
  VALOR_MINIMO: 350.00,   // MZN
  PRECO_UNITARIO: 70.00,  // MZN por m³ adicional
  TAXA_IVA: 0,         // 17% IVA
  SENHA_PADRAO: '123456'  // senha padrão para novos consumidores
};

// Expressões regulares úteis
export const REGEX = {
  TELEFONE: /^[0-9]{9,12}$/,
  IDENTIFICACAO: /^[0-9]{9,12}$/,
  CODIGO_FATURA: /^FAT-\d{4}-\d+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// Mensagens de erro
export const MENSAGENS_ERRO = {
  NAO_ENCONTRADO: (entidade: string) => `${entidade} não encontrado(a)`,
  DUPLICADO: (campo: string) => `${campo} já existe`,
  CREDENCIAIS_INVALIDAS: 'Credenciais inválidas',
  NAO_AUTORIZADO: 'Não autorizado',
  ACESSO_NEGADO: 'Acesso negado',
  PERMISSOES_INSUFICIENTES: 'Permissões insuficientes',
  LEITURA_INVALIDA: 'Leitura atual deve ser maior que a anterior',
  PAGAMENTO_EXCEDE_SALDO: 'Valor do pagamento excede o saldo devedor'
};

// Configurações de paginação
export const PAGINACAO = {
  PAGINA_PADRAO: 1,
  LIMITE_PADRAO: 10,
  LIMITE_MAXIMO: 100
};