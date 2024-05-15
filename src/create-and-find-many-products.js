import { CreateRandomProduct } from "./create-random-product";
import { ProductsRepository } from "./products.repository";

export class CreateAndFindManyProducts {
  /**
   * @type {CreateRandomProduct}
   */
  #createRandomProduct;
  /**
   * @type {ProductsRepository}
   */
  #productsRepository;

  #createdProductIds = [];

  #maxProducts;

  constructor(productsRepository, createRandomProduct, maxProducts) {
    this.#createRandomProduct = createRandomProduct;
    this.#productsRepository = productsRepository;
    this.#maxProducts = maxProducts;
  }

  async *execute() {
    console.log(
      `[CreateAndFindManyProducts.execute] iniciando criação de produtos`
    );

    let keepCreating = true;

    function stop() {
      console.log(
        `[CreateAndFindManyProducts.execute] finalizando a criação de produtos...`
      );
      keepCreating = false;

      return;
    }

    yield {
      stop,
    };

    while (keepCreating) {
      try {
        const createdProduct = await this.#createRandomProduct.execute();
        this.#createdProductIds.push(createdProduct.id);
        yield {
          product: createdProduct,
        };
      } catch (error) {
        console.error(
          `[CreateAndFindManyProducts.execute] erro ao criar produto: `,
          error
        );
      }

      if (this.#createdProductIds.length === 10) {
        const productIds = this.#createdProductIds.slice(-10);
        await this.#consumeProducts(productIds);
        this.#createdProductIds = [];
      }

      if (
        typeof this.#maxProducts === "number" &&
        this.#maxProducts === this.#createdProductIds.length
      ) {
        console.log(
          `[CreateAndFindManyProducts.execute] finalizando a criação de produtos...`
        );
        keepCreating = false;
        return;
      }
    }

    return;
  }

  async #consumeProducts(productIds = []) {
    console.log(
      `[CreateAndFindManyProducts.#consumeProducts] consumindo os últimos 10 produtos criados...`
    );

    const products = await this.#productsRepository.findMany(productIds);

    console.log(
      `[CreateAndFindManyProducts.#consumeProducts] ultimos 10 produts produtos encontrados: ${JSON.stringify(
        products,
        null,
        2
      )}`
    );
  }
}
