import { useMutation, useQuery } from '@apollo/client';
import { TypesGetUsuarios, TypesLogin } from '../types/Usuario';
import { GET_USUARIOS, LOGIN } from '../schemas/Usuario';

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
      console.error("Erro ao fazer login:", err);
      throw err; // Lança o erro para tratamento externo, se necessário
    }
  };

  return { handleLogin, data, error, loading };
}
