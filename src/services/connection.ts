import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Certifique-se de que a variável de ambiente está definida
const API_URL = import.meta.env.VITE_APP_API_URL; // Use a variável de ambiente correta

if (!API_URL) {
  console.error('API URL is not defined in environment variables: VITE_APP_API_URL');
  throw new Error('VITE_APP_API_URL is not defined in environment variables');
}

let openModalCallback: (path: any) => void;

// Função para definir o callback para abrir o modal
export const setOpenModalCallback = (callback: (path: any) => void) => {
  openModalCallback = callback;
};

// Configuração do link de erro
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      if (message === "Error: Ip's are different") {
        window.location.href = '/logout'; // Redireciona para o logout se o IP for diferente
      }

      if (message === 'TokenExpiredError: jwt expired') {
        if (openModalCallback) {
          openModalCallback(path); // Chama a função para abrir o modal se o token expirou
        }
      }

      // Lida com erros de autenticação ou outros tipos
      switch (extensions?.code) {
        case 'UNAUTHENTICATED':
          console.log('User is unauthenticated');
          break;
        default:
          console.log('GraphQL Error:', extensions?.code);
      }

      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Configuração do link HTTP
const httpLink = new HttpLink({
  uri: API_URL
});

// Middleware para adicionar o token de autorização
const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No token found, authorization header will be empty');
  }

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '' // Adiciona o token ao cabeçalho
    }
  }));

  return forward(operation);
});

// Criação do cliente Apollo
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authMiddleware, errorLink, httpLink]),
  defaultOptions: {
    mutate: { errorPolicy: 'all' }
  }
});
