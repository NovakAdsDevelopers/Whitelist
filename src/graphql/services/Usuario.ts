import { useMutation, useQuery } from '@apollo/client';
import { TypesGetUsuarios, TypesLogin, TypesRegister } from '../types/Usuario';
import { GET_USUARIOS, LOGIN, REGISTER } from '../schemas/Usuario';

interface QueryProps {
  variables: any;
}

export function QueryGetUsuarios({ variables }: QueryProps) {
  const { data, error, loading } = useQuery<TypesGetUsuarios>(GET_USUARIOS, {
    variables,
    fetchPolicy: 'network-only'
  });

  return { data, error, loading };
}

export function MutationLogin() {
  const [loginBody, { data, error, loading }] = useMutation<TypesLogin>(LOGIN);

  const handleLogin = async (email: string, senha: string) => {
    try {
      const response = await loginBody({ variables: { email, senha } });
      return response.data; // Retorna os dados da mutação
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      throw err; // Lança o erro para tratamento externo, se necessário
    }
  };

  return { handleLogin, data, error, loading };
}

export function MutationRegister() {
  const [loginBody, { data, error, loading }] = useMutation<TypesRegister>(REGISTER);

  const handleRegister = async (
    nome: string,
    email: string,
    senha: string,
    tipo: string = 'USUARIO'
  ) => {
    try {
      const response = await loginBody({
        variables: {
          data: {
            email,
            nome,
            senha,
            tipo
          }
        }
      });
      return response.data; // Retorna os dados da mutação
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      throw err; // Lança o erro para tratamento externo, se necessário
    }
  };

  return { handleRegister, data, error, loading };
}
