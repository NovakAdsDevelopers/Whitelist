import { type TLanguageCode } from '@/i18n';

export interface AuthModel {
  access_token: string;
  api_token: string;
}

export interface UserModel {
  id: number;
  email: string;
  nome: string;
  tipo: string;
  fullname?: string;
  occupation?: string;
  companyName?: string;
  phone?: string;
  roles?: number[];
  pic?: string;
  language?: TLanguageCode;
  auth?: AuthModel;
}
