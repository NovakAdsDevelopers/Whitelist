export enum TipoUsuario {
  'ADMIN',
  'GERENTE',
  'USUARIO'
}

export interface TypesGetUsuarios {
  GetUsuarios: {
    result: {
      id: number;
      nome: string;
      email: string;
      tipo: TipoUsuario;
      criadoEm: Date;
      atualizadoEm: Date;
    }[];
    pageInfo: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface TypesLogin{
  Login: {
    token: string;
  }
}

export interface TypesRegister{
  SetUsuario:{
    id: number;
  }
}
