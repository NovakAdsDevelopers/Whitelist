import { User as Auth0UserModel } from '@auth0/auth0-spa-js';
import { getData, setData } from '@/utils';
import { type AuthModel } from './_models';

const AUTH_LOCAL_STORAGE_KEY = `${import.meta.env.VITE_APP_NAME}-auth-v${
  import.meta.env.VITE_APP_VERSION
}`;

/**
 * Obtém os dados de autenticação armazenados no localStorage.
 */
const getAuth = (): AuthModel | undefined => {
  try {
    const auth = getData(AUTH_LOCAL_STORAGE_KEY) as AuthModel | undefined;
    return auth ?? undefined;
  } catch (error) {
    console.error('Erro ao recuperar autenticação do localStorage:', error);
    return undefined;
  }
};

/**
 * Armazena os dados de autenticação no localStorage.
 */
const setAuth = (auth: AuthModel | Auth0UserModel) => {
  setData(AUTH_LOCAL_STORAGE_KEY, auth);
};

/**
 * Remove os dados de autenticação do localStorage.
 */
const removeAuth = () => {
  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao remover autenticação do localStorage:', error);
  }
};

/**
 * Configura o Axios para incluir o token de autenticação automaticamente.
 */
export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json';

  axios.interceptors.request.use(
    (config: { headers: { Authorization?: string } }) => {
      const auth = getAuth();

      if (auth?.api_token) {
        config.headers.Authorization = `Bearer ${auth.api_token}`;
      }

      return config;
    },
    async (err: any) => Promise.reject(err)
  );
}

export { AUTH_LOCAL_STORAGE_KEY, getAuth, removeAuth, setAuth };
