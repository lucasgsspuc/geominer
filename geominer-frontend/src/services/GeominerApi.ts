import BaseHttpClient from './BaseHttpClient';
import { AxiosRequestConfig } from 'axios';

class GeominerApi extends BaseHttpClient {
  constructor() {
    super('http://localhost:9000');
  }

  public get<T>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    let parsedParams: any;

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          parsedParams = { ...parsedParams, [key]: value };
        }

        if (Array.isArray(value) && value.length > 0) {
          parsedParams = { ...parsedParams, [key]: value.join(',') };
        }
      });
    }

    return super.get(url, parsedParams, config);
  }
}

export const geominerApi = new GeominerApi();
