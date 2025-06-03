import { geominerApi } from './GeominerApi';

export const PRODUCTS_PATH = '/products';

export class ProductService {
  static async home() {
    return geominerApi
      .get<any>(`${PRODUCTS_PATH}/home`)
      .then((response) => response.data);
  }

  static async getAll() {
    return geominerApi
      .get<any>(`${PRODUCTS_PATH}`)
      .then((response) => response.data);
  }
}
