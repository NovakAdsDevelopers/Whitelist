import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import axios from 'axios';

// Certifique-se de que as variáveis de ambiente estão definidas
const API_URL = import.meta.env.VITE_APP_API_URL; // URL da API principal
const VITE_APP_API_META_URL = import.meta.env.VITE_APP_API_META_URL; // URL da API do Meta

// Verifica se as variáveis de ambiente estão configuradas corretamente
if (!API_URL) {
  console.error('API URL is not defined in environment variables: VITE_APP_API_URL');
  throw new Error('VITE_APP_API_URL is not defined in environment variables');
}

if (!VITE_APP_API_META_URL) {
  console.error('API META URL is not defined in environment variables: VITE_APP_API_META_URL');
  throw new Error('VITE_APP_API_META_URL is not defined in environment variables');
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

// Configuração do link HTTP para a API principal
const httpLink = new HttpLink({
  uri: API_URL
});

// Middleware para adicionar o token de autorização à requisição
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

// Configuração do cliente Apollo para a API principal
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authMiddleware, errorLink, httpLink]),
  defaultOptions: {
    mutate: { errorPolicy: 'all' }
  }
});

// Configuração do link HTTP para a API do Meta (caso seja GraphQL)
const metaHttpLink = new HttpLink({
  uri: VITE_APP_API_META_URL
});

// Configuração do cliente Apollo para a API do Meta
export const metaClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authMiddleware, errorLink, metaHttpLink]),
  defaultOptions: {
    mutate: { errorPolicy: 'all' }
  }
});

// Cliente Axios para a API do Meta (caso seja REST)
export const metaApi = axios.create({
  baseURL: VITE_APP_API_META_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`
  }
});

// Função para fazer uma requisição à API REST do Meta
export const fetchMetaData = async (endpoint: string) => {
  try {
    const response = await metaApi.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching Meta data:', error);
    throw error;
  }
};
