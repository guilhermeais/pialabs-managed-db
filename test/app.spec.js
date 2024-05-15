import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import { makeApp } from "../src/app";
import { CreateAndFindManyProducts } from "../src/create-and-find-many-products";
import { Product } from "../src/product";
import { ProductsRepository } from "../src/products.repository";
import { env } from "../src/env";

describe("App", () => {
  /**
   * @type {ReturnType<typeof makeApp>}
   */
  let app;
  /**
   * @type {CreateAndFindManyProducts}
   */
  let createAndFindManyProducts;
  /**
   * @type {ProductsRepository}
   */
  let productsRepository;
  /**
   * @type {import("mysql2").Pool}
   */
  let readDbPool;
  /**
   * @type {import("mysql2").Pool}
   */
  let writeDbPool;

  beforeAll(async () => {
    app = makeApp();
    createAndFindManyProducts = app.dependencies.createAndFindManyProducts;
    productsRepository = app.dependencies.productsRepository;

    readDbPool = app.dependencies.readDbPool;
    writeDbPool = app.dependencies.writeDbPool;
  });

  afterEach(async () => {
    await productsRepository.deleteAll();
  });

  afterAll(async () => {
    app.stop();
    await new Promise((resolve) => {
      readDbPool.end((err) => {
        if (err) {
          console.error("[readDbPool.end] error: ", err);
        }
        resolve();
      });
    });

    await new Promise((resolve) => {
      writeDbPool.end((err) => {
        if (err) {
          console.error("[writeDbPool.end] error: ", err);
        }
        resolve();
      });
    });
  });

  describe("CreateAndFindManyProducts", () => {
    it("should create a new product for each interaction of the generator", async () => {
      env.CREATE_PRODUCT_INTERVAL_MS = 0;
      const productsGenerator = createAndFindManyProducts.execute();
      const { value: firstValue } = await productsGenerator.next();
      const { stop } = firstValue;
      expect(stop).toBeDefined();
      expect(stop).toBeInstanceOf(Function);

      const { value: secondValue } = await productsGenerator.next();
      const { product } = secondValue;

      expect(product).toBeDefined();
      expect(product).toBeInstanceOf(Product);

      const { value: thirdValue } = await productsGenerator.next();
      const { product: secondProduct } = thirdValue;

      expect(secondProduct).toBeDefined();
      expect(secondProduct).toBeInstanceOf(Product);

      stop();

      const { value: fourthValue, done } = await productsGenerator.next();
      expect(fourthValue).toBeUndefined();
      expect(done).toBeTruthy();

      const productsAfterStop = await productsRepository.findMany([
        product.id,
        secondProduct.id,
      ]);

      expect(productsAfterStop).toHaveLength(2);

      expect(productsAfterStop[0].id).toBe(product.id);
      expect(productsAfterStop[0].descricao).toBe(product.descricao);
    });
  });
});
