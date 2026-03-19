import bcrypt from 'bcryptjs';

export const formatarData = (data: Date = new Date()): string => {
  return data.toISOString().split('T')[0];
};

export const gerarNumeroFatura = (contagem: number): string => {
  const ano = new Date().getFullYear();
  return `FAT-${ano}-${String(contagem + 1).padStart(6, '0')}`;
};

export const gerarNumeroPagamento = (): string => {
  return `PAG-${Date.now()}`;
};

export const gerarNumeroRecibo = (): string => {
  return `REC-${Date.now()}`;
};

interface CalculoFatura {
  subtotal: number;
  valorImposto: number;
  valorTotal: number;
}

export const calcularValoresFatura = (
  consumo: number,
  consumoMinimo = 5,
  valorMinimo = 350.00,
  precoUnitario = 70.00,
  taxaIva = 0
): CalculoFatura => {
  let subtotal: number;
  if (consumo <= consumoMinimo) {
    subtotal = valorMinimo;
  } else {
    const extra = consumo - consumoMinimo;
    subtotal = valorMinimo + extra * precoUnitario;
  }
  const valorImposto = subtotal * taxaIva;
  const valorTotal = subtotal + valorImposto;
  return { subtotal, valorImposto, valorTotal };
};

export const hashSenha = async (senha: string): Promise<string> => {
  return bcrypt.hash(senha, 10);
};

export const compararSenha = async (senha: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(senha, hash);
};

export const omitirSensivel = <T extends object, K extends keyof T>(
  obj: T,
  chaves: K[]
): Omit<T, K> => {
  const resultado = { ...obj };
  for (const chave of chaves) {
    delete resultado[chave];
  }
  return resultado;
};

export const obterPaginacao = (pagina: number = 1, tamanho: number = 10) => {
  const limit = tamanho > 0 ? tamanho : 10;
  const offset = (pagina - 1) * limit;
  return { limit, offset };
};

export const formatarRespostaPaginada = (dados: any[], total: number, pagina: number, limit: number) => {
  return {
    dados,
    meta: {
      total,
      totalPaginas: Math.ceil(total / limit),
      paginaAtual: pagina,
      tamanhoPagina: limit
    }
  };
};