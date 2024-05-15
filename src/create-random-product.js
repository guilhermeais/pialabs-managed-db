import { Product } from "./product";
import { ProductsRepository } from "./products.repository";
import { faker } from "@faker-js/faker";

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
      descricao: `${faker.commerce.product()} [${faker.string.uuid()}]`,
      categoria: faker.commerce.department().slice(0, 10),
      valor: faker.commerce.price(),
      criadoEm: faker.date.recent(),
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
