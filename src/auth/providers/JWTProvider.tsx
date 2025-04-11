/* eslint-disable no-unused-vars */
import axios, { AxiosResponse } from 'axios';
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useEffect,
  useState
} from 'react';

import * as authHelper from '../_helpers';
import { type AuthModel, type UserModel } from '@/auth';
import { MutationLogin, MutationRegister } from '@/graphql/services/Usuario';

const API_URL = import.meta.env.VITE_APP_API_URL;
export const LOGIN_URL = `${API_URL}/login`;
export const REGISTER_URL = `${API_URL}/register`;
export const FORGOT_PASSWORD_URL = `${API_URL}/forgot-password`;
export const RESET_PASSWORD_URL = `${API_URL}/reset-password`;
export const GET_USER_URL = `${API_URL}/user`;

interface AuthContextProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  auth: AuthModel | undefined;
  saveAuth: (auth: AuthModel | undefined) => void;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle?: () => Promise<void>;
  loginWithFacebook?: () => Promise<void>;
  loginWithGithub?: () => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  requestPasswordResetLink: (email: string) => Promise<void>;
  changePassword: (
    email: string,
    token: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;
  getUser: () => Promise<{ data: UserModel }>;
  logout: () => void;
  verify: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();
  const { handleLogin, data, error } = MutationLogin();
  const { handleRegister } = MutationRegister();

  const verify = async () => {
    if (auth) {
      try {
        const { data: user } = await getUser();
        setCurrentUser(user);
      } catch {
        saveAuth(undefined);
        setCurrentUser(undefined);
      }
    }
  };

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
      authHelper.setupAxios(axios); // Garante que o token é enviado nas requisições
    } else {
      authHelper.removeAuth();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await handleLogin(email, password);

      if (!response || !response.Login.token) {
        throw new Error('Erro ao obter token de autenticação.');
      }

      const auth: AuthModel = {
        api_token: response.Login.token,
        access_token: response.Login.token
      };
      saveAuth(auth);

      // Obtém os dados do usuário do token ou do backend
      const { data: user } = await getUser();
      setCurrentUser(user);
    } catch (error) {
      saveAuth(undefined);
      console.error('Erro ao fazer login:', error);
      throw new Error(`Erro ao fazer login: ${error}`);
    }
  };

  const register = async (nome: string, email: string, senha: string) => {
    try {
      const user = await handleRegister(nome, email, senha);

      if (user?.SetUsuario.id) {
        console.log('Usuário criado com sucesso:', user);
      } else {
        console.warn('Usuário criado, mas sem ID retornado:', user);
      }

    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      throw new Error(error?.message || 'Erro desconhecido ao criar usuário');
    }
  };

  const requestPasswordResetLink = async (email: string) => {
    await axios.post(FORGOT_PASSWORD_URL, {
      email
    });
  };

  const changePassword = async (
    email: string,
    token: string,
    password: string,
    password_confirmation: string
  ) => {
    await axios.post(RESET_PASSWORD_URL, {
      email,
      token,
      password,
      password_confirmation
    });
  };

  const getUser = async () => {
    const auth = authHelper.getAuth();

    if (auth?.api_token) {
      try {
        // Decodifica o token para obter os dados do usuário diretamente
        const decodedToken = JSON.parse(atob(auth.api_token.split('.')[1]));

        const user: UserModel = {
          id: decodedToken.id,
          email: decodedToken.email,
          nome: decodedToken.nome
        };

        return { data: user };
      } catch (error) {
        console.error('Erro ao decodificar o token', error);
      }
    }

    // Se não conseguiu pegar os dados do token, faz a requisição para o backend
    return await axios.get<UserModel>(GET_USER_URL);
  };

  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth,
        currentUser,
        setCurrentUser,
        login,
        register,
        requestPasswordResetLink,
        changePassword,
        getUser,
        logout,
        verify
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
