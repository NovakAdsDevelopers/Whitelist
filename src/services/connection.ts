import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;
const VITE_APP_API_META_URL = import.meta.env.VITE_APP_API_META_URL;

if (!API_URL) throw new Error("VITE_APP_API_URL não definida no .env");
if (!VITE_APP_API_META_URL)
  throw new Error("VITE_APP_API_META_URL não definida no .env");

// ====================================================================
// 🔔 Callbacks de UI / Auth
// ====================================================================
let openModalCallback: (path: unknown) => void;
export const setOpenModalCallback = (cb: (path: unknown) => void) => {
  openModalCallback = cb;
};

let logoutCallback: () => void;
export const setLogoutCallback = (cb: () => void) => {
  logoutCallback = cb;
};

// 🔒 Evita múltiplos disparos de logout simultâneos
let authErrorLock = false;
const triggerAuthHandlers = (path?: unknown) => {
  if (authErrorLock) return;
  authErrorLock = true;

  try {
    if (openModalCallback) openModalCallback(path);
    if (logoutCallback) logoutCallback();
  } finally {
    // libera após um pequeno debounce
    setTimeout(() => (authErrorLock = false), 2000);
  }
};

// ====================================================================
// 🚨 Tratamento de erros
// ====================================================================
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors?.length) {
    for (const err of graphQLErrors) {
      const message = err.message?.toLowerCase?.() ?? "";
      const code = (err.extensions?.code ?? "").toString().toUpperCase();

      // 🚨 só dispara logout se for token expirado ou mensagem de sessão expirada
      const isJwtExpired =
        message.includes("jwt expired") ||
        message.includes("tokenexpirederror") ||
        message.includes("sessão expirada") ||
        code === "TOKEN_EXPIRED";

      if (isJwtExpired) {
        console.warn("⚠️ Token expirado — sessão encerrada.");
        triggerAuthHandlers(err.path);
        return;
      }

      // ⚠️ Evita logout indevido em erros genéricos (UNAUTHENTICATED, 401, etc.)
      if (import.meta.env.DEV) {
        console.log(
          `[GraphQL error]: Message: ${err.message}, Code: ${code}, Path: ${err.path}`
        );
      }
    }
  }

  // ⚠️ 401 genérico não aciona logout
  const status =
    (networkError as any)?.statusCode ?? (networkError as any)?.status;
  if (status === 401) {
    console.warn("⚠️ Erro 401 detectado — ignorado (sem logout)");
  }

  if (networkError && import.meta.env.DEV) {
    console.error("[Network error]:", networkError);
  }
});

// ====================================================================
// 🌐 Links HTTP com cookies JWT (httpOnly)
// ====================================================================
const httpLink = new HttpLink({
  uri: API_URL,
  credentials: "include", // garante envio automático de cookies
});

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
// 🛰️ Apollo Client secundário (API Meta GraphQL)
// ====================================================================
const metaHttpLink = new HttpLink({
  uri: VITE_APP_API_META_URL,
  credentials: "include",
});

export const metaClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, metaHttpLink]),
  defaultOptions: {
    mutate: { errorPolicy: "all" },
  },
});

// ====================================================================
// 🧩 Axios (para REST Meta API)
// ====================================================================
export const metaApi = axios.create({
  baseURL: VITE_APP_API_META_URL,
  withCredentials: true,
});

export const fetchMetaData = async (endpoint: string) => {
  try {
    const { data } = await metaApi.get(endpoint);
    return data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Erro ao buscar dados do Meta:", error);
    }
    throw error;
  }
};
