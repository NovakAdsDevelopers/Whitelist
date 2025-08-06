import { TipoUsuario } from '@/graphql/types/Usuario';

interface IUsuariosLogData {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  criadoEm: Date;
  atualizadoEm: Date;
}

export { type IUsuariosLogData };
