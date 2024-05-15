import { Product } from "./product";
import { ProductsRepository } from "./products.repository";

export class MySQLProductsRepository extends ProductsRepository {
  /**
   * @type {import("mysql2").Pool}
   */
  #readDb;
  /**
   * @type {import("mysql2").Pool}
   */
  #writeDb;
  constructor(readDb, writeDb) {
    super()
    this.#readDb = readDb;
    this.#writeDb = writeDb;
  }

  /**
   *
   * @param {Product} product
   * @returns {Promise<Product>}
   */
  async create(product) {
    try {
      console.log(
        `[ProductRepository.create] criando o produto ${JSON.stringify(
          product,
          null,
          2
        )} no banco de dados...`
      );

      const sql = `
            INSERT INTO produto (descricao, categoria, valor, criado_em, criado_por)
            VALUES (?, ?, ?, ?, ?)
        `;

      const args = [
        product.descricao,
        product.categoria,
        product.valor,
        product.criadoEm,
        product.criadoPor,
      ];

      const result = await new Promise((resolve, reject) => {
        this.#writeDb.query(sql, args, (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        });
      });

      console.log(
        `[ProductRepository.create] produto ${
          product.descricao
        }  resultado: ${JSON.stringify(result, null, 2)}`
      );

      product.id = result.insertId;

      console.log(
        `[ProductRepository.create] produto ${product.id} - ${
          product.descricao
        } criado com sucesso no banco de dados: ${JSON.stringify(
          product,
          null,
          2
        )}`
      );

      return product;
    } catch (error) {
      console.error(
        `[ProductRepository.create] erro ao criar o produto "${product.descricao}" no banco de dados: ${error.message}`
      );
      throw error;
    }
  }

  async findMany(productIds = []) {
    try {
      console.log(
        `[ProductRepository.findMany] buscando os produtos ${productIds.join(
          ", "
        )} no banco de dados...`
      );

      const sql = `
            SELECT id, descricao, categoria, valor, criado_em, criado_por
            FROM produto
            WHERE id IN (?)
        `;

      const args = [productIds];

      const results = await new Promise((resolve, reject) => {
        this.#readDb.query(sql, args, (error, results) => {
          if (error) {
            reject(error);
            return;
          }
          
          resolve(results);
        });
      });

      console.log(
        `[ProductRepository.findMany] produtos encontrados: ${JSON.stringify(
          results,
          null,
          2
        )}`
      );

      return results.map(
        (row) =>
          new Product({
            id: row.id,
            descricao: row.descricao,
            categoria: row.categoria,
            valor: row.valor,
            criadoEm: row.criado_em,
            criadoPor: row.criado_por,
          })
      );
    } catch (error) {
      console.error(
        `[ProductRepository.findMany] erro ao buscar os produtos ${productIds.join(
          ", "
        )} no banco de dados: ${error.message}`
      );
      throw error;
    }
  }

  deleteAll() {
    return new Promise((resolve, reject) => {
      this.#writeDb.query("DELETE FROM produto", (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
}
