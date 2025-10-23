import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import axios from "axios";

// ====================================================================
// 🔧 Variáveis de ambiente
// ====================================================================
const API_URL = import.meta.env.VITE_APP_API_URL; // URL da sua API GraphQL principal
const VITE_APP_API_META_URL = import.meta.env.VITE_APP_API_META_URL; // URL da API do Meta

if (!API_URL) throw new Error("VITE_APP_API_URL não definida no .env");
if (!VITE_APP_API_META_URL) throw new Error("VITE_APP_API_META_URL não definida no .env");

// ====================================================================
// 💬 Callback opcional (para exibir modal de sessão expirada)
// ====================================================================
let openModalCallback: (path: any) => void;
export const setOpenModalCallback = (callback: (path: any) => void) => {
  openModalCallback = callback;
};

// ====================================================================
// 🚨 Tratamento de erros
// ====================================================================
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      if (message.includes("jwt expired")) {
        console.warn("Token expirado — abrir modal ou refazer login");
        if (openModalCallback) openModalCallback(path);
      }

      switch (extensions?.code) {
        case "UNAUTHENTICATED":
          console.warn("Usuário não autenticado.");
          break;
        default:
          console.log(`[GraphQL error]:`, message);
      }

      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }

  if (networkError) console.error(`[Network error]:`, networkError);
});

// ====================================================================
// 🌐 Link HTTP principal — com credenciais (cookies httpOnly)
// ====================================================================
const httpLink = new HttpLink({
  uri: API_URL,
  credentials: "include", // 🔥 envia cookies automaticamente (httpOnly)
});

// ====================================================================
// 🚀 Apollo Client principal
// ====================================================================
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, httpLink]),
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network", errorPolicy: "all" },
    query: { fetchPolicy: "network-only", errorPolicy: "all" },
    mutate: { errorPolicy: "all" },
  },
});

// ====================================================================
// 🛰️ Apollo Client secundário (API do Meta GraphQL)
// ====================================================================
const metaHttpLink = new HttpLink({
  uri: VITE_APP_API_META_URL,
  credentials: "include", // também envia cookies se precisar
});

export const metaClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, metaHttpLink]),
  defaultOptions: {
    mutate: { errorPolicy: "all" },
  },
});

// ====================================================================
// 🧩 Axios (caso a API Meta seja REST)
// ====================================================================
export const metaApi = axios.create({
  baseURL: VITE_APP_API_META_URL,
  withCredentials: true, // 🔥 garante envio automático de cookies
});

// Função auxiliar para requisições REST
export const fetchMetaData = async (endpoint: string) => {
  try {
    const response = await metaApi.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do Meta:", error);
    throw error;
  }
};
