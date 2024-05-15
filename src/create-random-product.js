import { Product } from "./product";
import { ProductsRepository } from "./products.repository";
import { fakerPT_BR } from "@faker-js/faker";

export class CreateRandomProduct {
  /**
   * @type {ProductsRepository}
   */
  #productsRepository;

  /**
   *
   * @param {ProductsRepository} productsRepository
   */
  constructor(productsRepository) {
    this.#productsRepository = productsRepository;
  }

  async execute() {
    const product = new Product({
      descricao: fakerPT_BR.commerce.productName().slice(0, 50),
      categoria: fakerPT_BR.commerce.department().slice(0, 10),
      valor: fakerPT_BR.commerce.price(),
      criadoEm: fakerPT_BR.date.recent(),
    });
    try {
      console.log(
        `[CreateAndFindProducts.execute] criando o produto ${JSON.stringify(
          product,
          null,
          2
        )}...`
      );

      const createdProduct = await this.#productsRepository.create(product);

      console.log(
        `[CreateAndFindProducts.execute] produto criado: ${JSON.stringify(
          createdProduct,
          null,
          2
        )}`
      );

      return createdProduct;
    } catch (error) {
      console.error(
        `[CreateAndFindProducts.execute] erro ao criar o produto ${product.descricao}: `,
        error
      );

      throw error;
    }
  }
}
