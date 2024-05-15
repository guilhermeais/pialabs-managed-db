import { Product } from "./product";

export class ProductsRepository {
  /**
   *
   * @param {Product} product
   * @returns {Promise<Product>}
   */
  async create(product) {}

  /**
   *
   * @param {number[]} productIds
   * @returns {Promise<Product[]>}
   */
  async findMany(productIds = []) {}

  async deleteAll() {}
}
