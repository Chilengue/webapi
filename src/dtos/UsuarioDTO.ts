// src/dtos/UsuarioDTO.ts
export interface CriarUsuarioDTO {
  nome: string;
  nomeUsuario: string;
  senha: string;
  papelId: number;
}

export interface AtualizarUsuarioDTO {
  nome?: string;
  senha?: string;
  papelId?: number;
}

export interface UsuarioResponseDTO {
  id: number;
  nome: string;
  nomeUsuario: string;
  dataCriacao?: Date;
  papeis: { id: number; nome: string }[];
}