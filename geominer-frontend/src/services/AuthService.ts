import { geominerApi } from './GeominerApi';

export const AUTH_PATH = '/auth';

export class AuthService {
  static async login(data: any) {
    return geominerApi
      .post<any>(`${AUTH_PATH}/sign-in`, data)
      .then((response) => response.data);
  }

  static async register(data: any) {
    return geominerApi
      .post<any>(`${AUTH_PATH}/sign-up`, data)
      .then((response) => response.data);
  }

  static async getProfile() {
    return geominerApi
      .get<any>(`${AUTH_PATH}/profile`)
      .then((response) => response.data);
  }
}
