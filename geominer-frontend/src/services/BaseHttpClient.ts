import axios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';

class BaseHttpClient {
  public instance: AxiosInstance;

  constructor(baseURL: string, headers?: Pick<AxiosRequestConfig, 'headers'>) {
    this.instance = axios.create({
      baseURL,
      headers: headers?.headers,
      withCredentials: true,
    });
  }

  public get<T>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.get(url, {
      params,
      ...config,
    });
  }

  public post<T>(
    url: string,
    data: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.post(url, data, config);
  }

  public put<T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.put(url, data, config);
  }

  public patch<T>(url: string, data?: object): Promise<T> {
    return this.instance.patch(url, data);
  }

  public delete(url: string): Promise<AxiosResponse> {
    return this.instance.delete(url);
  }
}

export default BaseHttpClient;
